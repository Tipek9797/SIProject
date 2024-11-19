import axios from 'axios';

export const handleLogin = async ({ email, password, toast, navigate }) => {
    if (!email || !password) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill all fields' });
        return;
    }

    try {
        const response = await axios.post('http://localhost:8080/api/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/home');
    } catch (error) {
        console.error("Login error:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message ?? 'Login failed' });
    }
};

export const handleRegister = (navigate) => {
    navigate("/api/register");
};