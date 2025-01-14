import React, { useState, useEffect } from 'react';
import {
    Fieldset,
    TabPanel,
    DataView,
    TabView,
    Button,
    Rating,
    Tag
} from "../../components/index";
import ReviewOpenDialog from '../../components/Review-dialog/ReviewOpenDialog';
import ReviewRateDialog from '../../components/Review-dialog/ReviewRateDialog';
import ReviewUpdateDialog from '../../components/Review-dialog/ReviewUpdateDialog';
import "./worksToReview.css";
import axios from "axios";


export default function WorksToReview() {
    // Databaza --------------------------------------------------------------------------------------------------------
    const [Reviews, setReviews] = useState([]);
    const [Conferences, setConferences] = useState([]);

    const getUserFromLocalStorage = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    const user = getUserFromLocalStorage();

    const fetchArticles = () => {
        axios.get('http://localhost:8080/api/articles')
            .then(response => {
                const filteredReviews = response.data.filter(article => article.reviewerId === user.id);
                setReviews(filteredReviews);
            })
            .catch(error => console.error(error));
    };

    const fetchConferences = () => {
        axios.get('http://localhost:8080/api/conferences')
            .then(response => { setConferences(response.data)})
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchArticles();
        fetchConferences();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return null; // Handle missing or invalid dates
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const filterReviewConference = (review, conferences) => {
        // Find the conference that contains the article matching the review ID
        const matchingConference = conferences.find(conference =>
            conference.articles.some(article => article.id === review.id)
        );
        if (matchingConference) {
            // Return relevant conference details
            return {
                name: matchingConference.name,
                startReview: formatDate(matchingConference.startReview),
                closeReview: formatDate(matchingConference.closeReview)
            };
        } else {
            // Return default values if no match is found
            return {
                name: "No matching conference",
                startReview: null,
                closeReview: null
            };
        }
    };

    // Dialog ----------------------------------------------------------------------------------------------------------
    const [archiveVisible, setArchiveVisible] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    //const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedArticle1, setSelectedArticle1] = useState(null);
    const [selectedArticle2, setSelectedArticle2] = useState(null);
    const [selectedArticle3, setSelectedArticle3] = useState(null);
    const [selectedConference, setSelectedConference] = useState(null);
    const [reviewID, setReviewID] = useState(null);
    const [proConID, setProConID] = useState(null);


    const [ratings, setRatings] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    const [inputTextValue, setInputTextValue] = useState('');
    const [starValue, setStarValue] = useState(null);

    const processRatings = (Details) => {
        if (Details && Details.prosAndConsList) {
            const pros = Details.prosAndConsList.filter(item => item.category.name === "PRO").map(item => item.description);
            const cons = Details.prosAndConsList.filter(item => item.category.name === "CON").map(item => item.description);
            // Pair PRO and CON descriptions into an array
            const formattedRatings = [];
            const maxLength = Math.max(pros.length, cons.length);
            for (let i = 0; i < maxLength; i++) {
                formattedRatings.push({
                    PRO: pros[i] || "", // Use an empty string if no PRO at this index
                    CON: cons[i] || "" // Use an empty string if no CON at this index
                });
            }
            setRatings(formattedRatings);
        } else {
            setRatings([]); // Reset if no prosAndConsList
        }
    };

    // Dialog Na Ohodnotenie/Upravu ------------------------------------------------------------------------------------
    const [text, setText] = useState('');
    const [plusList, setPlusList] = useState([]);
    const [minusList, setMinusList] = useState([]);
    const [selectedPlusItem, setSelectedPlusItem] = useState(null);
    const [selectedMinusItem, setSelectedMinusItem] = useState(null);
    const addToPlusList = () => {
        if (text.trim()) {
            setPlusList([...plusList, text.trim()]);
            setText('');
        }
    };
    const addToMinusList = () => {
        if (text.trim()) {
            setMinusList([...minusList, text.trim()]);
            setText('');
        }
    };
    const deleteFromPlusList = () => {
        if (selectedPlusItem) {
            setPlusList(plusList.filter(item => item !== selectedPlusItem));
            setSelectedPlusItem(null);
        }
    };
    const deleteFromMinusList = () => {
        if (selectedMinusItem) {
            setMinusList(minusList.filter(item => item !== selectedMinusItem));
            setSelectedMinusItem(null);
        }
    };
    const ratingFooterContent = (
        <div className="flex justify-content-center">
            <Button label="Ohodnotiť"
                    icon="pi pi-star-fill"
                    className="p-button-rounded custom-width"
                    onClick={() => onRatingSendClick()}
            />
        </div>
    );

    // Dialog Na Upravu ------------------------------------------------------------------------------------------------
    const editFooterContent = (
        <div className="flex justify-content-center">
            <Button label="Upraviť"
                    icon="pi pi-user-edit"
                    severity="warning"
                    className="p-button-rounded custom-width"
                    onClick={() => onUpdateSendClick()}/>
        </div>
    );

    // Buttons ---------------------------------------------------------------------------------------------------------
    const onOpenClick = (ReviewDetails, ConferenceName) => {
        setSelectedArticle1(ReviewDetails);
        setSelectedConference(ConferenceName);
        processRatings(ReviewDetails);
        setArchiveVisible(true);
    };

    const onRatingClick = (ReviewDetails, ConferenceName) => {
        setSelectedArticle2(ReviewDetails);
        setSelectedConference(ConferenceName);
        setStarValue(0);
        setInputTextValue('');
        setText('');
        setPlusList([]);
        setMinusList([]);
        setRatingVisible(true);
    };

    const onRatingSendClick = () => {
        setRatingVisible(false);
        const newReview = {
            rating: starValue,
            comment: inputTextValue,
            isAccepted: 0,
            articleId: selectedArticle2.id,
        };
        axios.post('http://localhost:8080/api/reviews', newReview)
            .then(response => {fetchArticles()})
            .catch(error => console.error(error));

        plusList.forEach((newProText) => {
            const newPro = {
                description: newProText,
                articleId: selectedArticle2.id,
                categoryId: 1,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newPro)
                .then(response => {fetchArticles()})
                .catch(error => console.error(error));
        });

        minusList.forEach((newConText) => {
            const newCon = {
                description: newConText,
                articleId: selectedArticle2.id,
                categoryId: 2,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newCon)
                .then(response => {fetchArticles()})
                .catch(error => console.error(error));
        });
    };

    const onUpdateClick = (ReviewDetails, ConferenceName) => {
        setSelectedArticle3(ReviewDetails);
        setSelectedConference(ConferenceName);
        setEditVisible(true);
        setReviewID(ReviewDetails.reviews[0].id);
        setProConID(ReviewDetails.prosAndConsList);
        setText('');
        setStarValue(ReviewDetails.reviews[0].rating);
        setInputTextValue(ReviewDetails.reviews[0].comment);

        const pros = ReviewDetails.prosAndConsList
            .filter(item => item.category.name === "PRO")
            .map(item => item.description);
        const cons = ReviewDetails.prosAndConsList
            .filter(item => item.category.name === "CON")
            .map(item => item.description);
        setPlusList(pros);
        setMinusList(cons);
    };

    const onUpdateSendClick = () => {
        setEditVisible(false);
        console.log("Logged-in user:", reviewID);
        console.log("Pro-Con:", proConID);
        axios.delete(`http://localhost:8080/api/reviews/${reviewID}`)
            .then(response => {fetchArticles()})
            .catch(error => {console.error(error);});
        const newReview = {
            rating: starValue,
            comment: inputTextValue,
            isAccepted: 0,
            articleId: selectedArticle3.id,
        };
        axios.post('http://localhost:8080/api/reviews', newReview)
            .then(response => {fetchArticles()})
            .catch(error => console.error(error));

        proConID.forEach(ProCon => {
            axios.delete(`http://localhost:8080/api/pros-and-cons/${ProCon.id}`)
                .then(response => {fetchArticles()})
                .catch(error => {console.error(error);});
        });
        plusList.forEach((newProText) => {
            const newPro = {
                description: newProText,
                articleId: selectedArticle3.id,
                categoryId: 1,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newPro)
                .then(response => {fetchArticles()})
                .catch(error => console.error(error));
        });
        minusList.forEach((newConText) => {
            const newCon = {
                description: newConText,
                articleId: selectedArticle3.id,
                categoryId: 2,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newCon)
                .then(response => {fetchArticles()})
                .catch(error => console.error(error));
        });
    };

    const onSendClick = (ReviewDetails) => {
        const changeState = {
            stateId: 3,
        };
        axios.patch(`http://localhost:8080/api/articles/${ReviewDetails.id}`, changeState)
            .then(response => fetchArticles())
            .catch(error => console.error(error));

        /*const changeAccepted = {
            isAccepted: true,
        };
        axios.patch(`http://localhost:8080/api/reviews/${ReviewDetails.reviews[0].id}`, changeAccepted)
            .then(response => fetchArticles())
            .catch(error => console.error(error));*/
    };

    // Grid Usporiadanie ------------------------------------------------------------------------------------

    const getSeverity = (hodnotenie) => {
        switch (getState(hodnotenie)) {
            case 'ODOSLANÉ':
                return 'success';

            case 'NEODOSLANÉ':
                return 'warning';

            case 'NEOHODNOTENÉ':
                return 'danger';

            default:
                return null;
        }
    };

    const getState = (state) => {
        if (!state.reviews || state.reviews.length === 0){
            return 'NEOHODNOTENÉ';
        }else{
            if (state.state.name === "Ohodnotené"){
                return 'ODOSLANÉ';
            }else {
                return 'NEODOSLANÉ';
            }
        }
    };

    const gridItemToReview = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (!review.reviews || review.reviews.length === 0){
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                {/*   <i className="pi pi-tag"></i>
                                <span className="font-semibold">{user.name}</span>*/}
                            </div>
                            <Tag value={getState(review)} severity={getSeverity(review)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{review.name}</div>
                            <div className="font-semibold">{conferenceDetails.name}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{review.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{review.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Termín: <i className="text-2xl">
                                {conferenceDetails.startReview ? `${conferenceDetails.startReview} - ${conferenceDetails.closeReview}` : "No review period"}
                            </i></div>
                        </div>
                        <div className="align-items-center justify-content-between">
                            <Button label="Ohodnotiť" icon="pi pi-star-fill" className="p-button-rounded custom-width"
                                onClick={() => onRatingClick(review, conferenceDetails)}/>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const gridItemUpdate = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (review.state.name !== 'Ohodnotené' && review.reviews.length !== 0){
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                {/* <i className="pi pi-tag"></i>
                                <span className="font-semibold">{user.name}</span> */}
                            </div>
                            <Tag value={getState(review)} severity={getSeverity(review)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{review.name}</div>
                            <div className="font-semibold">{conferenceDetails.name}</div>
                            <div className="font-bold">Škola: <i
                                className="font-semibold">{review.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i
                                className="font-semibold">{review.users[0].faculty.name}</i></div>
                            <Rating value={review.reviews[0].rating} readOnly cancel={false}></Rating>
                            <div className="font-bold ">Termín: <i className="text-2xl">
                                {conferenceDetails.startReview ? `${conferenceDetails.startReview} - ${conferenceDetails.closeReview}` : "No review period"}
                            </i></div>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary"
                                    className="p-button-rounded custom-width"
                                    onClick={() => onOpenClick(review, conferenceDetails)}/>
                            <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="p-button-rounded custom-width"
                                    onClick={() => onUpdateClick(review, conferenceDetails)}/>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Odoslať" icon="pi pi-send" className="p-button-rounded custom-width"
                                    onClick={() => onSendClick(review)}/>
                            <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded custom-width"/>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const gridItemArchive = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (review.state.name === 'Ohodnotené'){
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={review.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                {/*  <i className="pi pi-tag"></i>
                                <span className="font-semibold">{user.name}</span>*/}
                            </div>
                            <Tag value={getState(review)} severity={getSeverity(review)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{review.name}</div>
                            <div className="font-semibold">{conferenceDetails.name}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{review.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{review.users[0].faculty.name}</i></div>
                            <Rating value={review.reviews[0].rating} readOnly cancel={false}></Rating>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                    onClick={() => onOpenClick(review, conferenceDetails)}/>
                            <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded custom-width"/>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const ReviewTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemToReview(review))}</div>;
    };

    const UpdateTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemUpdate(review))}</div>;
    };

    const ArchiveTemplate = () => {
        if (!Reviews) {
            return;
        }
        return <div className="grid grid-nogutter">{Reviews.map((review) => gridItemArchive(review))}</div>;
    };


    // Return ----------------------------------------------------------------------------------------------------------
    return (
        <div className="card">
            <Fieldset legend="Recenzent" className="recenzent" style={Reviews.length === 0 ? { height: '75vh', } : {}}>
                <TabView scrollable>
                    <TabPanel header="Na Ohodnotenie" rightIcon="pi pi-calendar-clock mr-2">
                        <DataView value={Reviews} listTemplate={ReviewTemplate}/>
                    </TabPanel>
                    <TabPanel header="Ohodnotené/Upraviť" rightIcon="pi pi-pencil ml-2">
                        <DataView value={Reviews} listTemplate={UpdateTemplate}/>
                    </TabPanel>
                    <TabPanel header="Archív" rightIcon="pi pi-building-columns ml-2">
                        <DataView value={Reviews} listTemplate={ArchiveTemplate}/>
                    </TabPanel>
                </TabView>
            </Fieldset>

            <ReviewOpenDialog
                visible={archiveVisible}
                onHide={() => setArchiveVisible(false)}
                selectedArticle={selectedArticle1}
                selectedConference={selectedConference}
                ratings={ratings}
            />;

            <ReviewRateDialog
                visible={ratingVisible}
                onHide={() => setRatingVisible(false)}
                selectedArticle={selectedArticle2}
                selectedConference={selectedConference}
                ratingFooterContent={ratingFooterContent}
                starValue={starValue}
                setStarValue={setStarValue}
                inputTextValue={inputTextValue}
                setInputTextValue={setInputTextValue}
                text={text}
                setText={setText}
                plusList={plusList}
                addToPlusList={addToPlusList}
                selectedPlusItem={selectedPlusItem}
                setSelectedPlusItem={setSelectedPlusItem}
                deleteFromPlusList={deleteFromPlusList}
                minusList={minusList}
                addToMinusList={addToMinusList}
                selectedMinusItem={selectedMinusItem}
                setSelectedMinusItem={setSelectedMinusItem}
                deleteFromMinusList={deleteFromMinusList}
            />;

            <ReviewUpdateDialog
                selectedArticle3={selectedArticle3}
                selectedConference={selectedConference}
                editVisible={editVisible}
                editFooterContent={editFooterContent}
                setEditVisible={setEditVisible}
                starValue={starValue}
                setStarValue={setStarValue}
                inputTextValue={inputTextValue}
                setInputTextValue={setInputTextValue}
                text={text}
                setText={setText}
                plusList={plusList}
                addToPlusList={addToPlusList}
                minusList={minusList}
                addToMinusList={addToMinusList}
                selectedPlusItem={selectedPlusItem}
                setSelectedPlusItem={setSelectedPlusItem}
                selectedMinusItem={selectedMinusItem}
                setSelectedMinusItem={setSelectedMinusItem}
                deleteFromPlusList={deleteFromPlusList}
                deleteFromMinusList={deleteFromMinusList}
            />
        </div>
    )
}