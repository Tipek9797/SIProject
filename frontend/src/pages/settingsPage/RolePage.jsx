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

export default function RolePage() {
    const [roles, setRoles] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addRoleName, setAddRoleName] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [editingRole, setEditingRole] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const navigate = useNavigate();

    const fetchRoles = () => {
        axios.get('http://localhost:8080/api/roles')
            .then(response => setRoles(response.data))
            .catch(error => console.error('error: ', error));
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const openNewRoleDialog = () => {
        setAddRoleName('');
        setEditingRole(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewRole = () => {
        const newRole = { name: addRoleName };
        axios.post('http://localhost:8080/api/roles', newRole)
            .then(response => {
                fetchRoles();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateRole = (role) => {
        axios.put(`http://localhost:8080/api/roles/${role.id}`, role)
            .then(response => {
                fetchRoles();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedRoles = () => {
        const deleteRequests = selectedRoles.map(role =>
            axios.delete(`http://localhost:8080/api/roles/${role.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchRoles();
                setSelectedRoles([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _roles = [...roles];
        let { newData, index } = e;
        _roles[index] = newData;
        setRoles(_roles);
        updateRole(newData);
    };

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={() => ToolbarTemplate('Role', navigate, openNewRoleDialog, deleteSelectedRoles, selectedRoles.length)} />
            <DataTable
                value={roles}
                selection={selectedRoles}
                onSelectionChange={e => setSelectedRoles(e.value)}
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
                <Column
                    field="name"
                    header="Názov"
                    filter
                    filterPlaceholder="Vyhľadať"
                    editor={(options) => <InputText type="text"value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
                    sortable />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog header="Pridať Novú Rolu" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText id="name" value={addRoleName} onChange={(e) => setAddRoleName(e.target.value)} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewRole} />
                </Dialog>
            </div>
        </div>
    );
}
