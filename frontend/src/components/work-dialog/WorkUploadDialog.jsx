import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default function WorkUploadDialog({
                                             visible,
                                             onHide,
                                             name,
                                             setName,
                                             errorFields,
                                             setErrorFields,
                                             fileUploadRef,
                                             onTemplateUpload,
                                             onTemplateSelect,
                                             onTemplateClear,
                                             headerTemplate,
                                             itemTemplate,
                                             emptyTemplate,
                                             chooseOptions,
                                             cancelOptions,
                                             footer,
                                             selectedConference,
                                             setSelectedConference,
                                             optConference,
                                             onUpdateArticleNameClick,
                                             onUpdateFilesClick,
                                             update,
                                             selectedCategory,
                                             setSelectedCategory,
                                             optCategory,
                                         }) {
    const chooseFooter = () => {
        if (update) {
            return (
                <div className="flex align-items-center justify-content-center">
                    <Button label="Upraviť Článok" icon="pi pi-user-edit" severity="warning" className="p-button-rounded custom-width"
                            onClick={onUpdateArticleNameClick} />
                    <Button label="Upraviť Súbory" icon="pi pi-upload" severity="warning" className="p-button-rounded custom-width"
                            onClick={onUpdateFilesClick} />
                </div>
            );
        }
        return footer;
    };

    return (
        <Dialog
            header="Nahrať"
            visible={visible}
            className="work-dialog-upload"
            footer={chooseFooter}
            maximizable
            style={{ width: "50vw" }}
            onHide={onHide}
        >
            <Divider />
            <div className="work-details-text">
                <div className="work-details-row">
                    <h2>Názov práce</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical"/>
                    <InputText
                        style={{width: '30rem'}}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorFields((prev) => ({...prev, name: false}));
                        }}
                        onBlur={() => {
                            if (!name) setErrorFields((prev) => ({...prev, name: true}));
                        }}
                        className={errorFields.name ? "p-invalid" : ""}
                    />
                </div>
                <div className="work-details-row">
                    <h2>Konferencia</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical"/>
                    <Dropdown style={{width: '30rem'}} panelStyle={{width: '30rem'}} placeholder="Vyber Konferenciu"
                              options={optConference} value={selectedConference}
                              onChange={(e) => setSelectedConference(e.value)}/>
                </div>
                <div className="work-details-row">
                    <h2>Kategória</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical"/>
                    <Dropdown style={{width: '30rem'}} panelStyle={{width: '30rem'}} placeholder="Vyber Konferenciu"
                              options={optCategory} value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.value)}/>
                </div>
            </div>
            <div className="rating-table-container">
                <Tooltip target=".custom-choose-btn" content="Prehľadávať" position="bottom"/>
                {/*<Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />*/}
                <Tooltip target=".custom-cancel-btn" content="Vyčistiť" position="bottom"/>

                <FileUpload
                    ref={fileUploadRef}
                    name="demo[]"
                    url="/api/upload"
                    multiple
                    accept=".pdf, .docx"
                    onUpload={onTemplateUpload}
                    onSelect={onTemplateSelect}
                    onError={onTemplateClear}
                    onClear={onTemplateClear}
                    headerTemplate={headerTemplate}
                    itemTemplate={itemTemplate}
                    emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions}
                    cancelOptions={cancelOptions}
                />
            </div>
        </Dialog>
    );
}