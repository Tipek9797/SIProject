import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios.get(`http://localhost:8080/api/users/${userId}`)
                .then(response => {
                    const data = response.data;
                    setUser({
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        password: '',
                        schoolId: data.school ? data.school.id : null,
                        facultyId: data.faculty ? data.faculty.id : null,
                        roleIds: data.roles ? data.roles.map(role => role.id) : []
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setError('Unable to load user data.');
                    setLoading(false);
                });
        }
    }, [userId]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/schools").then(response => setSchools(response.data));
        axios.get("http://localhost:8080/api/faculties").then(response => setFaculties(response.data));
        axios.get("http://localhost:8080/api/roles").then(response => setRoles(response.data));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSave = () => {
        if (!user.name || !user.surname || !user.email) {
            setError('Name, surname, and email are required.');
            return;
        }

        setLoading(true);
        const payload = { ...user };
        if (!payload.password) {
            delete payload.password; // Remove password if not provided
        }

        axios.put(`http://localhost:8080/api/users/${userId}`, payload)
            .then(() => {
                onSave();
                onHide();
                setLoading(false);
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setError('Failed to update user.');
                setLoading(false);
            });
    };

    if (!visible) return null;

    return (
        <div className="edit-user-container">
            <h2>Edit User</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input
                    id="surname"
                    name="surname"
                    value={user.surname}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="schoolId">School</label>
                <select
                    id="schoolId"
                    value={user.schoolId || ''}
                    onChange={(e) => handleDropdownChange('schoolId', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select a School</option>
                    {schools.map(school => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="facultyId">Faculty</label>
                <select
                    id="facultyId"
                    value={user.facultyId || ''}
                    onChange={(e) => handleDropdownChange('facultyId', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select a Faculty</option>
                    {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="roleIds">Roles</label>
                <select
                    id="roleIds"
                    value={user.roleIds || []}
                    onChange={(e) => handleDropdownChange('roleIds', Array.from(e.target.selectedOptions, option => option.value))}
                    className="form-control"
                    multiple
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
            </div>

            <button
                className="save-button"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save'}
            </button>
            <button
                className="cancel-button"
                onClick={onHide}
            >
                Cancel
            </button>
        </div>
    );
};

export default EditUserDialog;
