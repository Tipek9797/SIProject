import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { FileUpload } from "primereact/fileupload";

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
                                         }) {
    return (
        <Dialog
            header="Upload"
            visible={visible}
            className="work-dialog-upload"
            footer={footer}
            maximizable
            style={{ width: "50vw" }}
            onHide={onHide}
        >
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
                            setErrorFields((prev) => ({ ...prev, name: false }));
                        }}
                        onBlur={() => {
                            if (!name) setErrorFields((prev) => ({ ...prev, name: true }));
                        }}
                        className={errorFields.name ? "p-invalid" : ""}
                    />
                </div>

                <Tooltip target=".custom-choose-btn" content="Browse" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

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