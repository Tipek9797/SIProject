import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Rating } from "primereact/rating";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea, ScrollPanel } from "../index";
import { ReviewService } from '../../pages/worksToReviewPage/service/ReviewService';

export default function WorkInfoDialog({ visible, onHide, data, ratings, columns, boldCodeBodyTemplate, disabledCheckboxTemplate, form, setForm }) {

    useEffect(() => {
        if (visible && data) {
            ReviewService.fetchFormData(data.id).then(fetchedData => {
                console.log('Fetched form data:', fetchedData);
                setForm(fetchedData);
            });
        }
    }, [visible, data, setForm]);

    return (
        <Dialog
            header={data.name}
            visible={visible}
            className="work-dialog-details"
            maximizable
            style={{ width: "50vw" }}
            onHide={onHide}
        >
            <Divider />
            <div className="work-details-text">
                <label>{data.conferenceName}</label><br />
                <div className="work-details-row">
                    <h2>Škola</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical" />
                    <label htmlFor="school">{data.users[0].school.name}</label>
                </div>
                <div className="work-details-row">
                    <h2>Fakulta</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical" />
                    <label htmlFor="department">{data.users[0].faculty.name}</label>
                </div>
                <div className="review-details-row">
                    <h2>Kategória</h2>
                    <i className="pi pi-angle-right"></i>
                    <Divider layout="vertical" />
                    <label htmlFor="category">{data.categories[0].name}</label>
                </div>
                <div className="work-details-row">
                    <h2>Hodnotenie</h2><i className="pi pi-angle-right"></i>
                    <Divider layout="vertical" />
                    {data.state.name === "Ohodnotené" && (
                        <Rating value={data.reviews[0].rating} readOnly cancel={false} />
                    )}
                </div>
                <div className="work-details-row">
                    <h2>Posudok</h2><i className="pi pi-angle-down"></i>
                    <Divider layout="vertical" />
                </div>
                <ScrollPanel className="scrollP">
                    {data.state.name === "Ohodnotené" && (
                        <InputTextarea className="inpTextArea font-bold" disabled autoResize
                            value={data.reviews[0].comment} />
                    )}
                </ScrollPanel>
            </div>
            <div className="rating-table-container">
                {data.state.name === "Ohodnotené" && (
                    <DataTable value={form} size={'small'} showGridlines>
                        {columns.map(({ field, header }) => {
                            return (
                                <Column
                                    key={field}
                                    field={field}
                                    header={header}
                                    className="rating-colum"
                                    body={field === 'name' ? disabledCheckboxTemplate : (field === 'code' ? boldCodeBodyTemplate : null)}
                                />
                            );
                        })}
                    </DataTable>
                )}
            </div>
            <div className="rating-table-container">
                {data.state.name === "Ohodnotené" && (
                    <DataTable value={ratings} className="p-datatable-sm" showGridlines>
                        <Column className="rating-column" field="PRO" header="Pozitíva +" />
                        <Column className="rating-column" field="CON" header="Negatíva -" />
                    </DataTable>
                )}
            </div>
        </Dialog>
    );
}