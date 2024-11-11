import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './pages/homePage/Home';
import LoginPage from './pages/loginPage/Login';
import Register from './pages/registerPage/Register';
import MyWorks from './pages/myWorksPage/MyWorks';
import AllWorks from './pages/allWorksPage/AllWorks';
import Event from './pages/eventsPage/Event';
// Pridaj ďalšie importy pre ostatné stránky podľa potreby
import Navbar from "./components/navigation/Navbar";
import ManageUsers from "./pages/manageUsersPage/ManageUsers";

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/manageusers" element={<ManageUsers />} />
                    <Route path="/my-works" element={<MyWorks />} />
                    <Route path="/all-works" element={<AllWorks />} />
                    <Route path="/events" element={<Event />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;