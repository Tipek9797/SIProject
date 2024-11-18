import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ page, roles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAllowed = user && roles.some(role => user.roles.map(roleName => roleName.name).includes(role));

    return isAllowed ? page : <Navigate to="/home" replace />;
};

export default PrivateRoute;