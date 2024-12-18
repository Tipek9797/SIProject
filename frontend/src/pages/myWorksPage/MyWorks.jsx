import React, {useRef, useState} from "react";
import {
    ConfirmPopup, confirmPopup,
    Fieldset,
    Divider,
    Button,
    Toast,
    Tag
} from "../../components/index";
import WorkUploadDialog from "../../components/work-dialog/WorkUploadDialog";
import WorkInfoDialog from "../../components/work-dialog/WorkInfoDialog";
import "./myWorks.css";

export default function MyWorks() {
    const [workDetailsVisible, setWorkDetailsVisible] = useState(false);
    const [workUploadVisible, setWorkUploadVisible] = useState(false);
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const [name, setName] = useState('');
    const [errorFields, setErrorFields] = useState({ name: false, lastName: false, email: false, password: false });

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

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
                <span style={{fontSize: '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">
                    <br/>Drag and Drop Files Here
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-file',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };
    //const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const uploadFooterContent = (
        <div>
            <Button label="Submit" icon="pi pi-check" onClick={() => setWorkUploadVisible(false)} autoFocus />
        </div>
    );

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        setWorkDetailsVisible(false);
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        setWorkDetailsVisible(false);
    };

    const confirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const detailsFooterContent = (
        <div>
            <Button label="Download" icon="pi pi-download" severity="success" onClick={() => setWorkDetailsVisible(false)} autoFocus />
            <Button label="Edit" icon="pi pi-pen-to-square" onClick={() => setWorkDetailsVisible(false)} autoFocus />
            <Button label="Delete" icon="pi pi-trash" severity="danger"  onClick={confirm} autoFocus/>
        </div>
    );

    const ratings = [
        { pros: "Positive", cons: "Great design" },
        { pros: "Positive", cons: "User-friendly" },
        { pros: "Positive", cons: "Responsive layout" },
        { pros: "Negative", cons: "Slow loading" },
        { pros: "Negative", cons: "Limited features" },
        { pros: "Negative", cons: "Occasional bugs" },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmPopup />
            <Fieldset legend="My Works" className="workbox">
                <Divider align="left">
                    <div className="workdivider">
                        <b>2024</b>
                    </div>
                </Divider>
                <div className="workcard">
                    <Fieldset legend="Názov práce">
                            <p>
                                Sem krátky obsah práce. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                                id est laborum.
                            </p>
                        <div className="work-card">
                            <label htmlFor="rating"><h2>(Ne)Hodnotené</h2></label>
                            <Divider layout="vertical" />
                            <Button className="work-btn" icon="pi pi-external-link" rounded
                                    onClick={() => setWorkDetailsVisible(true)}/>
                            <WorkInfoDialog
                                visible={workDetailsVisible}
                                onHide={() => setWorkDetailsVisible(false)}
                                ratings={ratings}
                                footer={detailsFooterContent}
                            />
                        </div>
                    </Fieldset>
                </div>

                <Divider align="left">
                    <div className="workdivider">
                        <b>2023</b>
                    </div>
                </Divider>
                <div className="workcard">
                    <Fieldset legend="Názov práce">
                        <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                            id est laborum.
                        </p>
                    </Fieldset>
                </div>
            </Fieldset>
            <div className="workupload">
                <Button className="workuploadbtn large-icon" label="Upload" icon="pi pi-upload" onClick={() => setWorkUploadVisible(true)} />
                <WorkUploadDialog
                    visible={workUploadVisible}
                    onHide={() => setWorkUploadVisible(false)}
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
                />
            </div>
        </div>
    )
}
