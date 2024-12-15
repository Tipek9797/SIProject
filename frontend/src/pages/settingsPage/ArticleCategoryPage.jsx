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

export default function ArticleCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [addCategoryName, setAddCategoryName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const fetchCategories = () => {
        axios.get('http://localhost:8080/api/article-categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('error: ', error));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openNewCategoryDialog = () => {
        setAddCategoryName('');
        setEditingCategory(null);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
    };

    const saveNewCategory = () => {
        const newCategory = { name: addCategoryName };
        axios.post('http://localhost:8080/api/article-categories', newCategory)
            .then(response => {
                fetchCategories();
                hideDialog();
            })
            .catch(error => console.error(error));
    };

    const updateCategory = (category) => {
        axios.put(`http://localhost:8080/api/article-categories/${category.id}`, category)
            .then(response => {
                fetchCategories();
            })
            .catch(error => console.error(error));
    };

    const deleteSelectedCategories = () => {
        const deleteRequests = selectedCategories.map(category =>
            axios.delete(`http://localhost:8080/api/article-categories/${category.id}`)
        );
        Promise.all(deleteRequests)
            .then(() => {
                fetchCategories();
                setSelectedCategories([]);
            })
            .catch(error => console.error(error));
    };

    const onRowEditComplete = (e) => {
        let _categories = [...categories];
        let { newData, index } = e;
        _categories[index] = newData;
        setCategories(_categories);
        updateCategory(newData);
    };

    const navigate = useNavigate();

    return (
        <div className="settings-page">
            <Toolbar className="mb-4 settings-page-toolbar" start={() => ToolbarTemplate('Kategórie Článkov', navigate, openNewCategoryDialog, deleteSelectedCategories, selectedCategories.length)} />
            <DataTable
                value={categories}
                selection={selectedCategories}
                onSelectionChange={e => setSelectedCategories(e.value)}
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
                <Dialog header="Pridať Novú Kategóriu" visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog} className="settings-page-dialog">
                    <div className="p-field">
                        <label htmlFor="name">Názov</label>
                        <InputText id="name" value={addCategoryName} onChange={(e) => setAddCategoryName(e.target.value)} />
                    </div>
                    <Button label="Pridať" icon="pi pi-check" onClick={saveNewCategory} />
                </Dialog>
            </div>
        </div>
    );
}