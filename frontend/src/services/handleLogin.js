import axios from 'axios';

export const handleLogin = async ({ email, password, toast, navigate }) => {
    if (!email || !password) {
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Prosím vyplnte všetky polia' });
        return;
    }

    try {
        const response = await axios.post('http://localhost:8080/api/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/home');
    } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: error.response?.data?.message ?? 'Prihlásenie sa nepodarilo' });
    }
};

export const handleRegister = (navigate) => {
    navigate("/api/register");
};