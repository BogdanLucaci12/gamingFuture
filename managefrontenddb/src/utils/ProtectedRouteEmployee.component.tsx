import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';


type ProtectedRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
}


const ProtectedRouteEmployee = ({ isAuthenticated, children}: ProtectedRouteProps ) => {
    if (!isAuthenticated) {
        return <Navigate to="/loginEmployee" />;
    }

    if(isAuthenticated){
        return children;
    }
};

export default ProtectedRouteEmployee;