import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import './AllWorks.css';

export default function AllWorks() {
    const [articles, setArticles] = useState([]);
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        reviewerId: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'state.id': { value: null, matchMode: FilterMatchMode.EQUALS },
        categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
        conferenceId: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const fetchArticles = () => {
        axios.get('http://localhost:8080/api/conferences')
            .then(response => {
                const articlesWithConferences = response.data.flatMap(conference => 
                    conference.articles.map(article => ({
                        ...article,
                        conferenceName: conference.name,
                        conferenceId: conference.id
                    }))
                );
                setArticles(articlesWithConferences);
                setConferences(response.data.map(conference => ({ label: conference.name, value: conference.id })));
                console.log("articles --- ", articlesWithConferences);
            })
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

    const fetchReviewers = () => {
        axios.get('http://localhost:8080/api/users/reviewers')
            .then(response => { setUsers(response.data); console.log("reviewers --- ", response.data); })
            .catch(error => console.error(error));
    };

    const fetchConferences = () => {
        axios.get('http://localhost:8080/api/conferences')
            .then(response => {
                setConferences(response.data.map(conference => ({ label: conference.name, value: conference.id })));
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchArticles();
        fetchStatesAndCategories();
        fetchReviewers();
        fetchConferences();
    }, []);

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
            reviewerId: newData.reviewerId
        };

        _articles[index] = newData;
        setArticles(_articles);
        console.log('Updated data:', updatedData);

        axios.patch(`http://localhost:8080/api/articles/${newData.id}`, updatedData)
            .then(response => fetchArticles())
            .catch(error => console.error(error));
    };

    const prosAndConsBodyTemplate = (rowData) => {
        return rowData.prosAndConsList ? rowData.prosAndConsList.map(pc => pc.description).join(', ') : '';
    };

    const reviewsBodyTemplate = (rowData) => {
        return rowData.reviews ? rowData.reviews.map(review => `${review.rating} - ${review.comment}`).join(', ') : '';
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
                placeholder="Vyberte"
            />
        );
    };

    const stateFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value || null}
                options={states}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => {
                    const selectedState = states.find(state => state.id === e.value);
                    if (selectedState) {
                        options.filterApplyCallback(selectedState.id);
                    } else {
                        options.filterApplyCallback(null);
                    }
                }}
                placeholder="Vyberte"
                className="p-column-filter"
                showClear
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
                placeholder="Vyberte"
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
    const onFilter = (e) => {
        setFilters(e.filters);
        console.log('Filters:', e.filters);
    };

    const downloadMostRecentFile = (articleId, fileType) => {
        console.log(`Downloading most recent ${fileType} file for article ID: ${articleId}`);
        axios.get(`http://localhost:8080/api/files/download/recent/${articleId}/${fileType}`, { responseType: 'blob' })
            .then(response => {
                const contentDisposition = response.headers['content-disposition'];
                console.log('Content-Disposition:', contentDisposition);
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'file';
                console.log('File name:', fileName);
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error('Error downloading file:', error));
    };

    const downloadDocxButtonTemplate = (rowData) => {
        const hasDocxFiles = rowData.files && rowData.files.some(file => file.fileTypeDocx);
        return hasDocxFiles ? (
            <Button label="Stiahnut Docx" icon="pi pi-download" onClick={() => downloadMostRecentFile(rowData.id, 'docx')} />
        ) : null;
    };

    const downloadPdfButtonTemplate = (rowData) => {
        const hasPdfFiles = rowData.files && rowData.files.some(file => file.fileTypePdf);
        return hasPdfFiles ? (
            <Button label="Stiahnut Pdf" icon="pi pi-download" onClick={() => downloadMostRecentFile(rowData.id, 'pdf')} />
        ) : null;
    };

    const downloadAllMostRecentFilesAsZip = () => {
        axios.get('http://localhost:8080/api/files/download/zip', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'VsetkyNajnovsiePrace.zip');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error('Error downloading ZIP file:', error));
    };

    const conferenceBodyTemplate = (rowData) => {
        return rowData.conferenceName;
    };

    const conferenceFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value || null}
                options={conferences}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Vyberte"
                className="p-column-filter"
                showClear
            />
        );
    };

    return (
        <div className="all-works-page">
            <Button label="Stiahnuť všetky najnovšie súbory" icon="pi pi-download" onClick={downloadAllMostRecentFilesAsZip} />
            <DataTable
                value={articles}
                paginator
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                className="all-works-table"
                filters={filters}
                filterDisplay="row"
                onFilter={onFilter}>
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
                    editor={stateEditor}
                    filter
                    filterElement={stateFilterTemplate}
                    sortable />
                <Column
                    field="users"
                    header="Autor"
                    body={(rowData) => getUserFullName(rowData.users)}
                    sortable />
                <Column
                    field="categories"
                    header="Kategórie"
                    body={(rowData) => getCategoryNames(rowData.categories)}
                    editor={categoriesEditor}
                    sortable />
                <Column
                    field="conferenceId"
                    header="Konferencia"
                    body={conferenceBodyTemplate}
                    filter
                    filterElement={conferenceFilterTemplate}
                    sortable />
                <Column
                    field="reviews"
                    header="Recenzie"
                    body={reviewsBodyTemplate}
                    sortable />
                <Column
                    field="prosAndConsList"
                    header="Klady a Zápory"
                    body={prosAndConsBodyTemplate}
                    sortable />
                <Column
                    header="Stiahnut Docx"
                    body={downloadDocxButtonTemplate}
                    headerStyle={{ width: '7rem' }}
                    bodyStyle={{ textAlign: 'center' }}
                />
                <Column
                    header="Stiahnut Pdf"
                    body={downloadPdfButtonTemplate}
                    headerStyle={{ width: '7rem' }}
                    bodyStyle={{ textAlign: 'center' }}
                />
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    );
}