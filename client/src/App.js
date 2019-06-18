import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login'
import Navbar from './components/Navbar';
import Home from './components/Home';
// import {ManageCapabilities as ManageCapabilitiesAdmin} from './UserComponents/ManageCapabilities/index'
import PrivateRoute from './private_routes/PrivateRoute';
import OKR_Management from './ManagementComponents/OKR_Management';
import ManageCapabilities from './UserComponents/ManageCapabilities2';
import ListOfCategories from './UserComponents/ListOfCategories';


var userAuthentificated = false;

if(localStorage.jwtToken) {
  userAuthentificated = true;
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  // store.dispatch(getAllCapabilities());
  //  store.dispatch(getCurrentCategory());
  // store.dispatch(setCurrentCategory());

  axios.defaults.headers.common['Authorization'] = localStorage.jwtToken;

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  }
}



class App extends Component {
  render() {
    return (
      <Provider store = { store }>
        <Router>
            <div>
              <Navbar />     
                <Route exact path="/" component={ Home } />
                <Route exact path="/login" component={ Login } />
                {/* <Route path='/idam-login' component={() => { window.location = 'https://idam-pp.metrosystems.net/web/Signin?state=&scope=openid&locale_id=de-DE&redirect_uri=http://localhost:3000&client_id=Client1&country_code=DE&realm_id=metro&account_id=&user_type=EMP&response_type=token'; return null;} }/> */}
                <Route path='/idam-login' component={() => { window.location = 'https://idam-pp.metrosystems.net/web/Signin?state=&scope=openid&locale_id=de-DE&redirect_uri=http://10.97.182.17:3000&client_id=Client1&country_code=DE&realm_id=metro&account_id=&user_type=EMP&response_type=token'; return null;} }/>
                <PrivateRoute exact path="/okr_management_protected" isAuth={userAuthentificated} route='/okr_management' component={ OKR_Management } />
                <PrivateRoute exact path="/manageCapabilities" isAuth={userAuthentificated} route='/manageCapabilities' component={ ManageCapabilities } />
                <PrivateRoute exact path="/list_of_categories" isAuth={userAuthentificated} route='/list_of_categories' component={ ListOfCategories } />
            </div>
          </Router>
        </Provider>
    );
  }
}

export default App;
