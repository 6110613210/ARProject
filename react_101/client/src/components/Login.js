import React, { useState, useContext } from "react";
import Axios from "axios";
import { Redirect } from 'react-router-dom';
import { AuthContext } from "./Auth";
const Login = () => {
    const { currentUser, setCurrentUser, status, setStatus } = useContext(AuthContext);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null);

    Axios.defaults.withCredentials = true;

    const handleUsername = event => {
        setUsername(event.target.value);
    }

    const handlePassword = event => {
        setPassword(event.target.value);
    }


    const postLogin = async() => {
        await Axios.post("http://localhost:3001/login", {
            username: username,
            password: password,
        }).then(async(response) => {

            if (response.data.message) {
                await setError(response.data.message);
            } else {
                await setCurrentUser(response.data.username)
                await setStatus(response.data.status)
            }
        });
    };

    if (!!currentUser && !!status) {
        return ( < Redirect to = "/" / > );
    }
    return ( <
            div className = "login-page" >
            <
            header className = "login-header" >
            <
            h1 > Login < /h1> < /
            header > <
            div className = "container " >
            <
            div className = "row" >
            <
            div className = "col-sm-9 col-md-7 col-lg-5 mx-auto" >
            <
            div className = "card card-signin my-5" >
            <
            div className = "card-body" >
            <
            h5 className = "card-title text-center" > เข้ าสู่ ระบบ < /h5> {
            error &&
            <
            p > { error } < /p>
        } <
        div className = "form-signin" >
        <
        div className = "form-label-group" >
        <
        input type = "text"
    id = "inputUsername"
    className = "form-control"
    placeholder = "Username"
    onChange = { handleUsername }
    /> <
    label
    for = "inputUsername" > Username < /label> < /
    div >

        <
        div class = "form-label-group" >
        <
        input type = "password"
    id = "inputPassword"
    className = "form-control"
    placeholder = "Password  "
    onChange = { handlePassword }
    /> <
    label
    for = "inputPassword" > Password < /label> < /
    div > <
        div id = "register-link" >
        <
        a href = "/register"
    className = "text-info" > Register here < /a> < /
    div > <
        button className = "btn btn-signin btn-secondary"
    type = "submit"
    onClick = { postLogin } > LOG IN < /button> < /
    div > <
        /div> < /
    div > <
        /div> < /
    div > <
        /div> < /
    div >
);
}

export default Login;