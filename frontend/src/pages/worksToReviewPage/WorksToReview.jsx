import React, { useState, useEffect } from 'react';
import {
    InputText,
    Fieldset,
    TabPanel,
    DataView,
    Checkbox,
    Dropdown,
    TabView,
    Button,
    Rating,
    Tag,
    Tree
} from "../../components/index";
import ReviewOpenDialog from '../../components/Review-dialog/ReviewOpenDialog';
import ReviewRateDialog from '../../components/Review-dialog/ReviewRateDialog';
import ReviewUpdateDialog from '../../components/Review-dialog/ReviewUpdateDialog';
import { ReviewService } from './service/ReviewService';
import "./worksToReview.css";
import axios from "axios";

export default function WorksToReview() {
    // Databaza --------------------------------------------------------------------------------------------------------
    const [Reviews, setReviews] = useState([]);
    const [Conferences, setConferences] = useState([]);
    const [fileHistories, setFileHistories] = useState({});
    const [form, setForm] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesResponse = await axios.get('http://localhost:8080/api/articles');
                const filteredReviews = articlesResponse.data.filter(article => article.reviewerId === user.id);
                setReviews(filteredReviews);

                const conferencesResponse = await axios.get('http://localhost:8080/api/conferences');
                const loadedConferences = conferencesResponse.data;
                setConferences(loadedConferences);

                const fileHistories = {};
                await Promise.all(filteredReviews.map(async (review) => {
                    const fileHistoryResponse = await axios.get(`http://localhost:8080/api/files/history/${review.id}`);
                    fileHistories[review.id] = [{
                        key: 'history',
                        label: 'História',
                        children: fileHistoryResponse.data.map(file => ({
                            key: file.id,
                            label: `${file.fileNameDocx} / ${file.fileNamePdf} - ${new Date(file.uploadDate).toLocaleString()}`,
                            data: file,
                            children: [
                                { key: `${file.id}-docx`, label: `DOCX: ${file.fileNameDocx}`, icon: "pi pi-file", data: file },
                                { key: `${file.id}-pdf`, label: `PDF: ${file.fileNamePdf}`, icon: "pi pi-file", data: file }
                            ]
                        }))
                    }];
                }));
                setFileHistories(fileHistories);

            } catch (error) {
                console.error("Error during fetchData:", error);
            }
        };

        ReviewService.getProducts().then((data) => setForm(data));
        fetchData();
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
                startReview: matchingConference.startReview,
                closeReview: matchingConference.closeReview
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

    const isReviewPeriodActive = (conference) => {
        const now = new Date();
        return now >= new Date(conference.startReview) && now <= new Date(conference.closeReview);
    };

    const downloadFile = (fileId, fileType) => {
        axios.get(`http://localhost:8080/api/files/download/${fileId}/${fileType}`, { responseType: 'blob' })
            .then(response => {
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'file';
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error(error));
    };

    const downloadMostRecentFile = (articleId, fileType) => {
        axios.get(`http://localhost:8080/api/files/download/recent/${articleId}/${fileType}`, { responseType: 'blob' })
            .then(response => {
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'file';
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error(error));
    };

    const renderFileNodeTemplate = (node) => {
        return (
            <div className="file-node">
                <span >{node.label}</span>
                <Button icon="pi pi-download" className="p-button-rounded p-button-text p-button-plain" onClick={() => downloadFile(node.data.id, node.key.includes('docx') ? 'docx' : 'pdf')} />
            </div>
        );
    };

    // Dialog ----------------------------------------------------------------------------------------------------------
    const [archiveVisible, setArchiveVisible] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);

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
                    onClick={() => onUpdateSendClick()} />
        </div>
    );

    // Dialog - Formular -----------------------------------------------------------------------------------------------
    const columns = [
        { field: 'code', header: 'Formulár' },
        { field: 'name', header: 'Hodnotenie' },
    ];
    const grade1 = [
        "6: (A)",
        "5: (B)",
        "4: (C)",
        "3: (D)",
        "2: (E)",
        "1: (Fx)",
    ];
    const grade2 = [
        "2: (Áno)",
        "0: (Nie)",
    ];
    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        if (typeof newValue === 'string' && newValue.trim().length > 0) {
            rowData[field] = newValue;
        }
        else if (typeof newValue === 'boolean') {
            rowData[field] = newValue;
        }
        else {
            event.preventDefault();
        }
        setForm((prevForm) =>
            prevForm.map((form) =>
                form === rowData ? { ...rowData } : form
            )
        );
    };
    const cellEditor = (options) => {
        switch (options.rowData.type) {
            case 'bool':
                return (
                    <Checkbox
                        checked={options.value === true}
                        onChange={(e) => options.editorCallback(e.checked)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                );
            case 'drop1':
                return (
                    <Dropdown
                        value={options.value}
                        options={grade1}
                        onChange={(e) => options.editorCallback(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                );
            case 'drop2':
                return (
                    <Dropdown
                        value={options.value}
                        options={grade2}
                        onChange={(e) => options.editorCallback(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                );
            default: return (
                <InputText
                    type="text"
                    value={options.value}
                    onChange={(e) => options.editorCallback(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            );
        }
    };
    const boldCodeBodyTemplate = (rowData) => {
        return <span style={{ fontWeight: 'bold' }}>{rowData.code}</span>;
    };

    const disabledCheckboxTemplate = (rowData) => {
        if (typeof rowData.name === 'boolean') {
            return <Checkbox checked={rowData.name} disabled />;
        }
        return rowData.name;
    };

    // Buttons ---------------------------------------------------------------------------------------------------------
    const onOpenClick = (ReviewDetails, ConferenceName) => {
        setSelectedArticle1(ReviewDetails);
        setSelectedConference(ConferenceName);
        processRatings(ReviewDetails);
        setArchiveVisible(true);

        //Here set name to values from database according to id from ReviewService.jsx !!!!!!!!!!!!!!!!!!!!!!!
        setForm((prevForm) =>
            prevForm.map((Form) => ({
                ...Form,
                name: "",
            }))
        );
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

        setForm((prevForm) =>
            prevForm.map((formItem) => ({
                ...formItem,
                name: formItem.value,
            }))
        );
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
            .catch(error => console.error(error))
            .finally(() => window.location.reload());

        plusList.forEach((newProText) => {
            const newPro = {
                description: newProText,
                articleId: selectedArticle2.id,
                categoryId: 1,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newPro)
                .catch(error => console.error(error));
        });

        minusList.forEach((newConText) => {
            const newCon = {
                description: newConText,
                articleId: selectedArticle2.id,
                categoryId: 2,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newCon)
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

        //Here set name to values from database according to id from ReviewService.jsx !!!!!!!!!!!!!!!!!!!!!!!
        setForm((prevForm) =>
            prevForm.map((Form) => ({
                ...Form,
                name: "",
            }))
        );

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
        axios.delete(`http://localhost:8080/api/reviews/${reviewID}`)
            .catch(error => { console.error(error); })
            .finally(() => window.location.reload());
        const newReview = {
            rating: starValue,
            comment: inputTextValue,
            isAccepted: 0,
            articleId: selectedArticle3.id,
        };
        axios.post('http://localhost:8080/api/reviews', newReview)
            .catch(error => console.error(error));

        proConID.forEach(ProCon => {
            axios.delete(`http://localhost:8080/api/pros-and-cons/${ProCon.id}`)
                .catch(error => { console.error(error); });
        });
        plusList.forEach((newProText) => {
            const newPro = {
                description: newProText,
                articleId: selectedArticle3.id,
                categoryId: 1,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newPro)
                .catch(error => console.error(error));
        });
        minusList.forEach((newConText) => {
            const newCon = {
                description: newConText,
                articleId: selectedArticle3.id,
                categoryId: 2,
            };
            axios.post('http://localhost:8080/api/pros-and-cons', newCon)
                .catch(error => console.error(error));
        });
    };

    const onSendClick = (ReviewDetails) => {
        const changeState = {
            stateId: 3,
        };
        axios.patch(`http://localhost:8080/api/articles/${ReviewDetails.id}`, changeState)
            .catch(error => console.error(error))
            .finally(() => window.location.reload());

        /*const changeAccepted = {
            isAccepted: true,
        };
        axios.patch(`http://localhost:8080/api/reviews/${ReviewDetails.reviews[0].id}`, changeAccepted)
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
        if (!state.reviews || state.reviews.length === 0) {
            return 'NEOHODNOTENÉ';
        } else {
            if (state.state.name === "Ohodnotené") {
                return 'ODOSLANÉ';
            } else {
                return 'NEODOSLANÉ';
            }
        }
    };

    const gridItemToReview = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (!review.reviews || review.reviews.length === 0) {
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
                            <div className="font-bold ">Kategória: <i className="font-semibold">{review.categories[0].name}</i></div>
                            <div className="font-bold ">Termín: <i className="text-2xl">
                                {conferenceDetails.startReview ? `${formatDate(conferenceDetails.startReview)} - ${formatDate(conferenceDetails.closeReview)}` : "No review period"}</i></div>
                        </div>
                        {isReviewPeriodActive(conferenceDetails) && fileHistories[review.id] && (
                            <div>
                                <div className="flex botombutton align-items-center justify-content-between">
                                    <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success"
                                            className="pdfR custom-width"
                                            onClick={() => downloadMostRecentFile(review.id, 'docx')}/>
                                    <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success"
                                            className="docxL custom-width"
                                            onClick={() => downloadMostRecentFile(review.id, 'pdf')}/>
                                </div>
                                <div className="botombutton align-items-center justify-content-between">
                                    <Button label="Ohodnotiť" icon="pi pi-star-fill"
                                            className="p-button-rounded custom-width"
                                            onClick={() => onRatingClick(review, conferenceDetails)}/>
                                </div>
                                <div className="file-history">
                                    <h3>História súborov</h3>
                                    <Tree value={fileHistories[review.id]} nodeTemplate={renderFileNodeTemplate}/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const gridItemUpdate = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (review.state.name !== 'Ohodnotené' && review.reviews.length !== 0 && isReviewPeriodActive(conferenceDetails)) {
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
                            <div className="font-bold">Škola: <i className="font-semibold">{review.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{review.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Kategória: <i className="font-semibold">{review.categories[0].name}</i></div>
                            <Rating value={review.reviews[0].rating} readOnly cancel={false}></Rating>
                            <div className="font-bold ">Termín: <i className="text-2xl">
                                {conferenceDetails.startReview ? `${formatDate(conferenceDetails.startReview)} - ${formatDate(conferenceDetails.closeReview)}` : "No review period"}</i>
                            </div>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success" className="pdfR custom-width"
                                    onClick={() => downloadMostRecentFile(review.id, 'docx')}/>
                            <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success"
                                    className="docxL custom-width"
                                    onClick={() => downloadMostRecentFile(review.id, 'pdf')}/>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="pdfR custom-width"
                                    onClick={() => onOpenClick(review, conferenceDetails)}/>
                            <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="docxL custom-width"
                                    onClick={() => onUpdateClick(review, conferenceDetails)}/>
                        </div>
                        <div className="botombutton align-items-center justify-content-between">
                            <Button label="Odoslať" icon="pi pi-send" className="p-button-rounded custom-width"
                                    onClick={() => onSendClick(review)}/>
                        </div>
                        {fileHistories[review.id] && (
                            <div className="file-history">
                                <h3>História súborov</h3>
                                <Tree value={fileHistories[review.id]} nodeTemplate={renderFileNodeTemplate}/>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const gridItemArchive = (review) => {
        const conferenceDetails = filterReviewConference(review, Conferences);
        if (review.state.name === 'Ohodnotené' && isReviewPeriodActive(conferenceDetails)) {
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
                            <div className="font-bold ">Kategória: <i className="font-semibold">{review.categories[0].name}</i></div>
                            <Rating value={review.reviews[0].rating} readOnly cancel={false}></Rating>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success" className="pdfR custom-width"
                                    onClick={() => downloadMostRecentFile(review.id, 'docx')} />
                            <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success" className="docxL custom-width"
                                    onClick={() => downloadMostRecentFile(review.id, 'pdf')} />
                        </div>
                        <div className="botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                    onClick={() => onOpenClick(review, conferenceDetails)} />
                        </div>
                        {fileHistories[review.id] && (
                            <div className="file-history">
                                <h3>História súborov</h3>
                                <Tree value={fileHistories[review.id]} nodeTemplate={renderFileNodeTemplate} />
                            </div>
                        )}
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
                        <DataView value={Reviews} listTemplate={ReviewTemplate} />
                    </TabPanel>
                    <TabPanel header="Ohodnotené/Upraviť" rightIcon="pi pi-pencil ml-2">
                        <DataView value={Reviews} listTemplate={UpdateTemplate} />
                    </TabPanel>
                    <TabPanel header="Archív" rightIcon="pi pi-building-columns ml-2">
                        <DataView value={Reviews} listTemplate={ArchiveTemplate} />
                    </TabPanel>
                </TabView>
            </Fieldset>

            <ReviewOpenDialog
                visible={archiveVisible}
                onHide={() => setArchiveVisible(false)}
                selectedArticle={selectedArticle1}
                selectedConference={selectedConference}
                ratings={ratings}
                columns={columns}
                boldCodeBodyTemplate={boldCodeBodyTemplate}
                disabledCheckboxTemplate={disabledCheckboxTemplate}
                form={form}
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
                columns={columns}
                onCellEditComplete={onCellEditComplete}
                cellEditor={cellEditor}
                boldCodeBodyTemplate={boldCodeBodyTemplate}
                disabledCheckboxTemplate={disabledCheckboxTemplate}
                form={form}
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
                columns={columns}
                onCellEditComplete={onCellEditComplete}
                cellEditor={cellEditor}
                boldCodeBodyTemplate={boldCodeBodyTemplate}
                disabledCheckboxTemplate={disabledCheckboxTemplate}
                form={form}
            />
        </div>
    )
}