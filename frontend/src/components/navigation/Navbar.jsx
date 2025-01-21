import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const getUserFromLocalStorage = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user && user.roles ? user : { roles: [] };
        } catch (error) {
            console.error("Error reading user from localStorage:", error);
            return { roles: [] };
        }
    };

    const extractRoleNames = (roles) => {
        if (!roles || !Array.isArray(roles)) return [];
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
        setShowMenu(false);
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('tokenExpiration');
        navigate('/api/login');
    };

    const toggleMenu = () => {
        setShowMenu((prevState) => !prevState);
    };

    const handleEditProfile = () => {
        const userId = user?.id;
        if (userId) {
            setShowMenu(false);
            navigate(`/edit-user/${userId}`);
        } else {
            console.error("User ID is not available.");
        }
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

        if (token) {
            const interval = setInterval(checkTokenExpiration, 300000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const end = (
        <div className="user-info">
            {token ? (
                <>
                    <div className="user-dropdown">
                        <Button
                            label={`${user.name} ${user.surname}`}
                            icon="pi pi-user"
                            className="user-button"
                            onClick={toggleMenu}
                        />
                        {showMenu && (
                            <div className="dropdown-menu">
                                <button onClick={handleEditProfile} className="dropdown-item">
                                    Upraviť profil
                                </button>
                                <button onClick={handleLogout} className="dropdown-item">
                                    Odhlásiť sa
                                </button>
                            </div>
                        )}
                    </div>
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
