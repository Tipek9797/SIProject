import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import ToolbarTemplate from '../../components/ToolbarTemplate';
import './settings.css';

export default function SchoolPage() {
    const [schools, setSchools] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addSchoolName, setAddSchoolName] = useState('');
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [editingSchool, setEditingSchool] = useState(null);
    const navigate = useNavigate();

    const fetchSchools = () => {
        axios.get('http://localhost:8080/api/schools')
            .then(response => setSchools(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const openNewSchoolDialog = () => {
        setAddSchoolName('');
        setEditingSchool(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewSchool = () => {
        const newSchool = { name: addSchoolName };
        axios.post('http://localhost:8080/api/schools', newSchool)
            .then(response => {
                fetchSchools();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateSchool = (school) => {
        axios.put(`http://localhost:8080/api/schools/${school.id}`, school)
            .then(response => {
                fetchSchools();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedSchools = () => {
        const deleteRequests = selectedSchools.map(school =>
            axios.delete(`http://localhost:8080/api/schools/${school.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchSchools();
                setSelectedSchools([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _schools = [...schools];
        let { newData, index } = e;
        _schools[index] = newData;
        setSchools(_schools);
        updateSchool(newData);
    };

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={() => ToolbarTemplate('Školy', navigate, openNewSchoolDialog, deleteSelectedSchools, selectedSchools.length)} />
            <DataTable
                value={schools}
                selection={selectedSchools}
                onSelectionChange={e => setSelectedSchools(e.value)}
                dataKey="id"
                paginator
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                className="settings-page-table"
                filterDisplay="row">
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                <Column field="id" header="ID" sortable />
                <Column field="name" header="Názov" editor={(options) => <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />} sortable />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog header="Pridať Novú Školu" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText id="name" value={addSchoolName} onChange={(e) => setAddSchoolName(e.target.value)} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewSchool} />
                </Dialog>
            </div>
        </div>
    );
}