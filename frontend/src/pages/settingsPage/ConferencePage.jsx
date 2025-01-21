import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import ToolbarTemplate from '../../components/ToolbarTemplate';
import './settings.css';

export default function ConferencePage() {
    const [conferences, setConferences] = useState([]);
    const [forms, setForms] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addConference, setAddConference] = useState({ name: '', state: 'Zatvorená', startUpload: null, closeUpload: null, startReview: null, closeReview: null, formId: null, description: '', conferenceStart: null, conferenceEnd: null });
    const [selectedConferences, setSelectedConferences] = useState([]);
    const [editingConference, setEditingConference] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        state: { value: null, matchMode: FilterMatchMode.CONTAINS },
        formId: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const fetchConferencesAndForms = () => {
        axios.get('http://localhost:8080/api/conferences')
            .then(response => setConferences(response.data))
            .catch(error => console.error(error));

        axios.get('http://localhost:8080/api/forms')
            .then(response => setForms(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchConferencesAndForms();
    }, []);

    const openNewConferenceDialog = () => {
        setAddConference({ name: '', state: 'Zatvorená', startUpload: null, closeUpload: null, startReview: null, closeReview: null, formId: null, description: '', conferenceStart: null, conferenceEnd: null });
        setEditingConference(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const dateFormat = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        const hours = `${d.getHours()}`.padStart(2, '0');
        const minutes = `${d.getMinutes()}`.padStart(2, '0');
        const seconds = `${d.getSeconds()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const displayDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        const hours = `${d.getHours()}`.padStart(2, '0');
        const minutes = `${d.getMinutes()}`.padStart(2, '0');
        const seconds = `${d.getSeconds()}`.padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    };

    const saveNewConference = () => {
        const formattedConference = {
            ...addConference,
            startUpload: dateFormat(addConference.startUpload),
            closeUpload: dateFormat(addConference.closeUpload),
            startReview: dateFormat(addConference.startReview),
            closeReview: dateFormat(addConference.closeReview),
            conferenceStart: dateFormat(addConference.conferenceStart),
            conferenceEnd: dateFormat(addConference.conferenceEnd),
            formId: 1
        };
        axios.post('http://localhost:8080/api/conferences', formattedConference)
            .then(response => {
                fetchConferencesAndForms();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateConference = (conference) => {
        const formattedConference = {
            ...conference,
            startUpload: dateFormat(conference.startUpload),
            closeUpload: dateFormat(conference.closeUpload),
            startReview: dateFormat(conference.startReview),
            closeReview: dateFormat(conference.closeReview),
            conferenceStart: dateFormat(conference.conferenceStart),
            conferenceEnd: dateFormat(conference.conferenceEnd),
            formId: 1
        };
        axios.put(`http://localhost:8080/api/conferences/${conference.id}`, formattedConference)
            .then(response => {
                fetchConferencesAndForms();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedConferences = () => {
        const deleteRequests = selectedConferences.map(conference =>
            axios.delete(`http://localhost:8080/api/conferences/${conference.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchConferencesAndForms();
                setSelectedConferences([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _conferences = [...conferences];
        let { newData, index } = e;
        _conferences[index] = newData;
        setConferences(_conferences);
        updateConference(newData);
    };

    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={() => ToolbarTemplate('Konferencie', navigate, openNewConferenceDialog, deleteSelectedConferences, selectedConferences.length)} />
            <DataTable
                value={conferences}
                selection={selectedConferences}
                onSelectionChange={e => setSelectedConferences(e.value)}
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
                <Column field="name" header="Názov" filter filterPlaceholder="Vyhľadať" editor={(options) => <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />} sortable />
                <Column field="state" header="Stav" filter filterPlaceholder="Vyhľadať" sortable />
                <Column field="conferenceStart" header="Začiatok Konferencie" body={(rowData) => displayDate(rowData.conferenceStart)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="conferenceEnd" header="Koniec Konferencie" body={(rowData) => displayDate(rowData.conferenceEnd)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="startUpload" header="Začiatok Nahrávania" body={(rowData) => displayDate(rowData.startUpload)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="closeUpload" header="Koniec Nahrávania" body={(rowData) => displayDate(rowData.closeUpload)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="startReview" header="Začiatok Hodnotenia" body={(rowData) => displayDate(rowData.startReview)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="closeReview" header="Koniec Hodnotenia" body={(rowData) => displayDate(rowData.closeReview)} editor={(options) => <Calendar value={new Date(options.value)} onChange={(e) => options.editorCallback(e.value)} showIcon showTime />} sortable />
                <Column field="description" header="Popis" filter filterPlaceholder="Vyhľadať" editor={(options) => <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />} sortable />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog header="Add New Conference" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText id="name" value={addConference.name} onChange={(e) => setAddConference({ ...addConference, name: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="conferenceStart">Začiatok Konferencie</label>
                        <Calendar id="conferenceStart" value={addConference.conferenceStart} onChange={(e) => setAddConference({ ...addConference, conferenceStart: e.value })} showIcon showTime />
                    </div>
                    <div className="p-field">
                        <label htmlFor="conferenceEnd">Koniec Konferencie</label>
                        <Calendar id="conferenceEnd" value={addConference.conferenceEnd} onChange={(e) => setAddConference({ ...addConference, conferenceEnd: e.value })} showIcon showTime />
                    </div>
                    <div className="p-field">
                        <label htmlFor="startUpload">Začiatok Nahrávania</label>
                        <Calendar id="startUpload" value={addConference.startUpload} onChange={(e) => setAddConference({ ...addConference, startUpload: e.value })} showIcon showTime />
                    </div>
                    <div className="p-field">
                        <label htmlFor="closeUpload">Koniec Nahrávania</label>
                        <Calendar id="closeUpload" value={addConference.closeUpload} onChange={(e) => setAddConference({ ...addConference, closeUpload: e.value })} showIcon showTime />
                    </div>
                    <div className="p-field">
                        <label htmlFor="startReview">Začiatok Hodnotenia</label>
                        <Calendar id="startReview" value={addConference.startReview} onChange={(e) => setAddConference({ ...addConference, startReview: e.value })} showIcon showTime />
                    </div>
                    <div className="p-field">
                        <label htmlFor="closeReview">Koniec Hodnotenia</label>
                        <Calendar id="closeReview" value={addConference.closeReview} onChange={(e) => setAddConference({ ...addConference, closeReview: e.value })} showIcon showTime />
                    </div>
                    <div className="field">
                        <label htmlFor="description">Popis</label>
                        <InputText id="description" value={addConference.description} onChange={(e) => setAddConference({ ...addConference, description: e.target.value })} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewConference} />
                </Dialog>
            </div>
        </div>
    );
}
