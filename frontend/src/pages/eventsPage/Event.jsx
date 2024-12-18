import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import './event.css';

const Event = () => {
    const [conferences, setConferences] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/conferences')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch conferences');
                }
                return response.json();
            })
            .then((data) => setConferences(data))
            .catch((error) => console.error('Error fetching conferences:', error));
    }, []);

    const onCardClick = (conference) => {
        setSelectedConference(conference);
        setVisible(true);
    };

    return (
        <div className="event-container">
            {conferences.map((conference) => (
                <div className="event-card" key={conference.id} onClick={() => onCardClick(conference)}>
                    <Card title={conference.name} subTitle={`Stav: ${conference.state}`}>
                        <div className="event-dates">
                            <p><strong>Začiatok konferencie:</strong> {new Date(conference.startUpload).toLocaleDateString()}</p>
                            <p><strong>Koniec konferencie:</strong> {new Date(conference.closeUpload).toLocaleDateString()}</p>
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
                    <p><strong>Stav:</strong> {selectedConference.state}</p>
                    <p><strong>Začiatok konferencie:</strong> {new Date(selectedConference.startUpload).toLocaleString()}</p>
                    <p><strong>Koniec konferencie:</strong> {new Date(selectedConference.closeUpload).toLocaleString()}</p>
                    <p><strong>Začiatok hodnotenia:</strong> {new Date(selectedConference.startReview).toLocaleString()}</p>
                    <p><strong>Koniec hodnotenia:</strong> {new Date(selectedConference.closeReview).toLocaleString()}</p>
                </Dialog>
            )}
        </div>
    );
};

export default Event;

