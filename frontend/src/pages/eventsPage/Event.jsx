import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import './event.css';

const Event = () => {
    const [conferences, setConferences] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/conferences');
                if (!response.ok) throw new Error('Nepodarilo sa načítať konferencie');
                const data = await response.json();

                const updatedConferences = await Promise.all(
                    data.map(async (conference) => {
                        const isUserJoined = user ? await checkUserInConference(conference.id, user.id) : false;
                        return { ...conference, userJoined: isUserJoined };
                    })
                );

                setConferences(updatedConferences);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchConferences();
    }, [user]);

    const checkUserInConference = async (conferenceId, userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/conferences/${conferenceId}/isUserIn?userId=${userId}`);
            if (!response.ok) throw new Error('Chyba pri overovaní účasti používateľa');
            return await response.json();
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const handleJoinConference = async (conference) => {
        const token = localStorage.getItem('jwtToken');
        if (!user || !token) {
            setError('Užívateľ nie je prihlásený');
            return;
        }

        try {
            const conferenceDTO = { formId: user.id };
            const response = await fetch(`http://localhost:8080/api/conferences/${conference.id}/addUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(conferenceDTO),
            });

            if (!response.ok) throw new Error('Nepodarilo sa pridať na konferenciu');

            const updatedConference = await response.json();
            setConferences((prevConferences) =>
                prevConferences.map((c) =>
                    c.id === updatedConference.id ? { ...c, userJoined: true } : c
                )
            );
            setVisible(false);
        } catch (error) {
            setError('Chyba pri pridávaní na konferenciu');
            console.error(error);
        }
    };

    const handleGoToConference = () => {
        navigate('/my-works');
    };

    return (
        <div className="event-container">
            {error && <div className="error-message">{error}</div>}

            {conferences.map((conference) => (
                <div
                    className="event-card"
                    key={conference.id}
                    onClick={() => setSelectedConference(conference)}
                >
                    <Card title={conference.name} subTitle={`Stav: ${conference.state}`}>
                        <div className="event-dates">
                            <p>
                                <strong>Začiatok konferencie:</strong>{' '}
                                {new Date(conference.startUpload).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Koniec konferencie:</strong>{' '}
                                {new Date(conference.closeUpload).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="event-actions">
                            {user ? (
                                conference.userJoined ? (
                                    <Button
                                        label="Prejsť na konferenciu"
                                        icon="pi pi-sign-in"
                                        className="p-button-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoToConference();
                                        }}
                                    />
                                ) : (
                                    <Button
                                        label="Pridať sa"
                                        icon="pi pi-user-plus"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJoinConference(conference);
                                        }}
                                        className="p-button-success"
                                    />
                                )
                            ) : null}
                            <Button
                                label="Zobraziť detaily"
                                icon="pi pi-info-circle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedConference(conference);
                                    setVisible(true);
                                }}
                                className="p-button-secondary"
                                style={{ marginLeft: '10px' }}
                            />
                        </div>
                    </Card>
                </div>
            ))}

            {selectedConference && (
                <Dialog
                    header={selectedConference.name}
                    visible={visible}
                    style={{ width: '400px' }}
                    onHide={() => setVisible(false)}
                >
                    <p>
                        <strong>Stav:</strong> {selectedConference.state}
                    </p>
                    <p>
                        <strong>Začiatok konferencie:</strong>{' '}
                        {new Date(selectedConference.startUpload).toLocaleString()}
                    </p>
                    <p>
                        <strong>Koniec konferencie:</strong>{' '}
                        {new Date(selectedConference.closeUpload).toLocaleString()}
                    </p>
                    <p>
                        <strong>Začiatok hodnotenia:</strong>{' '}
                        {new Date(selectedConference.startReview).toLocaleString()}
                    </p>
                    <p>
                        <strong>Koniec hodnotenia:</strong>{' '}
                        {new Date(selectedConference.closeReview).toLocaleString()}
                    </p>
                    <p>
                        <strong>Popis:</strong> {selectedConference.description}
                    </p>
                    {user && selectedConference.userJoined ? (
                        <Button
                            label="Prejsť na konferenciu"
                            icon="pi pi-sign-in"
                            className="p-button-secondary"
                            onClick={handleGoToConference}
                        />
                    ) : user ? (
                        <Button
                            label="Pridať sa"
                            icon="pi pi-user-plus"
                            onClick={() => handleJoinConference(selectedConference)}
                            className="p-button-success"
                        />
                    ) : null}
                </Dialog>
            )}
        </div>
    );
};

export default Event;
