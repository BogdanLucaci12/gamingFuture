import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
}


const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps ) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;