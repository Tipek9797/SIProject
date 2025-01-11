import React, { useState, useEffect } from "react";
import "./editUser.css";
import { useParams } from "react-router-dom";

const EditUserDialog = ({ onClose, onUpdate }) => {
    const { id } = useParams();
    const [userData, setUserData] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [schools, setSchools] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`http://localhost:8080/api/users/${id}`);
                if (!userResponse.ok) throw new Error("Nepodarilo sa načítať údaje používateľa");
                const userData = await userResponse.json();
                setUserData(userData);
                setFirstName(userData.name || "");
                setLastName(userData.surname || "");
                setEmail(userData.email || "");
                setSelectedSchool(userData.school_id || null);
                setSelectedFaculty(userData.faculty_id || null);

                const schoolsResponse = await fetch("http://localhost:8080/api/schools");
                if (!schoolsResponse.ok) throw new Error("Nepodarilo sa načítať zoznam škôl");
                const schoolsData = await schoolsResponse.json();
                setSchools(schoolsData);

                const facultiesResponse = await fetch("http://localhost:8080/api/faculties");
                if (!facultiesResponse.ok) throw new Error("Nepodarilo sa načítať zoznam fakúlt");
                const facultiesData = await facultiesResponse.json();
                setFaculties(facultiesData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        try {
            const updatedUser = {
                name: firstName,
                surname: lastName,
                email,
                ...(selectedSchool !== userData.school_id && { schoolId: selectedSchool }), // Zmena na schoolId
                ...(selectedFaculty !== userData.faculty_id && { facultyId: selectedFaculty }), // Zmena na facultyId
            };

            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error("Chyba pri aktualizácii používateľa");
            }

            setSuccessMessage("Zmeny profilu boli úspešne uložené!");
            setTimeout(() => setSuccessMessage(""), 3000);

            onUpdate && onUpdate();
            onClose && onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="edit-user-dialog">
            <div className="dialog-content">
                <h2>Upraviť používateľa</h2>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="form-group">
                    <label>Meno:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Priezvisko:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Škola:</label>
                    <select
                        value={selectedSchool || ""}
                        onChange={(e) => setSelectedSchool(Number(e.target.value))}
                    >
                        <option value="">-- Vyberte školu --</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                                {school.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Fakulta:</label>
                    <select
                        value={selectedFaculty || ""}
                        onChange={(e) => setSelectedFaculty(Number(e.target.value))}
                        disabled={!selectedSchool}
                    >
                        <option value="">-- Vyberte fakultu --</option>
                        {faculties
                            .filter((faculty) => faculty.schoolId === selectedSchool)
                            .map((faculty) => (
                                <option key={faculty.facultyId} value={faculty.facultyId}>
                                    {faculty.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="dialog-actions">
                    <button onClick={handleSave}>Uložiť</button>
                    <button onClick={() => onClose && onClose()}>Zrušiť</button>
                </div>
            </div>
        </div>
    );
};

export default EditUserDialog;
