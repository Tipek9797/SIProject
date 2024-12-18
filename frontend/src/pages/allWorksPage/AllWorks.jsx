import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import './allWorks.css';

export default function AllWorks() {
    const [articles, setArticles] = useState([]);
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        reviewerId: { value: null, matchMode: FilterMatchMode.CONTAINS },
        state: { value: null, matchMode: FilterMatchMode.EQUALS },
        users: { value: null, matchMode: FilterMatchMode.CONTAINS },
        categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
        prosAndConsList: { value: null, matchMode: FilterMatchMode.CONTAINS },
        reviews: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const fetchArticles = () => {
        axios.get('http://localhost:8080/api/articles')
            .then(response => { setArticles(response.data); console.log(response.data); })
            .catch(error => console.error(error));
    };

    const fetchStatesAndCategories = () => {
        axios.get('http://localhost:8080/api/article-states')
            .then(response => {
                setStates(response.data);
            })
            .catch(error => console.error(error));

        axios.get('http://localhost:8080/api/article-categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => console.error(error));
    };

    const fetchUsers = () => {
        axios.get('http://localhost:8080/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchArticles();
        fetchStatesAndCategories();
        fetchUsers();
    }, []);

    const prosAndConsBodyTemplate = (rowData) => {
        return rowData.prosAndConsList ? rowData.prosAndConsList.map(pc => pc.description).join(', ') : '';
    };

    const reviewsBodyTemplate = (rowData) => {
        return rowData.reviews ? rowData.reviews.map(review => `${review.rating} - ${review.comment}`).join(', ') : '';
    };

    const onRowEditComplete = (e) => {
        let _articles = [...articles];
        let { newData, index } = e;

        const updatedData = {
            stateId: newData.state.id.id,
            categoryIds: Array.isArray(newData.categories)
                ? newData.categories.id
                : [newData.categories],
            name: newData.name,
            date: newData.date,
            filePath: newData.filePath,
            reviewerId: newData.reviewerId
        };

        _articles[index] = newData;
        setArticles(_articles);
        console.log('Updated data:', updatedData);

        axios.patch(`http://localhost:8080/api/articles/${newData.id}`, updatedData)
            .then(response => fetchArticles())
            .catch(error => console.error(error));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleDateString('sk-SK', options).replace(',', '');
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const stateEditor = (options) => {
        return (
            <Dropdown
                value={options.value.id}
                options={states}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => options.editorCallback(states.find(state => state.id === e.value))}
                placeholder="Vyberte stav"
            />
        );
    };

    const categoriesEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={categories}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => {
                    options.editorCallback(e.value);
                    console.log(e.value);
                }}
                placeholder="Vyberte kategóriu"
            />
        );
    };

    const reviewerEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={users}
                optionLabel={(user) => `${user.id} - ${user.name}`}
                optionValue="id"
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Vyberte recenzenta"
            />
        );
    };

    const getCategoryNames = (categories) => {
        if (!Array.isArray(categories)) return '---';
        return categories.map(category => {
            const categoryData = category.id ? category : categories.find(cat => cat.id === category);
            return categoryData ? categoryData.name : '---';
        }).join(', ');
    };

    const getUserFullName = (users) => {
        return users.map(user => `${user.name} ${user.surname}`).join(', ');
    };

    const reviewerBodyTemplate = (rowData) => {
        const reviewer = users.find(user => user.id === rowData.reviewerId);
        return reviewer ? `${reviewer.id} - ${reviewer.name} ${reviewer.surname}` : rowData.reviewerId;
    };

    const stateFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value || null}
                options={states}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Vyberte"
                className="p-column-filter"
                showClear
            />
        );
    };

    const categoriesFilterTemplate = (options) => {
        return (
            <InputText
                value={options.value || ''}
                onChange={(e) => {
                    console.log('Kategórie filter value:', e.target.value);
                    options.filterApplyCallback(e.target.value);
                }}
                placeholder="Vyhľadať"
                className="p-column-filter"
            />
        );
    };

    const reviewerFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value || null}
                options={users}
                optionLabel={(user) => `${user.id} - ${user.name} ${user.surname}`}
                optionValue="id"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Vyberte"
                className="p-column-filter"
                showClear
            />
        );
    };

    const usersFilterTemplate = (options) => {
        return (
            <InputText
                value={options.value || ''}
                onChange={(e) => {
                    console.log('Autor filter value:', e.target.value);
                    options.filterApplyCallback(e.target.value);
                }}
                placeholder="Vyhľadať"
                className="p-column-filter"
            />
        );
    };

    const prosAndConsFilterTemplate = (options) => {
        return (
            <InputText
                value={options.value || ''}
                onChange={(e) => {
                    console.log('Klady a Zápory filter value:', e.target.value);
                    options.filterApplyCallback(e.target.value);
                }}
                placeholder="Vyhľadať"
                className="p-column-filter"
            />
        );
    };

    const reviewsFilterTemplate = (options) => {
        return (
            <InputText
                value={options.value || ''}
                onChange={(e) => {
                    console.log('Recenzie filter value:', e.target.value);
                    options.filterApplyCallback(e.target.value);
                }}
                placeholder="Vyhľadať recenzie"
                className="p-column-filter"
            />
        );
    };

    return (
        <div className="all-works-page">
            <DataTable
                value={articles}
                paginator
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                className="all-works-table"
                filters={filters}
                filterDisplay="row"
                onFilter={(e) => setFilters(e.filters)}>
                <Column
                    field="id"
                    header="ID"
                    filter
                    filterPlaceholder="Vyhľadať"
                    sortable />
                <Column
                    field="name"
                    header="Názov"
                    filter
                    filterPlaceholder="Vyhľadať"
                    sortable />
                <Column
                    field="date"
                    header="Dátum"
                    body={dateBodyTemplate}
                    filter
                    filterPlaceholder="Vyhľadať"
                    sortable />
                <Column
                    field="filePath"
                    header="Cesta k súboru"
                    sortable />
                <Column
                    field="reviewerId"
                    header="ID Recenzenta"
                    body={reviewerBodyTemplate}
                    editor={reviewerEditor}
                    filter
                    filterElement={reviewerFilterTemplate}
                    sortable />
                <Column
                    field="state.id"
                    header="Stav"
                    body={(rowData) => rowData.state.name}
                    editor={stateEditor} filter filterElement={stateFilterTemplate}
                    sortable />
                <Column
                    field="users"
                    header="Autor"
                    body={(rowData) => getUserFullName(rowData.users)}
                    filter filterElement={usersFilterTemplate}
                    sortable />
                <Column
                    field="categories"
                    header="Kategórie"
                    body={(rowData) => getCategoryNames(rowData.categories)}
                    editor={categoriesEditor}
                    filter
                    filterElement={categoriesFilterTemplate}
                    sortable />
                <Column
                    field="reviews"
                    header="Recenzie"
                    body={reviewsBodyTemplate}
                    filter
                    filterElement={reviewsFilterTemplate}
                    sortable />
                <Column
                    field="prosAndConsList"
                    header="Klady a Zápory"
                    body={prosAndConsBodyTemplate}
                    filter
                    filterElement={prosAndConsFilterTemplate}
                    sortable />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    );
}
