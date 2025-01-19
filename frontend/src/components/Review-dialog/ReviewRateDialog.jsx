import React from 'react';
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

const ReviewRateDialog = ({
                              visible,
                              onHide,
                              selectedArticle,
                              selectedConference,
                              ratingFooterContent,
                              starValue,
                              setStarValue,
                              inputTextValue,
                              setInputTextValue,
                              text,
                              setText,
                              plusList,
                              addToPlusList,
                              selectedPlusItem,
                              setSelectedPlusItem,
                              deleteFromPlusList,
                              minusList,
                              addToMinusList,
                              selectedMinusItem,
                              setSelectedMinusItem,
                              deleteFromMinusList,
                              columns,
                              onCellEditComplete,
                              cellEditor,
                              boldCodeBodyTemplate,
                              disabledCheckboxTemplate,
                              form,
                          }) => {
    return (
        <>
            {selectedArticle && (
                <Dialog
                    className="s:dial m:dial reviewDialog"
                    header={selectedArticle.name}
                    visible={visible}
                    footer={ratingFooterContent}
                    maximizable
                    onHide={onHide}
                >
                    <Divider/>
                    <div className="review-details-text">
                        <label htmlFor="school">{selectedConference.name}</label>
                        <br/>
                        <div className="review-details-row">
                            <h2>Škola</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical"/>
                            <label htmlFor="school">{selectedArticle.users[0].school.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Fakulta</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical"/>
                            <label htmlFor="department">{selectedArticle.users[0].faculty.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Kategória</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical"/>
                            <label htmlFor="category">{selectedArticle.categories[0].name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Hodnotenie</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical"/>
                            <Rating value={starValue} onChange={(e) => setStarValue(e.value)} cancel={false}/>
                        </div>
                        <div className="review-details-row">
                            <h2>Posudok</h2>
                            <i className="pi pi-angle-down"></i>
                            <Divider layout="vertical"/>
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
                        <DataTable value={form} size={'small'} showGridlines editMode="cell">
                            {columns.map(({field, header}) => {
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
                    <div>
                        <Divider/>
                        <div className="flex justify-content-center">
                            <div className="flex align-items-center flex-column gap-2">
                                <InputText
                                    value={text}
                                    placeholder="Napíšte niečo..."
                                    onChange={(e) => setText(e.target.value)}
                                    style={{width: '30rem'}}
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
                                options={plusList.map((item) => ({label: item, value: item}))}
                                onChange={(e) => setSelectedPlusItem(e.value)}
                                className="p-d-block"
                                style={{width: '100%'}}
                            />
                            <ListBox
                                value={selectedMinusItem}
                                options={minusList.map((item) => ({label: item, value: item}))}
                                onChange={(e) => setSelectedMinusItem(e.value)}
                                className="p-d-block"
                                style={{width: '100%'}}
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
            )}
        </>
    );
};

export default ReviewRateDialog;