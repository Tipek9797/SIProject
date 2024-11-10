import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import "./register.css";

export default function Register() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorFields, setErrorFields] = useState({ name: false, lastName: false, email: false, password: false });
    const toast = React.useRef(null);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleCancel = () => {
        navigate('/auth/login');
    };

    return (
        <div className="register-container">
            <Toast ref={toast} />
            <Panel header="Register">
                <div className="p-field">
                    <label htmlFor="name">First Name</label>
                    <InputText
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorFields(prev => ({ ...prev, name: false }));
                        }}
                        onBlur={() => { if (!name) setErrorFields(prev => ({ ...prev, name: true })); }}
                        className={errorFields.name ? 'p-invalid' : ''}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="lastName">Last Name</label>
                    <InputText
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setErrorFields(prev => ({ ...prev, lastName: false }));
                        }}
                        onBlur={() => { if (!lastName) setErrorFields(prev => ({ ...prev, lastName: true })); }}
                        className={errorFields.lastName ? 'p-invalid' : ''}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorFields(prev => ({ ...prev, email: false }));
                        }}
                        onBlur={() => {
                            if (!email || !validateEmail(email)) setErrorFields(prev => ({ ...prev, email: true }));
                        }}
                        className={errorFields.email ? 'p-invalid' : ''}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="password">Password</label>
                    <InputText
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorFields(prev => ({ ...prev, password: false }));
                        }}
                        onBlur={() => { if (!password) setErrorFields(prev => ({ ...prev, password: true })); }}
                        className={errorFields.password ? 'p-invalid' : ''}
                    />
                </div>
                <div className="button-group">
                    <Button label="Register" icon="pi pi-user" className="p-button-success button-spacing"/>
                    <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} className="p-button-secondary"/>
                </div>
            </Panel>
        </div>
    );
}
