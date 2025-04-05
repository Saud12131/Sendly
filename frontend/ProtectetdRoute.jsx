import { Navigate } from 'react-router-dom';
import React from 'react';
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // or get from context

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;
