import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import './settings.css';

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div className="settings-container">
            <h1>Nastavenia</h1>
            <Panel className="settings-panel" header="Nastavenia Konferencií">
                <div className="settings-menu">
                    <Button label="Kategórie Článkov" className="settings-button" onClick={() => navigate('/settings/article-category')} />
                    <Button label="Konferencie" className="settings-button" onClick={() => navigate('/settings/conference')} />
                    <Button label="Formulár" className="settings-button" onClick={() => navigate('/settings/form')} />
                    <Button label="Školy" className="settings-button" onClick={() => navigate('/settings/school')} />
                    <Button label="Fakulty" className="settings-button" onClick={() => navigate('/settings/faculty')} />
                    <Button label="Role" className="settings-button" onClick={() => navigate('/settings/role')} />
                    <Button label="Stavy Článkov" className="settings-button" onClick={() => navigate('/settings/article-state')} />
                    <Button label="Kategórie recenzií Pre a Proti" className="settings-button" onClick={() => navigate('/settings/pros-and-cons-category')} />
                </div>
            </Panel>
        </div>
    );
}