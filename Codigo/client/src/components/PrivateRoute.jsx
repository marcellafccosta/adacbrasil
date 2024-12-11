/* eslint-disable react/prop-types */
// src/components/PrivateRoute.js

import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = AuthService.isLoggedIn() && !AuthService.isSessionExpired();

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
