import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Rank } from '@/store/userSlice';


type ProtectedRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
    rank: Rank
}


const ProtectedRouteAdmin = ({ isAuthenticated, children, rank }: ProtectedRouteProps) => {
    if (!isAuthenticated) {
        return <Navigate to="/loginAdmin" />;
    }

    if (isAuthenticated && rank === 'Admin') {
        return children
    }
};

export default ProtectedRouteAdmin;