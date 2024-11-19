import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManageUsers from "./pages/manageUsersPage/ManageUsers";
import AllWorks from './pages/allWorksPage/AllWorks';
import Register from './pages/registerPage/Register';
import Navbar from "./components/navigation/Navbar";
import MyWorks from './pages/myWorksPage/MyWorks';
import LoginPage from './pages/loginPage/Login';
import Event from './pages/eventsPage/Event';
import Home from './pages/homePage/Home';
import Footer from './components/footer/Footer';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <div className="content-wrapper" style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/api/login" replace />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/events" element={<Event />} />
                        <Route path="/api/login" element={<LoginPage />} />
                        <Route path="/api/register" element={<Register />} />
                        <Route path="/manage-users"
                            element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ManageUsers />} />} />
                        <Route path="/all-works"
                            element={<PrivateRoute roles={['ROLE_ADMIN']} page={<AllWorks />} />} />
                        <Route path="/my-works"
                            element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} page={<MyWorks />} />} />
                        <Route path="/works-to-review"
                            element={<PrivateRoute roles={['ROLE_REVIEWER']} page={<AllWorks />} />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;