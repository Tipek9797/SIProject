
import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const ToolbarTemplate = (title, navigate, openNewDialog, deleteSelectedItems, selectedItemsLength) => {
    return (
        <React.Fragment>
            <h1>{title}</h1>
            <Button label="Späť" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => navigate('/settings')} />
            <Button label={`Pridať ${title}`} icon="pi pi-plus" onClick={openNewDialog} />
            <Button label={`Vymazať Vybrané ${title}`} icon="pi pi-trash" className="p-button-danger" onClick={deleteSelectedItems} disabled={!selectedItemsLength} />
        </React.Fragment>
    );
};

export default ToolbarTemplate;