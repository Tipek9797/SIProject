import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import './editUser.css';

const EditUserDialog = ({ visible, onHide, userId, onSave }) => {
    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        schoolId: null,
        facultyId: null,
        roleIds: []
    });

    const [schools, setSchools] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [roles, setRoles] = useState([]);

    // Fetch user data by ID
    useEffect(() => {
        if (userId) {
            axios.get(`/api/users/${userId}`)
                .then(response => {
                    const data = response.data;
                    setUser({
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        schoolId: data.school ? data.school.id : null,
                        facultyId: data.faculty ? data.faculty.id : null,
                        roleIds: data.roles ? data.roles.map(role => role.id) : []
                    });
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [userId]);

    // Fetch schools and faculties
    useEffect(() => {
        axios.get("/api/schools").then(response => setSchools(response.data));
        axios.get("/api/faculties").then(response => setFaculties(response.data));
        axios.get("/api/roles").then(response => setRoles(response.data));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSave = () => {
        axios.put(`/api/users/${userId}`, user)
            .then(() => {
                onSave(); // Callback to refresh the parent component
                onHide(); // Close the dialog
            })
            .catch(error => console.error('Error updating user:', error));
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Edit User" style={{ width: '50vw' }}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" name="name" value={user.name} onChange={handleInputChange} />
                </div>

                <div className="p-field">
                    <label htmlFor="surname">Surname</label>
                    <InputText id="surname" name="surname" value={user.surname} onChange={handleInputChange} />
                </div>

                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" name="email" value={user.email} onChange={handleInputChange} />
                </div>

                <div className="p-field">
                    <label htmlFor="password">Password</label>
                    <InputText id="password" name="password" type="password" value={user.password} onChange={handleInputChange} />
                </div>

                <div className="p-field">
                    <label htmlFor="schoolId">School</label>
                    <Dropdown
                        id="schoolId"
                        value={user.schoolId}
                        options={schools.map(s => ({ label: s.name, value: s.id }))}
                        onChange={(e) => handleDropdownChange('schoolId', e.value)}
                        placeholder="Select a School"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="facultyId">Faculty</label>
                    <Dropdown
                        id="facultyId"
                        value={user.facultyId}
                        options={faculties.map(f => ({ label: f.name, value: f.facultyId }))}
                        onChange={(e) => handleDropdownChange('facultyId', e.value)}
                        placeholder="Select a Faculty"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="roleIds">Roles</label>
                    <Dropdown
                        id="roleIds"
                        value={user.roleIds}
                        options={roles.map(r => ({ label: r.name, value: r.id }))}
                        onChange={(e) => handleDropdownChange('roleIds', e.value)}
                        placeholder="Select Roles"
                        multiple
                    />
                </div>

                <div className="p-field">
                    <Button label="Save" onClick={handleSave} className="p-button-success" />
                    <Button label="Cancel" onClick={onHide} className="p-button-secondary" style={{ marginLeft: '1rem' }} />
                </div>
            </div>
        </Dialog>
    );
};

export default EditUserDialog;