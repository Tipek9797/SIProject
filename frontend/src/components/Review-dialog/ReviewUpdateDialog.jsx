import React, { useEffect } from 'react';
import {
    InputTextarea,
    ScrollPanel,
    InputText,
    DataTable,
    Divider,
    ListBox,
    Column,
    Button,
    Dialog,
    Rating,
} from "../index";
import axios from 'axios';
import { ReviewService } from '../../pages/worksToReviewPage/service/ReviewService';

const ReviewUpdateDialog = ({
    selectedArticle3,
    selectedConference,
    editVisible,
    editFooterContent,
    setEditVisible,
    starValue,
    setStarValue,
    inputTextValue,
    setInputTextValue,
    text,
    setText,
    plusList,
    addToPlusList,
    minusList,
    addToMinusList,
    selectedPlusItem,
    setSelectedPlusItem,
    selectedMinusItem,
    setSelectedMinusItem,
    deleteFromPlusList,
    deleteFromMinusList,
    columns,
    onCellEditComplete,
    cellEditor,
    boldCodeBodyTemplate,
    disabledCheckboxTemplate,
    form,
    setForm,
}) => {

    return (
        selectedArticle3 && (
            <Dialog
                className="s:dial m:dial reviewDialog"
                header={selectedArticle3.name}
                visible={editVisible}
                footer={editFooterContent}
                maximizable
                onHide={() => {
                    setForm(ReviewService.getProductsData());
                    setEditVisible(false);
                }}
            >
                <div>
                    <Divider />
                    <div className="review-details-text">
                        <label htmlFor="school">{selectedConference.name}</label>
                        <br />
                        <div className="update-review-details-row">{/*review-details-row*/}
                            <h2>Hodnotenie Staré</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <Rating value={selectedArticle3.reviews[0].rating} readOnly cancel={false} />
                        </div>
                        <div className="update-review-details-row">
                            <h2>Hodnotenie Nové</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <Rating value={starValue} onChange={(e) => setStarValue(e.value)} cancel={false} />
                        </div>
                        <div className="update-review-details-row">
                            <h2>Posudok Starý</h2>
                            <i className="pi pi-angle-down"></i>
                            <Divider layout="vertical" />
                        </div>
                        <ScrollPanel className="scrollP">
                            <InputTextarea className="inpTextArea font-bold" disabled autoResize
                                value={selectedArticle3.reviews[0].comment} />
                        </ScrollPanel>
                        <div className="update-review-details-row">
                            <h2>Posudok Nový</h2>
                            <i className="pi pi-angle-down"></i>
                            <Divider layout="vertical" />
                        </div>
                        <ScrollPanel className="scrollP">
                            <InputTextarea
                                className="inpTextArea font-bold"
                                autoResize
                                value={inputTextValue}
                                onChange={(e) => setInputTextValue(e.target.value)}
                            />
                        </ScrollPanel>
                    </div>
                    <div className="rating-table-container">
                        <small className="flex align-items-center justify-content-center">Vyplnte stlačením políčka v stĺpci Hodnotenie.</small>
                        <DataTable value={form} size={'small'} showGridlines
                            editMode="cell">
                            {columns.map(({ field, header }) => {
                                const isEditable = field !== 'code';
                                return (
                                    <Column
                                        key={field}
                                        field={field}
                                        header={header}
                                        className="rating-colum"
                                        body={field === 'name' ? disabledCheckboxTemplate : (field === 'code' ? boldCodeBodyTemplate : null)}
                                        editor={isEditable ? (options) => cellEditor(options) : null}
                                        onCellEditComplete={isEditable ? onCellEditComplete : null}
                                    />
                                );
                            })}
                        </DataTable>
                    </div>
                    <Divider />
                    <div className="flex justify-content-center">
                        <div className="flex align-items-center flex-column gap-2">
                            <InputText
                                value={text}
                                placeholder="Napíšte niečo..."
                                onChange={(e) => setText(e.target.value)}
                                style={{ width: '30rem' }}
                            />
                            <small>Stlač + Pozitíva alebo - Negatíva, na pridanie.</small>
                        </div>
                    </div>
                    <div className="plusminus flex justify-content-between">
                        <Button
                            className="custom-width"
                            label="Pozitíva"
                            icon="pi pi-plus"
                            rounded
                            severity="success"
                            onClick={addToPlusList}
                        />
                        <Button
                            className="custom-width"
                            label="Negatíva"
                            icon="pi pi-minus"
                            rounded
                            severity="danger"
                            onClick={addToMinusList}
                        />
                    </div>
                    <div className="flex gap-2">
                        <ListBox
                            value={selectedPlusItem}
                            options={plusList.map((item) => ({ label: item, value: item }))}
                            onChange={(e) => setSelectedPlusItem(e.value)}
                            className="p-d-block"
                            style={{ width: '100%' }}
                        />
                        <ListBox
                            value={selectedMinusItem}
                            options={minusList.map((item) => ({ label: item, value: item }))}
                            onChange={(e) => setSelectedMinusItem(e.value)}
                            className="p-d-block"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="flex py-2 justify-content-between">
                        <Button
                            label="Delete"
                            icon="pi pi-trash"
                            onClick={deleteFromPlusList}
                            severity="danger"
                            disabled={!selectedPlusItem}
                        />
                        <Button
                            label="Delete"
                            icon="pi pi-trash"
                            onClick={deleteFromMinusList}
                            severity="danger"
                            disabled={!selectedMinusItem}
                        />
                    </div>
                </div>
            </Dialog>
        )
    );
};

export default ReviewUpdateDialog;