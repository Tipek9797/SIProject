import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homePage/Home';
import AllWorks from './pages/allWorksPage/AllWorks';
import Event from './pages/eventsPage/Event';
// Pridaj ďalšie importy pre ostatné stránky podľa potreby

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/all-works" element={<AllWorks />} />
                <Route path="/events" element={<Event />} />
                {/* Pridaj ďalšie cesty podľa potreby */}
            </Routes>
        </Router>
    );
}

export default App;