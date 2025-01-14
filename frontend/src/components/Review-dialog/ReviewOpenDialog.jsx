import React from 'react';
import {
    InputTextarea,
    ScrollPanel,
    DataTable,
    Divider,
    Dialog,
    Rating,
    Column,
} from "../index";

const ReviewOpenDialog = ({
                              visible,
                              onHide,
                              selectedArticle,
                              selectedConference,
                              ratings,
                          }) => {
    return (
        <>
            {selectedArticle && (
                <Dialog
                    className="s:dial m:dial reviewDialog"
                    header={selectedArticle.name}
                    visible={visible}
                    maximizable
                    onHide={onHide}
                >
                    <Divider />
                    <div className="review-details-text">
                        <label htmlFor="school">{selectedConference.name}</label>
                        <br />
                        <div className="review-details-row">
                            <h2>Škola</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <label htmlFor="school">{selectedArticle.users[0].school.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Fakulta</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <label htmlFor="department">{selectedArticle.users[0].faculty.name}</label>
                        </div>
                        <div className="review-details-row">
                            <h2>Hodnotenie</h2>
                            <i className="pi pi-angle-right"></i>
                            <Divider layout="vertical" />
                            <Rating value={selectedArticle.reviews[0].rating} readOnly cancel={false} />
                        </div>
                        <div className="review-details-row">
                            <h2>Posudok</h2>
                            <i className="pi pi-angle-down"></i>
                            <Divider layout="vertical" />
                        </div>
                        <ScrollPanel className="scrollP">
                            <InputTextarea
                                className="inpTextArea font-bold"
                                disabled
                                autoResize
                                value={selectedArticle.reviews[0].comment}
                            />
                        </ScrollPanel>
                    </div>
                    <div className="rating-table-container">
                        <DataTable value={ratings} className="p-datatable-sm" showGridlines>
                            <Column className="rating-column" field="PRO" header="Pozitíva +" />
                            <Column className="rating-column" field="CON" header="Negatíva -" />
                        </DataTable>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default ReviewOpenDialog;