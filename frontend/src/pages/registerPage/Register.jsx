// components/Register/Register.js

import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import {
    initializeSchools,
    handleSchoolChange,
    validateFields,
    handleRegisterSubmit
} from '../../services/handleRegister';
import "./register.css";

export default function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [school, setSchool] = useState(null);
    const [faculty, setFaculty] = useState(null);
    const [schools, setSchools] = useState([]);
    const [filteredFaculties, setFilteredFaculties] = useState([]);
    const [errorFields, setErrorFields] = useState({
        name: false,
        surname: false,
        email: false,
        password: false,
        school: false,
        faculty: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        initializeSchools(setSchools);
    }, []);

    useEffect(() => {
        handleSchoolChange(school, setFaculty, setFilteredFaculties, setErrorFields);
    }, [school]);

    const handleRegister = () => {
        const fields = { name, surname, email, password, school, faculty };
        handleRegisterSubmit(fields, setErrorFields, navigate);
    };

    const handleBlur = () => {
        const fields = { name, surname, email, password, school, faculty };
        setErrorFields(validateFields(fields));
    };

    return (
        <div className="register-container">
            <Panel header="Register">
                <div className="p-field">
                    <label htmlFor="name">First Name</label>
                    <InputText
                        id="name"
                        value={name}
                        placeholder="Name"
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorFields(prev => ({ ...prev, name: false }));
                        }}
                        onBlur={handleBlur}
                        className={errorFields.name ? 'p-invalid' : ''}
                    />
                    {errorFields.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="surname">Last Name</label>
                    <InputText
                        id="surname"
                        value={surname}
                        placeholder="Surname"
                        onChange={(e) => {
                            setSurname(e.target.value);
                            setErrorFields(prev => ({ ...prev, surname: false }));
                        }}
                        onBlur={handleBlur}
                        className={errorFields.surname ? 'p-invalid' : ''}
                    />
                    {errorFields.surname && <small className="p-error">Surname is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorFields(prev => ({ ...prev, email: false }));
                        }}
                        onBlur={handleBlur}
                        className={errorFields.email ? 'p-invalid' : ''}
                    />
                    {errorFields.email && <small className="p-error">Valid email is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="password">Password</label>
                    <InputText
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorFields(prev => ({ ...prev, password: false }));
                        }}
                        onBlur={handleBlur}
                        className={errorFields.password ? 'p-invalid' : ''}
                    />
                    {errorFields.password && <small className="p-error">Password is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="school">School</label>
                    <Dropdown
                        id="school"
                        value={school}
                        options={schools}
                        onChange={(e) => setSchool(e.value)}
                        optionLabel="name"
                        placeholder="Select a School"
                        className={errorFields.school ? 'p-invalid' : ''}
                        onBlur={handleBlur}
                    />
                    {errorFields.school && <small className="p-error">School is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="faculty">Faculty</label>
                    <Dropdown
                        id="faculty"
                        value={faculty}
                        options={filteredFaculties}
                        onChange={(e) => setFaculty(e.value)}
                        optionLabel="name"
                        placeholder="Select a Faculty"
                        className={errorFields.faculty ? 'p-invalid' : ''}
                        disabled={!school}
                        onBlur={handleBlur}
                    />
                    {errorFields.faculty && <small className="p-error">Faculty is required.</small>}
                </div>
                <div className="button-group">
                    <Button 
                        label="Register" 
                        icon="pi pi-user" 
                        onClick={handleRegister} 
                        className="p-button-success button-spacing"
                    />
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        onClick={() => navigate('/api/login')} 
                        className="p-button-secondary"
                    />
                </div>
            </Panel>
        </div>
    );
}
