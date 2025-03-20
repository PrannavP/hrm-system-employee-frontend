import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuthRedirect = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthRedirect: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
            navigate('/login'); // Redirect to login if no token
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    return WithAuthRedirect;
};

export default withAuthRedirect;