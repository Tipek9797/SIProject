import React, { useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const getUserFromLocalStorage = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const extractRoleNames = (roles) => {
        return roles.map(role => role.name);
    };

    const user = getUserFromLocalStorage();

    const token = localStorage.getItem('jwtToken');
    const roleNames = user ? extractRoleNames(user.roles) : [];

    const isAdmin = roleNames.includes('ROLE_ADMIN');
    const isReviewer = roleNames.includes('ROLE_REVIEWER');
    const isStudent = roleNames.includes('ROLE_USER');

    const items = [
        {
            label: 'Domov',
            icon: 'pi pi-home',
            command: () => navigate('/home'),
            visible: true
        },
        {
            label: 'Konferencie',
            icon: 'pi pi-calendar',
            command: () => navigate('/events'),
            visible: true
        }
    ];

    if (token) {
        if (isStudent) {
            items.push({
                label: 'Moja Práca',
                icon: 'pi pi-star',
                command: () => navigate('/my-works'),
                visible: true
            });
        }

        if (isReviewer) {
            items.push({
                label: 'Práce na hodnotenie',
                icon: 'pi pi-envelope',
                command: () => navigate('/works-to-review'),
                visible: true
            });
        }

        if (isAdmin) {
            items.push({
                label: 'Spravovať Používateľov',
                icon: 'pi pi-users',
                command: () => navigate('/manage-users'),
                visible: true
            });
            items.push({
                label: 'Spravovať Práce',
                icon: 'pi pi-file',
                command: () => navigate('/all-works'),
                visible: true
            });
            items.push({
                label: 'Nastavenia',
                icon: 'pi pi-cog',
                command: () => navigate('/settings'),
                visible: true
            });
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('tokenExpiration');
        navigate('/api/login');
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expDate = new Date(localStorage.getItem('tokenExpiration'));
            if (expDate) {
                if (new Date() >= expDate) {
                    handleLogout();
                }
            }
        };
    
        const interval = setInterval(checkTokenExpiration, 300000);
    
        return () => clearInterval(interval);
    }, []);

    const end = (
        <div className="user-info">
            {token ? (
                <>
                    <span className="user-name">{`${user.name} ${user.surname}`}</span>
                    <Button 
                        label="Odhlásiť Sa"
                        icon="pi pi-sign-out"
                        className="p-button-danger"
                        onClick={handleLogout}
                    />
                </>
            ) : (
                <Button
                    label="Prihlásenie"
                    icon="pi pi-sign-in"
                    className="p-button-success"
                    onClick={() => navigate('/api/login')}
                />
            )}
        </div>
    );

    return (
        <div className="navbar">
            <Menubar model={items} end={end} />
        </div>
    );
}