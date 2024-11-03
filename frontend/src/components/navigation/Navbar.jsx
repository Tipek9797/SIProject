import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User roles:', user ? user.roles : 'No user logged in');
    const token = localStorage.getItem('jwtToken');

    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    const isReviewer = user && user.roles.includes('ROLE_REVIEWER');
    const isStudent = user && user.roles.includes('ROLE_STUDENT');

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/home'),
            visible: true
        },
        {
            label: 'Events',
            icon: 'pi pi-calendar',
            command: () => navigate('/event'),
            visible: true
        },
        {
            label: 'All Works',
            icon: 'pi pi-folder',
            command: () => navigate('/all-works'),
            visible: true
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => navigate('/ManageUsers'),
            visible: true
        }
    ];

    if (token) {
        if (isStudent) {
            items.push({
                label: 'My Work',
                icon: 'pi pi-star',
                command: () => navigate('/mywork'),
                visible: true
            });
        }

        if (isReviewer) {
            items.push({
                label: 'Works To Review',
                icon: 'pi pi-envelope',
                command: () => navigate('/workstoreview'),
                visible: true
            });
        }

        if (isAdmin) {
            items.push({
                label: 'Manage Users',
                icon: 'pi pi-users',
                command: () => navigate('/manageusers'),
                visible: true
            });
            items.push({
                label: 'All Works',
                icon: 'pi pi-file',
                command: () => navigate('/allworks'),
                visible: true
            });
        }
    }

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        navigate('/auth/login');
    };

    // Render the Menubar with navigation items
    const end = (
        <div className="user-info">
            {token ? (
                <>
                    <span className="user-name">{`${user.name} ${user.lastName}`}</span>
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-danger p-ml-2"
                        onClick={handleLogout}
                    />
                </>
            ) : (
                <Button
                    label="Login"
                    icon="pi pi-sign-in"
                    className="p-button-success"
                    onClick={() => navigate('/auth/login')}
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