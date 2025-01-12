import React, { useEffect, useRef, useState } from "react";
import {
    TabPanel, TabView,
    Fieldset,
    DataView,
    Button,
    Rating,
    Toast,
    Tag
} from "../../components/index";
import WorkUploadDialog from "../../components/work-dialog/WorkUploadDialog";
import WorkInfoDialog from "../../components/work-dialog/WorkInfoDialog";
import "../worksToReviewPage/worksToReview.css";
import "./myWorks.css";
import axios from "axios";
import { handleUpload } from "../../services/handleUpload";

export default function MyWorks() {
    // Databaza --------------------------------------------------------------------------------------------------------
    const [Articles, setArticles] = useState([]);

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
                const filteredArticles = response.data.filter(article =>
                    article.users.some(u => u.id === user.id)
                );
                setArticles(filteredArticles);
                console.log("Filtered Articles:", filteredArticles);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchArticles();
    }, [Articles]);


    // Dialogs ---------------------------------------------------------------------------------------------------------
    const [workDetailsVisible, setWorkDetailsVisible] = useState(false);
    const [workUploadVisible, setWorkUploadVisible] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);          //Upload Dialog
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [ratings, setRatings] = useState([]);

    const processRatings = (article) => {
        if (article && article.prosAndConsList) {
            const pros = article.prosAndConsList.filter(item => item.category.name === "PRO").map(item => item.description);
            const cons = article.prosAndConsList.filter(item => item.category.name === "CON").map(item => item.description);

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

    const onOpenClick = (WorkDetails) => {
        setSelectedArticle(WorkDetails);
        processRatings(WorkDetails);
        setWorkDetailsVisible(true);
    };

    const [name, setName] = useState('');                //Upload Dialog
    const [workUpdate, setWorkUpdate] = useState(false);
    const onUploadClick = () => {
        setName("");
        setSelectedConference(null);
        setWorkUploadVisible(true);
    };

    const onUpdateClick = (WorkDetails) => {
        setName(WorkDetails.name);
        setSelectedConference(optConference[2]);
        setWorkUploadVisible(true);
        setWorkUpdate(true);
    };

    const onDataSubmitClick = async () => {
        try {
            const articleData = {
                name: name,
                date: new Date(),
                reviewerId: user.id,
                conferenceId: selectedConference.id,
                userIds: [user.id],
                stateId: 1 // Assuming 1 is the initial state ID
            };

            const response = await axios.post('http://localhost:8080/api/articles', articleData);
            const articleId = response.data.id;

            await handleUpload(files, toast, articleId);
            setWorkUploadVisible(false);
        } catch (error) {
            console.error("Error creating article or uploading file:", error);
            toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa vytvoriť článok alebo nahrať súbor.' });
        }
    };

    const onDataUpdateClick = () => {
        setWorkUploadVisible(false);
        setWorkUpdate(false);
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
                    <br />Drag and Drop Files Here
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
        <div>
            <Button label="Submit" icon="pi pi-check" onClick={onDataSubmitClick} autoFocus />
        </div>
    );

    const updateFooterContent = (
        <div className="flex align-items-center justify-content-center">
            <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="p-button-rounded custom-width"
                onClick={() => onDataUpdateClick()} />
        </div>
    );

    // Placeholder -----------------------------------------------------------------------------------------------------

    const optConference = [
        { name: 'Konferencia Test' },
        { name: 'Konferencia 01' },
        { name: 'Konferencia 02' },
        { name: 'Konferencia 03' },
        { name: 'Konferencia 04' }
    ];

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

    const gridArticles = (article) => {
        const date1 = new Date(article.date);
        const formattedDate = `${String(date1.getDate()).padStart(2, '0')}/${String(date1.getMonth() + 1).padStart(2, '0')}/${date1.getFullYear()} - ${String(date1.getHours()).padStart(2, '0')}:${String(date1.getMinutes()).padStart(2, '0')}`;

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
                            <div className="font-semibold">{article.name}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <div className="font-bold ">Termín: <i className="text-2xl">{formattedDate}</i></div>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded custom-width" />
                            <Button label="Upraviť" icon="pi pi-user-edit" severity="warning" className="p-button-rounded custom-width"
                                onClick={() => onUpdateClick(article)} />
                        </div>
                    </div>
                </div>
            );
        }
    };

    const gridRating = (article) => {
        const date2 = new Date(article.date);
        const formattedDate = `${String(date2.getDate()).padStart(2, '0')}/${String(date2.getMonth() + 1).padStart(2, '0')}/${date2.getFullYear()} - ${String(date2.getHours()).padStart(2, '0')}:${String(date2.getMinutes()).padStart(2, '0')}`;

        if (article.state.name !== "Odoslané") {
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
                            <div className="font-semibold">{article.name}</div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <Rating value={article.reviews[0].rating} readOnly cancel={false}></Rating>
                            <div className="font-bold ">Termín: <i className="text-2xl">{formattedDate}</i></div>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                onClick={() => onOpenClick(article)} />
                            <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded custom-width" />
                        </div>
                    </div>
                </div>
            );
        }
    };

    const gridArchive = (article) => {
        const date3 = new Date(article.date);
        const formattedDate = `${String(date3.getDate()).padStart(2, '0')}/${String(date3.getMonth() + 1).padStart(2, '0')}/${date3.getFullYear()} - ${String(date3.getHours()).padStart(2, '0')}:${String(date3.getMinutes()).padStart(2, '0')}`;

        if (article.state.name === "Ohodnotené") {
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
                            <div className="font-semibold">{article.name}</div>
                            <div className="font-bold">Termín: <i className="font-semibold">{formattedDate}</i></div>
                            <div className="font-bold">Škola: <i className="font-semibold">{article.users[0].school.name}</i></div>
                            <div className="font-bold">Fakulta: <i className="font-semibold">{article.users[0].faculty.name}</i></div>
                            <Rating value={article.reviews[0].rating} readOnly cancel={false}></Rating>
                        </div>
                        <div className="flex botombutton align-items-center justify-content-between">
                            <Button label="Otvoriť" icon="pi pi-external-link" severity="secondary" className="p-button-rounded custom-width"
                                onClick={() => onOpenClick(article)} />
                            <Button label="Sťiahnuť" icon="pi pi-download" severity="success" className="p-button-rounded custom-width" />
                        </div>
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
                        <Button className="workuploadbtn large-icon up-down" label="Upload" icon="pi pi-upload"
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
                uploadFooter={updateFooterContent}
                selectedConference={selectedConference}
                setSelectedConference={setSelectedConference}
                optConference={optConference}
                update={workUpdate}
            />
        </div>
    )
}
