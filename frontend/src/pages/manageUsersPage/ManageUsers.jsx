import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import axios from "axios";
import "./manageUsers.css";

export default function ManageUsers() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [roles] = useState([
        { label: "Študent", value: "Študent" },
        { label: "Recenzent", value: "Recenzent" },
        { label: "Admin", value: "Admin" },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/users");
                const users = response.data.map((user, index) => ({
                    id: user.id,
                    firstName: user.name.split(" ")[0],
                    lastName: user.name.split(" ")[1] || "",
                    email: user.email,
                    school: "Škola " + (index + 1),
                    faculty: "Fakulta " + (index + 1),
                    role: ["Študent"],
                }));
                setData(users);
            } catch (error) {
                console.error("Chyba pri načítaní používateľov:", error);
            }
        };

        fetchData();
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            email: { value: null, matchMode: FilterMatchMode.CONTAINS },
            school: { value: null, matchMode: FilterMatchMode.CONTAINS },
            faculty: { value: null, matchMode: FilterMatchMode.CONTAINS },
            role: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue("");
    };

    const clearFilters = () => {
        initFilters();
        setSortField(null);
        setSortOrder(null);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS },
        }));
        setGlobalFilterValue(value);
    };

    const roleFilterTemplate = (options) => (
        <MultiSelect
            value={options.value}
            options={roles}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Vyberte rolu"
            display="chip"
            optionLabel="label"
            className="role-filter"
        />
    );

    const textFilterTemplate = (options) => (
        <InputText
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.target.value)}
            placeholder="Hľadať"
            className="text-filter"
        />
    );

    const header = (
        <div className="header-container">
            <h2 className="header-title">Správa používateľov</h2>
            <div className="header-actions">
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Vymazať filtre"
                    onClick={clearFilters}
                />
                <InputText
                    type="search"
                    placeholder="Hľadať vo všetkých stĺpcoch"
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    className="global-search"
                />
            </div>
        </div>
    );

    return (
        <div className="manage-users-container">
            <DataTable
                value={data}
                paginator
                rows={5}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                onFilter={(e) => setFilters(e.filters)}
                globalFilterFields={["firstName", "lastName", "email", "school", "faculty"]}
                header={header}
                emptyMessage="Žiadne údaje neboli nájdené."
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={(e) => {
                    setSortField(e.sortField);
                    setSortOrder(e.sortOrder);
                }}
            >
                <Column
                    field="firstName"
                    header="Meno"
                    sortable
                    filter
                    filterElement={textFilterTemplate}
                />
                <Column
                    field="lastName"
                    header="Priezvisko"
                    sortable
                    filter
                    filterElement={textFilterTemplate}
                />
                <Column
                    field="email"
                    header="Email"
                    sortable
                    filter
                    filterElement={textFilterTemplate}
                />
                <Column
                    field="school"
                    header="Škola"
                    sortable
                    filter
                    filterElement={textFilterTemplate}
                />
                <Column
                    field="faculty"
                    header="Fakulta"
                    sortable
                    filter
                    filterElement={textFilterTemplate}
                />
                <Column
                    field="role"
                    header="Rola"
                    body={(rowData) => (
                        <MultiSelect
                            value={rowData.role}
                            options={roles}
                            onChange={(e) => {
                                const updatedData = data.map((item) =>
                                    item.id === rowData.id
                                        ? { ...item, role: e.value }
                                        : item
                                );
                                setData(updatedData);
                            }}
                            placeholder="Vyberte rolu"
                            display="chip"
                            optionLabel="label"
                            className="role-editor"
                        />
                    )}
                    filter
                    filterElement={roleFilterTemplate}
                />
            </DataTable>
        </div>
    );
}
