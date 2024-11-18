import React from 'react';
import { PiGlobe, PiFacebookLogo, PiInstagramLogo } from 'react-icons/pi';  // Import ikony glóbusu a ostatných ikon

import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h2>Vitajte na našej stránke</h2>
                    <p>Na tejto stránke môžu školy pridávať svoje práce, zúčastňovať sa udalostí a sledovať priebeh hodnotenia. Sme radi, že ste tu a tešíme sa na vaše príspevky.</p>
                    <button className="project-button">Povedzte nám o vašom projekte</button>
                </div>
                <div className="footer-right">
                    <h3>Kontakt</h3>
                    <p>Email: <a href="mailto:info@skola.sk">info@skola.sk</a></p>
                    <p>Telefón: <a href="tel:+421123456789">+421 123 456 789</a></p>
                    <p>Adresa: Tr. A. Hlinku 1, 949 01 Nitra, Slovensko</p>
                    <div className="social-icons">
                        {/* Zmenená ikona Discordu na PiGlobe */}
                        <a href="https://www.fpvai.ukf.sk/sk/" target="_blank" rel="noopener noreferrer">
                            <PiGlobe size={30} />
                        </a>
                        {/* Facebook a Instagram ikony */}
                        <a href="https://www.facebook.com/fpvai.ukf" target="_blank" rel="noopener noreferrer">
                            <PiFacebookLogo size={30} />
                        </a>
                        <a href="https://www.instagram.com/fpvai.ukf/" target="_blank" rel="noopener noreferrer">
                            <PiInstagramLogo size={30} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
