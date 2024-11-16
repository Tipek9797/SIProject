import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import ManageUsers from "./pages/manageUsersPage/ManageUsers";
import AllWorks from './pages/allWorksPage/AllWorks';
import Register from './pages/registerPage/Register';
import Navbar from "./components/navigation/Navbar";
import MyWorks from './pages/myWorksPage/MyWorks';
import LoginPage from './pages/loginPage/Login';
import Event from './pages/eventsPage/Event';
import Home from './pages/homePage/Home';
import Footer from './components/footer/Footer'; // Import Footer komponentu aby sa zobrazoval na každej strane.
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
                        <Route path="/api/login" element={<LoginPage />} />
                        <Route path="/api/register" element={<Register />} />
                        <Route path="/manageusers" element={<ManageUsers />} />
                        <Route path="/my-works" element={<MyWorks />} />
                        <Route path="/all-works" element={<AllWorks />} />
                        <Route path="/events" element={<Event />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;