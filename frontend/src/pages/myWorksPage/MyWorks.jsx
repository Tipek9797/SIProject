import React, { useEffect, useRef, useState } from "react";
import {
    TabPanel, TabView,
    Fieldset,
    DataView,
    Checkbox,
    Button,
    Rating,
    Toast,
    Tag,
    Tree
} from "../../components/index";
import WorkUploadDialog from "../../components/work-dialog/WorkUploadDialog";
import WorkInfoDialog from "../../components/work-dialog/WorkInfoDialog";
import {ReviewService} from "../worksToReviewPage/service/ReviewService";
import "./myWorks.css";
import axios from "axios";
import { handleUpload } from "../../services/handleUpload";

export default function MyWorks() {
    // Databaza --------------------------------------------------------------------------------------------------------
    const [Articles, setArticles] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [Category, setCategory] = useState([]);
    const [fileHistories, setFileHistories] = useState({});
    const [form, setForm] = useState([]);
    const [error, setError] = useState(null);

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
    const fetchCategory = () => {
        axios.get('http://localhost:8080/api/article-categories')
            .then(response => { setCategory(response.data) })
            .catch(error => console.error(error));
    };

    /////////////////////////////////////////////////////////////////
    /*!!!Toto funguje ale treba nastavit aby v article -> conference_id aby sa nastavilo automaticky lebo inak sa name
    Konferencie neupdatuje na frontende. Treba to manualne do databazy davat aby to islo.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const conferencesResponse = await axios.get('http://localhost:8080/api/conferences');
                const loadedConferences = conferencesResponse.data;

                const articlesResponse = await axios.get('http://localhost:8080/api/articles');
                const loadedArticles = articlesResponse.data;

                const userConferences = await Promise.all(
                    loadedConferences.map(async (conference) => {
                        const isUserJoined = user ? await checkUserInConference(conference.id, user.id) : false;
                        return isUserJoined ? conference : null;
                    })
                );

                const filteredConferences = userConferences.filter(conference => conference !== null);

                setConferences(filteredConferences);

                const articlesWithConferenceNames = loadedArticles.map(article => {
                    const relatedConference = filteredConferences.find(conf =>
                        conf.articleId.some(a => a.id === article.id)
                    );

                    return {
                        ...article,
                        conferenceName: relatedConference ? relatedConference.name : "Neznáma konferencia",
                        conferenceStartUpload: relatedConference ? relatedConference.startUpload : null,
                        conferenceCloseUpload: relatedConference ? relatedConference.closeUpload : null,
                        conferenceEnd: relatedConference ? relatedConference.conferenceEnd : null,
                        conferenceState: relatedConference ? relatedConference.state : "",
                    };
                });
                const filteredArticles = articlesWithConferenceNames.filter(article =>
                    article.users.some(u => u.id === user.id));

                setConferences(loadedConferences); // Nastaviť konferencie
                setArticles(filteredArticles); // Nastaviť články

                const fileHistories = {};
                for (const article of loadedArticles) {
                    const fileHistoryResponse = await axios.get(`http://localhost:8080/api/files/history/${article.id}`);
                    fileHistories[article.id] = fileHistoryResponse.data.map(file => ({
                        key: file.id,
                        label: `${file.fileNameDocx} / ${file.fileNamePdf} - ${new Date(file.uploadDate).toLocaleString()}`,
                        data: file,
                        children: [
                            { key: `${file.id}-docx`, label: `DOCX: ${file.fileNameDocx}`, icon: "pi pi-file", data: file },
                            { key: `${file.id}-pdf`, label: `PDF: ${file.fileNamePdf}`, icon: "pi pi-file", data: file }
                        ]
                    }));
                }
                setFileHistories(fileHistories);
            } catch (error) {
                console.error("Error during fetchData:", error);
            }
        };
        ReviewService.getProducts().then((data) => setForm(data));
        fetchData();
        fetchCategory();
    }, []);

    const checkUserInConference = async (conferenceId, userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/conferences/${conferenceId}/isUserIn?userId=${userId}`);

            if (!response.ok) throw new Error('Chyba pri overovaní účasti používateľa');

            return await response.json();
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/conferences');
                if (!response.ok) throw new Error('Nepodarilo sa načítať konferencie');
                const data = await response.json();

                const joinedConferences = await Promise.all(
                    data.map(async (conference) => {
                        const isUserJoined = user ? await checkUserInConference(conference.id, user.id) : false;
                        return isUserJoined ? conference : null;
                    })
                );

                const filteredConferences = joinedConferences.filter(conference => conference !== null);

                setConferences(filteredConferences);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchConferences();
    }, [user]);



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

    const renderFileNodeTemplate = (node) => {
        return (
            <div className="file-node">
                <span >{node.label}</span>
                <Button icon="pi pi-download" className="p-button-rounded p-button-text p-button-plain" onClick={() => downloadFile(node.data.id, node.key.includes('docx') ? 'docx' : 'pdf')} />
            </div>
        );
    };

    // Dialog - Formular -----------------------------------------------------------------------------------------------
    const columns = [
        { field: 'code', header: 'Formulár' },
        { field: 'name', header: 'Hodnotenie' },
    ];

    const boldCodeBodyTemplate = (rowData) => {
        return <span style={{ fontWeight: 'bold' }}>{rowData.code}</span>;
    };

    const disabledCheckboxTemplate = (rowData) => {
        if (typeof rowData.name === 'boolean') {
            return <Checkbox checked={rowData.name} disabled />;
        }
        return rowData.name;
    };

    // Dialogs ---------------------------------------------------------------------------------------------------------
    const [workDetailsVisible, setWorkDetailsVisible] = useState(false);
    const [workUploadVisible, setWorkUploadVisible] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [ratings, setRatings] = useState([]);

    const processRatings = (article) => {
        if (article && article.prosAndConsList) {
            const pros = article.prosAndConsList.filter(item => item.category.name === "PRO").map(item => item.description);
            const cons = article.prosAndConsList.filter(item => item.category.name === "CON").map(item => item.description);

            const formattedRatings = [];
            const maxLength = Math.max(pros.length, cons.length);
            for (let i = 0; i < maxLength; i++) {
                formattedRatings.push({
                    PRO: pros[i] || "",
                    CON: cons[i] || ""
                });
            }

            setRatings(formattedRatings);
        } else {
            setRatings([]);
        }
    };

    const ratingTest = (data) => {
        if (data.state.name === "Prebieha Hodnotenie") {
            return 0
        } else {
            return data.reviews[0].rating
        }
    };

    const onOpenClick = (WorkDetails) => {
        setSelectedArticle(WorkDetails);
        processRatings(WorkDetails);
        setWorkDetailsVisible(true);

        //Here set name to values from database according to id from ReviewService.jsx !!!!!!!!!!!!!!!!!!!!!!!
        setForm((prevForm) =>
            prevForm.map((Form) => ({
                ...Form,
                name: "",
            }))
        );
    };

    const [name, setName] = useState('');
    const [workUpdate, setWorkUpdate] = useState(false);
    const [optConference, setOptConference] = useState([]);
    const [optCategory, setOptCategory] = useState([]);

    const Options = () => {
        const filteredConferenceOpt = conferences
            .filter(conference => conference.state === "Otvorená")
            .map(conference => ({ label: conference.name, value: conference.name }));

        const filteredCategoryOpt = Category.map(category => ({ label: category.name, value: category.name }));

        setOptConference(filteredConferenceOpt);
        setOptCategory(filteredCategoryOpt);
    };

    // Update buttons --------------------------------------------------------------------------------------------------
    const onUpdateClick = (WorkDetails) => {
        Options();
        setName(WorkDetails.name);
        setSelectedArticle({
            ...WorkDetails,
            conference: conferences.find(conf => conf.name === WorkDetails.conferenceName)
        });
        setWorkUploadVisible(true);
        setWorkUpdate(true);
    };

    useEffect(() => {
        if (workUpdate && selectedArticle) {
            const conferenceName = selectedArticle.conference ? selectedArticle.conference.name : null;
            const categoryName = selectedArticle.categories && selectedArticle.categories.length > 0 ? selectedArticle.categories[0].name : null;
            setSelectedConference(conferenceName);
            setSelectedCategory(categoryName);
        }
    }, [optConference, optCategory, workUpdate, selectedArticle]);

    const onUpdateArticleNameClick = async () => {
        try {
            const matchingConference = conferences.find(conference => conference.name === selectedConference);

            if (!matchingConference) {
                throw new Error("Selected conference not found");
            }

            const matchingCategory = Category.find(category => category.name === selectedCategory);
            if (!matchingCategory) {
                throw new Error("Selected category not found");
            }

            const articleData = {
                name: name,
                date: selectedArticle.date,
                reviewerId: selectedArticle.reviewerId ? selectedArticle.reviewerId : null,
                conferenceId: matchingConference.id,
                categoryIds: [matchingCategory.id],
                userIds: [user.id],
                stateId: selectedArticle.state.id
            };

            await axios.patch(`http://localhost:8080/api/articles/${selectedArticle.id}`, articleData);
            console.log("Article updated successfully.");
            fetchData();
            setWorkUploadVisible(false);
            setWorkUpdate(false);
        } catch (error) {
            console.error("Error updating article name:", error);
            toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa upraviť názov článku.' });
        }
    };

    const onUpdateFilesClick = async () => {
        try {
            await handleUpload(files, toast, selectedArticle.id);
            setWorkUploadVisible(false);
            setWorkUpdate(false);
        } catch (error) {
            console.error("Error uploading new files:", error);
            toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa nahrať nové súbory.' });
        }
    };

    // Submit Button ---------------------------------------------------------------------------------------------------
    const onUploadClick = () => {
        Options();
        setName("");
        setSelectedConference(null);
        setSelectedCategory(null);
        setWorkUploadVisible(true);
    };

    const onDataSubmitClick = async () => {
        try {
            const matchingConference = conferences.find(conference => conference.name === selectedConference);
            const matchingCategory = Category.find(category => category.name === selectedCategory);

            const articleData = {
                name: name,
                date: new Date(),
                reviewerId: null,
                conferenceId: matchingConference.id,
                categoryIds: [matchingCategory.id],
                userIds: [user.id],
                stateId: 1
            };

            const response = await axios.post('http://localhost:8080/api/articles', articleData)
                .finally(() => window.location.reload());

            const articleId = response.data.id;

            await handleUpload(files, toast, articleId);

            setWorkUploadVisible(false);
        } catch (error) {
            console.error("Error creating article or uploading file:", error);
            toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa vytvoriť článok alebo nahrať súbory.' });
        }
    };

    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const [errorFields, setErrorFields] = useState({ name: false, lastName: false, email: false, password: false });
    const [files, setFiles] = useState([]);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        setFiles(files);

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);

    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, /*uploadButton,*/ cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}

                {cancelButton}
            </div>//{uploadButton}
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <div className="flex">
                    <i className="pi pi-file-pdf mt-3 p-5" style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)'
                    }}></i>
                    <i className="pi pi-file-word mt-3 p-5" style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)'
                    }}></i>
                </div>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    <br />Potiahnite súbory sem alebo kliknite na tlačidlo
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-file',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };

    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const uploadFooterContent = (
        <div className="flex align-items-center justify-content-center">
            <Button label="Odoslať" icon="pi pi-check" className="p-button-rounded custom-width"
                    onClick={onDataSubmitClick} autoFocus />
        </div>
    );

    // Data Corection --------------------------------------------------------------------------------------------------

    const formatDate = (dateString) => {
        if (!dateString) return null; // Handle missing or invalid dates
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    // New Grid system -------------------------------------------------------------------------------------------------

    const getSeverity = (article) => {
        switch (article) {
            case 'Odoslané':
                return 'info';

            case 'Prebieha Hodnotenie':
                return 'warning';

            case 'Ohodnotené':
                return 'success';

            default:
                return null;
        }
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

    const isUploadPeriodActive = (conference) => {
        const now = new Date();
        return now >= new Date(conference.startUpload) && now <= new Date(conference.closeUpload);
    };

    const gridArticles = (article) => {
        const date1 = new Date(article.date);
        const formattedDate = `${String(date1.getDate()).padStart(2, '0')}/${String(date1.getMonth() + 1).padStart(2, '0')}/${date1.getFullYear()} - ${String(date1.getHours() + 1).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}`;
        const articleConferenceName = article.conferenceName || "Neznáma konferencia";
        const articleConferenceDate = article.conferenceStartUpload ? `${formatDate(article.conferenceStartUpload)} - ${formatDate(article.conferenceCloseUpload)}` : "Nezadaný termín";
        const relatedConference = conferences.find(conf => conf.name === articleConferenceName);
        const hasFiles = fileHistories[article.id] && fileHistories[article.id].length > 0;

        if (article.state.name === "Odoslané") {
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={article.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-clock"></i>
                                <span className="font-semibold">{formattedDate}</span>
                            </div>
                            <Tag className="font-bold uppercase-label" value={article.state.name} severity={getSeverity(article.state.name)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{article.name}</div>
                            <div className="font-semibold">{articleConferenceName}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Kategória: <i className="font-semibold">{article.categories[0].name}</i></div>
                            <div className="font-bold ">Termín: <i className="text-2xl">{articleConferenceDate}</i></div>
                        </div>

                        {hasFiles && (
                            <div className="flex botombutton align-items-center justify-content-between">
                                <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success" className="pdfR custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'docx')} />
                                <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success" className="docxL custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'pdf')} />
                            </div>
                        )}
                        <div className="botombutton align-items-center justify-content-between">
                            {relatedConference && isUploadPeriodActive(relatedConference) && (
                                <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="p-button-rounded custom-width"
                                        onClick={() => onUpdateClick(article)} />
                            )}
                        </div>
                        {fileHistories[article.id] && (
                            <div className="file-history">
                                <h3>História súborov</h3>
                                <Tree value={fileHistories[article.id]} nodeTemplate={renderFileNodeTemplate} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const gridRating = (article) => {
        const date2 = new Date(article.date);
        const formattedDate = `${String(date2.getDate()).padStart(2, '0')}/${String(date2.getMonth() + 1).padStart(2, '0')}/${date2.getFullYear()} - ${String(date2.getHours() + 1).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}`;
        const articleConferenceName = article.conferenceName || "Neznáma konferencia";
        const articleConferenceDate = article.conferenceStartUpload ? `${formatDate(article.conferenceStartUpload)} - ${formatDate(article.conferenceCloseUpload)}` : "Nezadaný termín";
        const hasFiles = fileHistories[article.id] && fileHistories[article.id].length > 0;

        if (article.state.name !== "Odoslané" && article.conferenceState === "Otvorená") {
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={article.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-clock"></i>
                                <span className="font-semibold">{formattedDate}</span>
                            </div>
                            <Tag className="font-bold uppercase-label" value={article.state.name} severity={getSeverity(article.state.name)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{article.name}</div>
                            <div className="font-semibold">{articleConferenceName}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Kategória: <i className="font-semibold">{article.categories[0].name}</i></div>
                            <Rating value={ratingTest(article)} readOnly cancel={false}></Rating>
                            <div className="font-bold ">Termín: <i className="text-2xl">{articleConferenceDate}</i>
                            </div>
                        </div>
                        {hasFiles && (
                            <div className="flex botombutton align-items-center justify-content-between">
                                <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success" className="pdfR custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'docx')} />
                                <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success" className="docxL custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'pdf')} />
                            </div>
                        )}
                        <div className="botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                    onClick={() => onOpenClick(article)} />
                        </div>
                        {fileHistories[article.id] && (
                            <div className="file-history">
                                <h3>História súborov</h3>
                                <Tree value={fileHistories[article.id]} nodeTemplate={renderFileNodeTemplate} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const gridArchive = (article) => {
        const date3 = new Date(article.date);
        const formattedDate = `${String(date3.getDate()).padStart(2, '0')}/${String(date3.getMonth() + 1).padStart(2, '0')}/${date3.getFullYear()} - ${String(date3.getHours() + 1).padStart(2, '0')}:${String(date3.getMinutes()).padStart(2, '0')}`;
        const articleConferenceName = article.conferenceName || "Neznáma konferencia";
        const articleConferenceDate = article.conferenceStartUpload ? `${formatDate(article.conferenceStartUpload)} - ${formatDate(article.conferenceCloseUpload)}` : "Nezadaný termín";
        const hasFiles = fileHistories[article.id] && fileHistories[article.id].length > 0;
        /*const today = new Date();
        && article.conferenceEnd < today*/

        if (article.state.name === "Ohodnotené" && article.conferenceState !== "Otvorená") {
            return (
                <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={article.id}>
                    <div className="p-4 border-1 surface-border surface-card border-round">
                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-clock"></i>
                                <span className="font-semibold">{formattedDate}</span>
                            </div>
                            <Tag className="font-bold uppercase-label" value={article.state.name} severity={getSeverity(article.state.name)}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className="text-2xl font-bold">{article.name}</div>
                            <div className="font-semibold">{articleConferenceName}</div>
                            <div className="font-bold">Termín: <i className="font-semibold">{articleConferenceDate}</i></div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Kategória: <i className="font-semibold">{article.categories[0].name}</i></div>
                            <Rating value={ratingTest(article)} readOnly cancel={false}></Rating>
                        </div>
                        {hasFiles && (
                            <div className="flex botombutton align-items-center justify-content-between">
                                <Button label="Sťiahnuť DOCX" icon="pi pi-download" severity="success" className="pdfR custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'docx')} />
                                <Button label="Sťiahnuť PDF" icon="pi pi-download" severity="success" className="docxL custom-width"
                                    onClick={() => downloadMostRecentFile(article.id, 'pdf')} />
                            </div>
                        )}
                        <div className="botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                    onClick={() => onOpenClick(article)} />
                        </div>
                        {fileHistories[article.id] && (
                            <div className="file-history">
                                <h3>História súborov</h3>
                                <Tree value={fileHistories[article.id]} nodeTemplate={renderFileNodeTemplate} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const ArticleTemplate = () => {
        if (!Articles) {
            return (
                <div className="flex align-items-center justify-content-center">
                    <div>
                        <i className="pi pi-info-circle" style={{ fontSize: '50px', color: 'white' }}></i>
                        <div className="font-bold text-2xl " style={{ color: 'white' }}>NEMÁTE ŽIADNE AKTÍVNE PRÁCE</div>
                    </div>
                </div>
            );
        } else {
            return <div className="grid grid-nogutter">{Articles.map((article) => gridArticles(article))}</div>;
        }
    };

    const RatingTemplate = () => {
        if (!Articles) {
            return;
        }
        return <div className="grid grid-nogutter">{Articles.map((article) => gridRating(article))}</div>;
    };

    const ArchiveTemplate = () => {
        if (!Articles) {
            return;
        }
        return <div className="grid grid-nogutter">{Articles.map((article) => gridArchive(article))}</div>;
    };

    // Return and Dialog ------------------------------------------------------------------------------------------------

    return (
        <div className="cardWork">
            <Toast ref={toast} />
            <Fieldset legend="Moja Práca" className="workbox" style={Articles.length === 0 ? { height: '75vh', } : {}}>
                <TabView scrollable>
                    <TabPanel header="Aktuálne práce" rightIcon="pi pi-calendar-clock">
                        <DataView value={Articles} listTemplate={ArticleTemplate} />
                        <Button className="workuploadbtn large-icon up-down" label="Nahrať Prácu" icon="pi pi-upload"
                            onClick={() => onUploadClick()} />
                    </TabPanel>
                    <TabPanel header="Hodnotenie" rightIcon="pi pi-check">
                        <DataView value={Articles} listTemplate={RatingTemplate} />
                    </TabPanel>
                    <TabPanel header="Archív" rightIcon="pi pi-building-columns">
                        <DataView value={Articles} listTemplate={ArchiveTemplate} />
                    </TabPanel>
                </TabView>
            </Fieldset>

            {selectedArticle && (
                <WorkInfoDialog
                    visible={workDetailsVisible}
                    onHide={() => setWorkDetailsVisible(false)}
                    data={selectedArticle}
                    ratings={ratings}
                    columns={columns}
                    boldCodeBodyTemplate={boldCodeBodyTemplate}
                    disabledCheckboxTemplate={disabledCheckboxTemplate}
                    form={form}
                    setForm={setForm}
                />
            )}

            <WorkUploadDialog
                visible={workUploadVisible}
                onHide={() => { setWorkUploadVisible(false); setName(""); setWorkUpdate(false) }}
                name={name}
                setName={setName}
                errorFields={errorFields}
                setErrorFields={setErrorFields}
                fileUploadRef={fileUploadRef}
                onTemplateUpload={onTemplateUpload}
                onTemplateSelect={onTemplateSelect}
                onTemplateClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
                footer={uploadFooterContent}
                selectedConference={selectedConference}
                setSelectedConference={setSelectedConference}
                optConference={optConference}
                update={workUpdate}
                onUpdateArticleNameClick={onUpdateArticleNameClick}
                onUpdateFilesClick={onUpdateFilesClick}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                optCategory={optCategory}
            />
        </div>
    )
}
