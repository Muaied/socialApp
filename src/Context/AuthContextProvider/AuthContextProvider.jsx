import axios from "axios";
import { createContext, useState } from "react";

export const AuthUserContext = createContext();

// Lazy Inilitzation

export default function AuthContextProvider({children}) {
    const [userData, setUserData] = useState(function() {
        return getUserData();
    })
    
    // const [token, setToken] = useState(function() {
        
    //     return localStorage.getItem('token')
    // });

    async function getUserData() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}users/profile-data`, {
            headers: {
                token: localStorage.getItem('token')
            }
        })
        setUserData(response.data.data.user)
        return response.data.user
        } catch (error) {
            setUserData(null)
            return null
        }
    }



    const hamada = {userData, setUserData, getUserData}
  return <AuthUserContext value={hamada}>
    {children}
  </AuthUserContext>;
}
