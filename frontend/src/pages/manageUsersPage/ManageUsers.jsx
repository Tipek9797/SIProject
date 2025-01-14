import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import axios from "axios";
import "./manageUsers.css";

export default function ManageUsers() {
    const [data, setData] = useState([]);
    const [schools, setSchools] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    useEffect(() => {
        fetchData();
        fetchSchools();
        fetchFaculties();
        fetchRoles();
        initFilters();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users");
            const users = await Promise.all(response.data.map(async (user) => {
                const conferences = await fetchUserConferences(user.id);
                return {
                    id: user.id,
                    firstName: user.name,
                    lastName: user.surname,
                    email: user.email,
                    school: user.school ? { name: user.school.name, id: user.school.id } : null,
                    faculty: user.faculty ? { name: user.faculty.name, id: user.faculty.id } : null,
                    role: user.roles.map((role) => ({ id: role.id, name: role.name })),
                    conferences,
                };
            }));
            setData(users);
        } catch (error) {
            console.error(error);
        }
    };


    const fetchSchools = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/schools");
            setSchools(response.data.map((school) => ({ label: school.name, value: school.id })));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFaculties = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/faculties");
            setFaculties(response.data.map((faculty) => ({
                label: faculty.name,
                value: faculty.facultyId,
                schoolId: faculty.schoolId,
            })));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/roles");
            setRoles(response.data.map((role) => ({ label: role.name, value: role.id })));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserConferences = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/conferences/user-conferences/${userId}`);
            return response.data.map(conference => conference.name).join(", ");
        } catch (error) {
            console.error(error);
            return "N/A";
        }
    };


    const patchUser = async (id, updatedFields) => {
        try {
            await axios.patch(`http://localhost:8080/api/users/${id}`, updatedFields);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    const onRowEditComplete = async (e) => {
        const { newData } = e;
        const updatedFields = {};
        const originalData = data.find((d) => d.id === newData.id);

        for (const key in newData) {
            if (newData[key] !== originalData[key]) {
                if (key === "role") {
                    updatedFields["roleIds"] = newData[key].map((role) => role.id);
                } else if (key === "firstName") {
                    updatedFields["name"] = newData[key];
                } else if (key === "lastName") {
                    updatedFields["surname"] = newData[key];
                } else if (key === "email") {
                    updatedFields["email"] = newData[key];
                } else if (key === "school") {
                    updatedFields["schoolId"] = newData[key].id;
                } else if (key === "faculty") {
                    updatedFields["facultyId"] = newData[key].id;
                }
            }
        }

        if (Object.keys(updatedFields).length > 0) {
            try {
                await patchUser(newData.id, updatedFields);
                const updatedData = data.map((d) => (d.id === newData.id ? { ...d, ...newData } : d));
                setData(updatedData);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        }
    };

    const initFilters = () => {
        setFilters({
            global: { value: "", matchMode: FilterMatchMode.CONTAINS },
            firstName: { value: "", matchMode: FilterMatchMode.CONTAINS },
            lastName: { value: "", matchMode: FilterMatchMode.CONTAINS },
            email: { value: "", matchMode: FilterMatchMode.CONTAINS },
            "school.name": { value: "", matchMode: FilterMatchMode.CONTAINS },
            "faculty.name": { value: "", matchMode: FilterMatchMode.CONTAINS },
            role: { value: [], matchMode: FilterMatchMode.IN },
            conferences: { value: "", matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue("");
    };

    const clearFilters = () => {
        initFilters();
    };

    const roleEditor = (options) => (
        <MultiSelect
            value={options.value.map(role => role.id)}
            options={roles}
            onChange={(e) => options.editorCallback(
                e.value.map(roleId => {
                    const role = roles.find(r => r.value === roleId);
                    return { id: role.value, name: role.label };
                })
            )}
            placeholder="Vyberte rolu"
            display="chip"
            optionLabel="label"
        />
    );

    const textEditor = (options) => (
        <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
        />
    );

    const schoolEditor = (options) => (
        <Dropdown
            value={options.value?.id || null}
            options={schools}
            onChange={(e) =>
                options.editorCallback({
                    id: e.value,
                    name: schools.find((s) => s.value === e.value).label,
                })
            }
            placeholder="Vyberte školu"
            optionLabel="label"
        />
    );

    const facultyEditor = (options) => (
        <Dropdown
            value={options.value?.id || null}
            options={faculties.filter((f) => f.schoolId === options.rowData.school?.id)}
            onChange={(e) =>
                options.editorCallback({
                    id: e.value,
                    name: faculties.find((f) => f.value === e.value).label,
                })
            }
            placeholder="Vyberte fakultu"
            optionLabel="label"
        />
    );

    const header = (
        <div className="header-container">
            <h3 className="header-title">Správa používateľov</h3>
            <div className="header-actions">
                <Button icon="pi pi-filter-slash" label="Vymazať filtre" onClick={clearFilters} />
                <InputText
                    className="global-search"
                    value={globalFilterValue}
                    onChange={(e) => setGlobalFilterValue(e.target.value)}
                    placeholder="Hľadať"
                />
            </div>
        </div>
    );

    return (
        <div className="manage-users-container">
            <DataTable
                value={data}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                globalFilterFields={["firstName", "lastName", "email", "school.name", "faculty.name", "role.name"]}
                header={header}
                emptyMessage="Žiadne údaje neboli nájdené."
            >
                <Column field="firstName" header="Meno" editor={textEditor} sortable filter />
                <Column field="lastName" header="Priezvisko" editor={textEditor} sortable filter />
                <Column field="email" header="Email" editor={textEditor} sortable filter />
                <Column field="school" header="Škola" editor={schoolEditor} body={(rowData) => rowData.school?.name || "N/A"} sortable filterField="school.name" />
                <Column field="faculty" header="Fakulta" editor={facultyEditor} body={(rowData) => rowData.faculty?.name || "N/A"} sortable filterField="faculty.name" />
                <Column field="role" header="Rola" editor={roleEditor} body={(rowData) => rowData.role.map((r) => r.name).join(", ")} filterField="role.name" />
                <Column
                    field="conferences"
                    header="Konferencie"
                    body={(rowData) => rowData.conferences || "Žiadna konferencia"}
                    filter
                    filterField="conferences"
                    sortable
                />
                <Column rowEditor headerStyle={{ width: "10%" }} bodyStyle={{ textAlign: "center" }} />
            </DataTable>
        </div>
    );
}
