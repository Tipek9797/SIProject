import React from 'react';
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
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/home'),
            visible: true
        },
        {
            label: 'Events',
            icon: 'pi pi-calendar',
            command: () => navigate('/events'),
            visible: true
        }
    ];

    if (token) {
        if (isStudent) {
            items.push({
                label: 'My Work',
                icon: 'pi pi-star',
                command: () => navigate('/my-works'),
                visible: true
            });
        }

        if (isReviewer) {
            items.push({
                label: 'Works To Review',
                icon: 'pi pi-envelope',
                command: () => navigate('/works-to-review'),
                visible: true
            });
        }

        if (isAdmin) {
            items.push({
                label: 'Manage Users',
                icon: 'pi pi-users',
                command: () => navigate('/manage-users'),
                visible: true
            });
            items.push({
                label: 'All Works',
                icon: 'pi pi-file',
                command: () => navigate('/all-works'),
                visible: true
            });
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        navigate('/api/login');
    };

    const end = (
        <div className="user-info">
            {token ? (
                <>
                    <span className="user-name">{`${user.name} ${user.surname}`}</span>
                    <Button 
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-danger"
                        onClick={handleLogout}
                    />
                </>
            ) : (
                <Button
                    label="Login"
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