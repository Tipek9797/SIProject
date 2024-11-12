import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
//import { Panel } from "primereact/panel";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFields, setErrorFields] = useState({ email: false, password: false });
    const toast = React.useRef(null);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleLogin = () => {
        navigate("/my-works");
    };

    const handleRegister = () => {
        navigate("/auth/register");
    };

    return (
        <div className="login-container">
            <Toast ref={toast} />
            <div className="login-box">
                <div className="login-image">
                    <img
                        src="https://images.unsplash.com/photo-1573646609328-01f50a125c0c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="logimage"
                    />
                </div>
                <div className="login-form">
                    <h1>Študentská Vedecká Konferencia</h1>
                    <p>Prihláste sa do svojho účtu</p><br/>
                    <InputText
                        id="email"
                        value={email}
                        placeholder="Email"
                        onChange={() => setErrorFields((prev) => ({...prev, email: false}))}
                        onBlur={() => {
                            if (!email || !validateEmail(email)) setErrorFields((prev) => ({...prev, email: true}));
                        }}
                        className={errorFields.email ? "p-invalid" : ""}
                    />
                    <InputText
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={() => setErrorFields((prev) => ({...prev, password: false}))}
                        onBlur={() => {
                            if (!password) setErrorFields((prev) => ({...prev, password: true}));
                        }}
                        className={errorFields.password ? "p-invalid" : ""}
                    />
                    <Button label="Login" icon="pi pi-sign-in" onClick={handleLogin} className="p-button-success"/>
                    <Button label="Register" icon="pi pi-user" onClick={handleRegister} className="p-button-info"/>
                </div>
            </div>
        </div>
    );
}