import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUserWithIdam } from '../actions/authentication';
import jwt_decode from 'jwt-decode';

import LoadingAnimation from './../UserComponents/ReusableComponents/LoadingAnimation';


class Home extends Component {

   render(){
      const url =window.location.href;
      const token = url.split("#access_token=");
      var decoded = jwt_decode(token[1]);
      console.log(decoded);
  
      if(decoded){
         this.props.loginUserWithIdam(decoded.email);
          
         setTimeout(function () {
             this.props.history.push('/list_of_categories');
         }.bind(this), 1000);
      }
     
  
     return (
     <div>
        <LoadingAnimation />
        {/* <h1>{decoded.email}</h1> */}
      </div>
     )
   }
}


export default connect(null, { loginUserWithIdam })(Home);
