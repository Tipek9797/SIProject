import React, {useRef, useState} from "react";
import { Fieldset } from 'primereact/fieldset';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import "./myWorks.css";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import {InputText} from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
                                Sem krátky obsah práce. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        <div className="work-card">
                            <label htmlFor="rating"><h1>(Ne)Hodnotené</h1></label>
                            <Divider layout="vertical" />
                            <Button className="work-btn" icon="pi pi-external-link" rounded
                                    onClick={() => setWorkDetailsVisible(true)}/>
                            <Dialog header="Názov práce"
                                    visible={workDetailsVisible}
                                    className="work-dialog-details"
                                    footer={detailsFooterContent}
                                    maximizable
                                    style={{width: '50vw'}}
                                    onHide={() => {
                                        if (!workDetailsVisible) return;
                                        setWorkDetailsVisible(false);
                                    }}>
                                <Divider/>
                                <div className="work-details-text">
                                    <div className="work-details-row">
                                        <h2>Škola</h2>
                                        <Divider layout="vertical"/>
                                        <label htmlFor="school">Univerzita Konštantína Filozofa v Nitre</label>
                                    </div>
                                    <div className="work-details-row">
                                        <h2>Katedra</h2>
                                        <Divider layout="vertical"/>
                                        <label htmlFor="department">Katedra Informatiky</label>
                                    </div>
                                    <div className="work-details-row">
                                        <h2>Odbor</h2>
                                        <Divider layout="vertical"/>
                                        <label htmlFor="field">Aplikovaná Informatika</label>
                                    </div>
                                    <div className="work-details-row">
                                        <h2>Hodnotenie</h2>
                                        <Divider layout="vertical"/>
                                        <Rating value={4} readOnly cancel={false}/>
                                    </div>
                                </div>
                                <div className="rating-table-container">
                                    <DataTable value={ratings} className="p-datatable-sm" showGridlines>
                                        <Column className="rating-colum" field="pros" header="Pozitíva +"/>
                                        <Column className="rating-colum" field="cons" header="Negatíva -"/>
                                    </DataTable>
                                </div>
                            </Dialog>
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
                <Dialog header="Upload"
                        visible={workUploadVisible}
                        className="work-dialog-upload"
                        footer={uploadFooterContent}
                        maximizable
                        style={{ width: '50vw' }}
                        onHide={() => {if (!workUploadVisible) return; setWorkUploadVisible(false); }}>
                    <Divider />
                    <div className="workdialog">
                        <div className="worktext">
                            <label htmlFor="name">Názov práce</label>
                            <Divider layout="vertical" />
                            <InputText
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrorFields(prev => ({...prev, name: false}));
                                }}
                                onBlur={() => {
                                    if (!name) setErrorFields(prev => ({...prev, name: true}));
                                }}
                                className={errorFields.name ? 'p-invalid' : ''}
                            />
                        </div>

                        <Tooltip target=".custom-choose-btn" content="Browse" position="bottom"/>
                        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom"/>
                        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom"/>

                        <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept=".pdf, .docx"
                                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear}
                                    onClear={onTemplateClear}
                                    headerTemplate={headerTemplate} itemTemplate={itemTemplate}
                                    emptyTemplate={emptyTemplate}
                                    chooseOptions={chooseOptions} //uploadOptions={uploadOptions}
                                    cancelOptions={cancelOptions}/>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
