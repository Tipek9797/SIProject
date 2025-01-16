import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ManageUsers from "./pages/manageUsersPage/ManageUsers";
import AllWorks from './pages/allWorksPage/AllWorks';
import WorksToReview from './pages/worksToReviewPage/WorksToReview';
import Register from './pages/registerPage/Register';
import Navbar from "./components/navigation/Navbar";
import MyWorks from './pages/myWorksPage/MyWorks';
import LoginPage from './pages/loginPage/Login';
import Event from './pages/eventsPage/Event';
import Home from './pages/homePage/Home';
import Footer from './components/footer/Footer';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Settings from './pages/settingsPage/Settings';
import ArticleCategoryPage from './pages/settingsPage/ArticleCategoryPage';
import SchoolPage from './pages/settingsPage/SchoolPage';
import FacultyPage from './pages/settingsPage/FacultyPage';
import ConferencePage from './pages/settingsPage/ConferencePage';
import ArticleStatePage from './pages/settingsPage/ArticleStatePage';
import RolePage from './pages/settingsPage/RolePage';
import ProsAndConsCategoryPage from './pages/settingsPage/ProsAndConsCategoryPage';
import EditUserDialog from './components/editUser/EditUserDialog';  //Tu som len pridal routing na tú EditPage

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
                        <Route path="/manage-users" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ManageUsers />} />} />
                        <Route path="/all-works" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<AllWorks />} />} />
                        <Route path="/my-works" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} page={<MyWorks />} />} />
                        <Route path="/works-to-review" element={<PrivateRoute roles={['ROLE_REVIEWER']} page={<WorksToReview />} />} />
                        <Route path="/settings" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<Settings />} />} />
                        <Route path="/settings/article-category" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ArticleCategoryPage />} />} />
                        <Route path="/settings/school" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<SchoolPage />} />} />
                        <Route path="/settings/faculty" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<FacultyPage />} />} />
                        <Route path="/settings/conference" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ConferencePage />} />} />
                        <Route path="/settings/article-state" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ArticleStatePage />} />} />
                        <Route path="/settings/role" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<RolePage />} />} />
                        <Route path="/settings/pros-and-cons-category" element={<PrivateRoute roles={['ROLE_ADMIN']} page={<ProsAndConsCategoryPage />} />} />
                        <Route path="/edit-user/:id" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_REVIEWER']} page={<EditUserDialog />} />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
