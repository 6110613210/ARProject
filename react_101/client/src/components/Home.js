import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Redirect } from 'react-router-dom'
import { AuthContext } from "./Auth";
import Student from "./Student";
import Techer from "./Techer"
const Home = () => {
   Axios.defaults.withCredentials = true;
   const { currentUser, setCurrentUser, status, setStatus } = useContext(AuthContext);
   if (currentUser) {
      console.log(status)
      if (status === "techer") {
         return (<Techer />);
      }
      return (<Student />);
   }
   else {
      return (<Redirect to="/login" />);
   }

}

export default Home;
