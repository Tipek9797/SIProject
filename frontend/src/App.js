import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import Home from './pages/homePage/Home';
import LoginPage from './pages/loginPage/Login';
import AllWorks from './pages/allWorksPage/AllWorks';
import Event from './pages/eventsPage/Event';
import ManageUsers from './pages/manageUsersPage/ManageUsers';
// Pridaj ďalšie importy pre ostatné stránky podľa potreby

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/manageusers" element={<ManageUsers />} />
                    <Route path="/all-works" element={<AllWorks />} />
                    <Route path="/events" element={<Event />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;