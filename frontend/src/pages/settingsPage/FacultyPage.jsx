import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import './settings.css';

export default function FacultyPage() {
    const [faculties, setFaculties] = useState([]);
    const [schools, setSchools] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addFacultyName, setAddFacultyName] = useState('');
    const [addSchoolId, setAddSchoolId] = useState(null);
    const [selectedFaculties, setSelectedFaculties] = useState([]);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        schoolId: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const fetchFacultiesAndSchools = () => {
        axios.get('http://localhost:8080/api/faculties')
            .then(response => {
                setFaculties(response.data);
            })
            .catch(error => console.error(error));

        axios.get('http://localhost:8080/api/schools')
            .then(response => {
                setSchools(response.data);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchFacultiesAndSchools();
    }, []);

    const openNewFacultyDialog = () => {
        setAddFacultyName('');
        setAddSchoolId(null);
        setEditingFaculty(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewFaculty = () => {
        const newFaculty = {
            name: addFacultyName,
            schoolId: addSchoolId.id
        };
        axios.post('http://localhost:8080/api/faculties', newFaculty)
            .then(response => {
                fetchFacultiesAndSchools();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateFaculty = (faculty) => {
        axios.put(`http://localhost:8080/api/faculties/${faculty.facultyId}`, faculty)
            .then(response => {
                fetchFacultiesAndSchools();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedFaculties = () => {
        const deleteRequests = selectedFaculties.map(faculty =>
            axios.delete(`http://localhost:8080/api/faculties/${faculty.facultyId}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchFacultiesAndSchools();
                setSelectedFaculties([]);
            })
            .catch(error => console.error(error));
    };

    const getSchoolName = (schoolId) => {
        const school = schools.find(school => school.id === schoolId);
        return school ? school.name : '---';
    };

    const onRowEditComplete = (e) => {
        let _faculties = [...faculties];
        let { newData, index } = e;
        _faculties[index] = newData;
        setFaculties(_faculties);
        updateFaculty({
            facultyId: newData.facultyId,
            name: newData.name,
            schoolId: newData.schoolId
        });
    };

    const schoolEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={schools}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => {
                    options.editorCallback(e.value);
                }}
                placeholder="Vyberte školu" />
        );
    };

    const schoolFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={schools}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Vyberte školu"
                className="p-column-filter"
                showClear
            />
        );
    };

    const navigate = useNavigate();

    const toolbarTemplate = () => {
        return (
            <React.Fragment>
                <h1>Fakulty</h1>
                <Button label="Späť" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/settings')} />
                <Button label="Pridať fakultu" icon="pi pi-plus" onClick={openNewFacultyDialog} />
                <Button label="Zmazať vybrané fakulty" icon="pi pi-trash" className="p-button-danger" onClick={deleteSelectedFaculties} disabled={!selectedFaculties.length} />
            </React.Fragment>
        );
    };

    return (
        <div className="settings-page">
            <Toolbar
                className="mb-4 settings-page-toolbar"
                start={toolbarTemplate} />
            <DataTable
                value={faculties}
                filters={filters}
                filterDisplay="row"
                onFilter={(e) => setFilters(e.filters)}
                selection={selectedFaculties}
                onSelectionChange={e => setSelectedFaculties(e.value)}
                dataKey="facultyId"
                paginator
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                className="settings-page-table">
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3em' }} />
                <Column
                    field="facultyId"
                    header="ID"
                    sortable />
                <Column
                    field="name"
                    header="Názov"
                    filter
                    filterPlaceholder="Vyhľadať"
                    editor={(options) => <InputText type="text" value={options.value}
                        onChange={(e) => options.editorCallback(e.target.value)} />}
                    sortable />
                <Column
                    field="schoolId"
                    header="Škola"
                    body={(rowData) => getSchoolName(rowData.schoolId)}
                    editor={schoolEditor}
                    filter
                    filterElement={schoolFilterTemplate}
                    showFilterMenu={false}
                    sortable />
                <Column
                    rowEditor
                    headerStyle={{ width: '7rem' }}
                    bodyStyle={{ textAlign: 'center' }} />
            </DataTable>

            <div className="card">
                <Dialog
                    header="Pridať novú fakultu"
                    visible={displayDialog}
                    style={{ width: '50vw' }}
                    onHide={hideDialog}
                    className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText
                            id="name"
                            value={addFacultyName}
                            onChange={(e) => setAddFacultyName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="school">Škola</label>
                        <Dropdown
                            id="school"
                            value={addSchoolId}
                            options={schools}
                            onChange={(e) => setAddSchoolId(e.value)}
                            optionLabel="name"
                            placeholder="Vybrať Školu" />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewFaculty} />
                </Dialog>
            </div>
        </div>
    );
}