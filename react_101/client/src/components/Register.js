import React, { useState, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "./Auth";
import { Redirect } from 'react-router-dom'
const Login = () => {
   const [isRegiter,setIsRegiter] = useState(false);
   const [status, setStatus] = useState("");
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setconfirmPassword] = useState('');
   const [error, setError] = useState('');
   const { currentUser , setCurrentUser } = useContext(AuthContext);
   Axios.defaults.withCredentials = true;
   const handleUsername = event => {
      setUsername(event.target.value);
   }

   const handlePassword = event => {
      setPassword(event.target.value);
   }
   const handleconfirmPassword = event => {
      setconfirmPassword(event.target.value);
   }
   const handleStatus = event => {
      setStatus(event.target.value);
   }
   const postRegister =  () => {
      console.log("55555")
      if (password === confirmPassword) {
         Axios.post("http://localhost:3001/register", {
            username: username,
            password: password,
            status: status,
         }).then((response) => {
            console.log("555555")
            if (response.data.message) {
               console.log("55555",response.data.message);
               setError(response.data.message);
            }
            else{
               console.log("55555");
               setIsRegiter(true);
            }
         });
      } else {
         setError("Wrong input");
      };

   };
   if (!!currentUser ){
      return(<Redirect to = "/"/>);
   }
   if(!!isRegiter){
      return(<Redirect to="/login" />)
   }
   return (
      <div className="login-page">
         <header className="login-header">
            <h1> Register </h1>
         </header>
         <div className="container">
            <div className="row">
               <div className="col-sm-9 col-md-7 col-lg-5 mx-auto ">
                  <div className="card card-signin my-5">
                     <div className="card-body">
                        <h5 className="card-title text-center">Register</h5>
                        {error &&
                           <p>{error}</p>
                        }
                        <div onChange={handleStatus.bind(this)}>
                           <div className="form-check form-check-inline">
                              <input className="form-check-input" id = "techer" type="radio" value="techer" name="status"  />
                              <label class="form-check-label" for="techer">techer</label> 
                           </div>
                           <div className="form-check form-check-inline">
                              <input className="form-check-input" id = "student"type="radio" value="student" name="status" /> 
                              <label class="form-check-label" for="student">student</label>
                           </div>
                        </div>

                        <div className="form-signin">
                           <div className="form-label-group">
                              <input type="text" id="inputUsername" className="form-control"
                                 placeholder="Username" required autofocus onChange={handleUsername} />
                              <label for="inputUsername">Username</label>
                           </div>
                           <div class="form-label-group">
                              <input type="password" id="inputPassword" className="form-control"
                                 placeholder="Password  " required onChange={handlePassword} />
                              <label for="inputPassword">Password</label>
                           </div>
                           <div class="form-label-group">
                              <input type="password" id="inputConfirm" className="form-control"
                                 placeholder="confirm Password  " required onChange={handleconfirmPassword} />
                              <label for="inputConfirm">Confirm Password</label>
                           </div>
                           <button className="btn btn-signin btn-secondary" type="submit" onClick={postRegister}>Register </button>

                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div >
   );
}

export default Login;
