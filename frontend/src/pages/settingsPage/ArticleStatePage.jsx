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
import ToolbarTemplate from '../../components/ToolbarTemplate';
import './settings.css';

export default function ArticleStatePage() {
    const [states, setStates] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addStateName, setAddStateName] = useState('');
    const [selectedStates, setSelectedStates] = useState([]);
    const [editingState, setEditingState] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const fetchStates = () => {
        axios.get('http://localhost:8080/api/article-states')
            .then(response => setStates(response.data))
            .catch(error => console.error('error: ', error));
    };

    useEffect(() => {
        fetchStates();
    }, []);

    const openNewStateDialog = () => {
        setAddStateName('');
        setEditingState(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewState = () => {
        const newState = { name: addStateName };
        axios.post('http://localhost:8080/api/article-states', newState)
            .then(response => {
                fetchStates();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateState = (state) => {
        axios.put(`http://localhost:8080/api/article-states/${state.id}`, state)
            .then(response => {
                fetchStates();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedStates = () => {
        const deleteRequests = selectedStates.map(state =>
            axios.delete(`http://localhost:8080/api/article-states/${state.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchStates();
                setSelectedStates([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _states = [...states];
        let { newData, index } = e;
        _states[index] = newData;
        setStates(_states);
        updateState(newData);
    };

    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={() => ToolbarTemplate('Stavy Článkov', navigate, openNewStateDialog, deleteSelectedStates, selectedStates.length)} />
            <DataTable
                value={states}
                selection={selectedStates}
                onSelectionChange={e => setSelectedStates(e.value)}
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
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog header="Pridať Nový Stav" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText id="name" value={addStateName} onChange={(e) => setAddStateName(e.target.value)} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewState} />
                </Dialog>
            </div>
        </div>
    );
}
