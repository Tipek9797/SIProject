import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate } from 'react-router-dom';
// Import PrimeReact CSS a ikony
import './home.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
const Home = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const items = [
        { label: 'Home', icon: 'pi pi-home' },
        { label: 'Events', icon: 'pi pi-calendar' },
        { label: 'User Account', icon: 'pi pi-user' },
        { label: 'Settings', icon: 'pi pi-cog' }
    ];
    const handleTabChange = (e) => {
        setActiveIndex(e.index);
        // Navigate to different routes based on tab index
        switch (e.index) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/events');
                break;
            case 2:
                navigate('/login');
                break;
            case 3:
                navigate('/manage-users');
                break;
            default:
                navigate('/');
        }
    };
    return (
        <div>
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={handleTabChange}
                style={{ fontSize: '20px' }} // Pridaj veľkosť písma podľa potreby
            />
        </div>
    );
};
export default Home;