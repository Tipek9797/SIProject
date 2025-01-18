import React, { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Messages } from 'primereact/messages';
import './home.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const messages = useRef(null);


    const handleButtonClick = () => {
        navigate('/events');
    };

    useEffect(() => {
        if (location.state?.message && !sessionStorage.getItem('messageShown')) {
            messages.current.show({
                severity: location.state.type || 'info',
                summary: location.state.message,
            });
            sessionStorage.setItem('messageShown', 'true');
        }

        return () => {
            sessionStorage.removeItem('messageShown');
        };
    }, [location.state]);




    return (
        <div>
            <Messages ref={messages} />
            <div className="background">
                <div className="transparent-box">
                    <h1>ŠTUDENTSKÁ VEDECKÁ KONFERENCIA</h1>
                    <p>22. júna 2025 | UKF v Nitre</p>
                    <Button label="Pozrieť konferencie" icon="pi pi-send" className="button" onClick={handleButtonClick} />
                </div>
            </div>

            <div className="info-container">
                <div className="info">
                    <h2>Aké výhody prináša účasť na ŠVK ?</h2>
                    <ul>
                        <li>Účasť na konferencii je zadarmo</li>
                        <li>Možnosť získať ocenenie</li>
                        <li>Výstupom je publikácia príspevku</li>
                        <li>Získať nové kontakty</li>
                        <li>Získanie cenných skúseností</li>
                        <li>Možnosť rozšíriť svoje portfólio</li>
                        <li>Príležitosť konzultovať svoju prácu so skúsenými odborníkmi</li>
                        <li>Podpora osobného rastu a rozvoja kritického myslenia</li>
                    </ul>
                </div>

                <div className="info2">
                    <h3>TAK NEVÁHAJTE!</h3>
                    <p>a zúčastnite sa študentskej vedeckej konferencie, ktorá je súťažnou prehliadkou vedeckých prác študentov</p>
                    <div className="details-container">
                        <p>Termín konania: To be announced</p>
                        <p>Miesto konania: UKF v Nitre</p>
                    </div>
                </div>

                <div className="info3">
                    <h4>Čo musíte urobiť aby ste sa zúčastnili ?</h4>
                    <ul>
                        <li>Vybrať si školiteľa a dohodnúť sa s ním na téme vedeckej práce</li>
                        <li>Predložiť vedeckú prácu do [Dátum]</li>
                        <li>Prácu verejne prezentovať a obhájiť v príslušnej sekcii pred odbornou komisiou</li>
                        <li>Všetky obhájené práce budú publikované v zborníku recenzovaných prác s názvom Študentská vedecká konferencia 2025</li>
                        <li>V každej sekcii budú najlepšie práce ocenené diplomom a mimoriadnym štipendiom alebo vecnou cenou</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;