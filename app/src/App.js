import React from 'react';
import {Switch, Route, Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
// import logo from './logo.svg';
import LoginScreen from './Screens/LoginScreen';
import CreateAccountScreen from './Screens/CreateAccountScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import './App.css';

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={LoginScreen} history={history} />
      </Switch>
      <Switch>
        <Route exact path='/user' component={CreateAccountScreen} history={history} />
      </Switch>
      <Switch>
        <Route exact path='/home' component={HomeScreen} history={history} />
      </Switch>
      <Switch>
        <Route exact path='/profile' component={ProfileScreen} history={history} />
      </Switch>
    </Router>
  );
}

export default App;
