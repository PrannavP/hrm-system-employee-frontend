import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { User } from "../types";

interface UserContextType{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            const decodedToken = jwtDecode<User>(token); // decode the token using the User type
            const isTokenExpired = decodedToken.exp * 1000 < Date.now() // check if the token is expired or not

            if(!isTokenExpired){
                setUser(decodedToken);
            }else{
                // Token is expired, clear session
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }, []);

    return(
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    );
};