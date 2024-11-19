import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Rating } from "primereact/rating";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function WorkInfoDialog({ visible, onHide, ratings, footer }) {
    return (
        <Dialog
            header="Názov práce"
            visible={visible}
            className="work-dialog-details"
            footer={footer}
            maximizable
            style={{ width: "50vw" }}
            onHide={onHide}
        >
            <Divider />
            <div className="work-details-text">
                <div className="work-details-row">
                    <h2>Škola</h2>
                    <Divider layout="vertical" />
                    <label htmlFor="school">Univerzita Konštantína Filozofa v Nitre</label>
                </div>
                <div className="work-details-row">
                    <h2>Katedra</h2>
                    <Divider layout="vertical" />
                    <label htmlFor="department">Katedra Informatiky</label>
                </div>
                <div className="work-details-row">
                    <h2>Odbor</h2>
                    <Divider layout="vertical" />
                    <label htmlFor="field">Aplikovaná Informatika</label>
                </div>
                <div className="work-details-row">
                    <h2>Hodnotenie</h2>
                    <Divider layout="vertical" />
                    <Rating value={4} readOnly cancel={false} />
                </div>
            </div>
            <div className="rating-table-container">
                <DataTable value={ratings} className="p-datatable-sm" showGridlines>
                    <Column className="rating-column" field="pros" header="Pozitíva +" />
                    <Column className="rating-column" field="cons" header="Negatíva -" />
                </DataTable>
            </div>
        </Dialog>
    );
}