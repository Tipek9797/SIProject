import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import './settings.css';

export default function FormPage() {
    const [forms, setForms] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addReview, setAddReview] = useState('');
    const [selectedForms, setSelectedForms] = useState([]);
    const [editingForm, setEditingForm] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        review: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const fetchForms = () => {
        axios.get('http://localhost:8080/api/forms')
            .then(response => setForms(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const openNewFormDialog = () => {
        setAddReview('');
        setEditingForm(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewForm = () => {
        const newForm = { review: addReview };
        axios.post('http://localhost:8080/api/forms', newForm)
            .then(response => {
                fetchForms();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateForm = (form) => {
        axios.put(`http://localhost:8080/api/forms/${form.id}`, form)
            .then(response => {
                fetchForms();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedForms = () => {
        const deleteRequests = selectedForms.map(form =>
            axios.delete(`http://localhost:8080/api/forms/${form.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchForms();
                setSelectedForms([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _forms = [...forms];
        let { newData, index } = e;
        _forms[index] = newData;
        setForms(_forms);
        updateForm(newData);
    };

    const navigate = useNavigate();

    const toolbarTemplate = () => {
        return (
            <React.Fragment>
                <h1>Formulár</h1>
                <Button label="Späť" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/settings')} />
                <Button label="Pridať Formulár" icon="pi pi-plus" onClick={openNewFormDialog} />
                <Button label="Vymazať Vybrané Formuláre" icon="pi pi-trash" className="p-button-danger" onClick={deleteSelectedForms} disabled={!selectedForms.length} />
            </React.Fragment>
        );
    };

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={toolbarTemplate} />
            <DataTable
                value={forms}
                selection={selectedForms}
                onSelectionChange={e => setSelectedForms(e.value)}
                dataKey="id"
                paginator
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                className="settings-page-table"
                filters={filters}
                filterDisplay="row"
                onFilter={(e) => setFilters(e.filters)}>
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                <Column field="id" header="ID" sortable />
                <Column field="review" header="Hodnotenie" filter filterPlaceholder="Vyhľadať" editor={(options) => <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />} sortable />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog header="Pridať Nový Formulár" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="review">Hodnotenie</label>
                        <InputText id="review" value={addReview} onChange={(e) => setAddReview(e.target.value)} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewForm} />
                </Dialog>
            </div>
        </div>
    );
}