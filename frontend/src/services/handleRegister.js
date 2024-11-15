import axios from 'axios';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const initializeSchools = async (setSchools) => {
    try {
        const response = await axios.get('http://localhost:8080/api/schools');
        setSchools(response.data);
    } catch (error) {
        console.error('Error fetching schools:', error);
    }
};

export const handleSchoolChange = (school, setFaculty, setFilteredFaculties, setErrorFields) => {
    setFilteredFaculties(school ? school.faculties : []);
    setFaculty(null);
    setErrorFields(prev => ({ ...prev, school: false }));
};

export const validateFields = ({ name, surname, email, password, school, faculty }) => {
    return {
        name: !name.trim(),
        surname: !surname.trim(),
        email: !email.trim() || !validateEmail(email),
        password: !password.trim(),
        school: !school,
        faculty: !faculty
    };
};

export const handleRegisterSubmit = async (fields, setErrorFields, navigate) => {
    const errors = validateFields(fields);
    setErrorFields(errors);

    const isValid = Object.values(errors).every(error => !error);

    if (isValid) {
        try {
            await axios.post('http://localhost:8080/api/register', fields);
            navigate('/api/login');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }
};
