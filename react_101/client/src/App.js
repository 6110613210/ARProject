import React, { useState, useEffect } from "react";

import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import { AuthProvider } from './components/Auth'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {


  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact  component={Register} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}
export default App;
