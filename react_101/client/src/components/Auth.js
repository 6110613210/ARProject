import React, { useState, useEffect } from 'react'
import Axios from "axios";
const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
   Axios.defaults.withCredentials = true;
   
   const [loading, setLoaing] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   const [status, setStatus] = useState(null);
   useEffect(async () => {
      await Axios.get("http://localhost:3001/login").then((response) => {
         if (response.data.loggedIn) {
            setCurrentUser(response.data.user.username);
            setStatus(response.data.user.status);
         }
      });

   }, [])

   return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser, status, setStatus }}>
         {children}
      </AuthContext.Provider>
   )
}
export { AuthContext };
