import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signup from './Pages/Login/signup';
import Login from './Pages/Login/login';
import Homepage from './Pages/Homepage/homepage';
import Admin from './Pages/Admin/admin';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
          <Switch>
            <Route exact path='/' component={Login} ></Route>
            <Route path='/home' component={Homepage} ></Route>
            <Route path='/signup' component={Signup}></Route>
            <Route path='/admin' component={Admin}></Route>
          </Switch>
        </div>
      </Router>

    </div>
  );
}

export default App;
