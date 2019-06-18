import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUserWithIdam } from '../actions/authentication';
import jwt_decode from 'jwt-decode';

import './HomeStyle.css';


class Home extends Component {

   render(){
      const url =window.location.href;
      const token = url.split("#access_token=");
      console.log(token[1]);
  
      console.log("token 1: ",token[1])
      if(token[1]){
         var decoded = jwt_decode(token[1]);

         this.props.loginUserWithIdam(decoded.email);
          
         setTimeout(function () {
             this.props.history.push('/list_of_categories');
         }.bind(this), 1000);
      }else{
         setTimeout(function () {
            this.props.history.push('/idam-login');
        }.bind(this), 1000);
      }
     
  
     return (
     <div>
      </div>
     )
   }
}


export default connect(null, { loginUserWithIdam })(Home);
