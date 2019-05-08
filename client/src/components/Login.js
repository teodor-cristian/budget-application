import React, { Component } from 'react';
import './LoginStyle.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import classnames from 'classnames';
// import Home from 'create-react-app/my-app/client/src/components/Home';

// ***
// Importing individual components from react-bootstrap
// ***
var Form = require('react-bootstrap/lib/Form');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var Col = require('react-bootstrap/lib/Col');
var Button = require('react-bootstrap/lib/Button');
var FormControl = require('react-bootstrap/lib/FormControl');
// ***

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
        
        setTimeout(function () {
            this.props.history.push('/list_of_categories');
        }.bind(this), 1000);
        
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/okr_list_protected');
        }
    }

    render() {
        const {errors} = this.state;

        return (
            <div className="container">
            <h1 id="loginHeader">Login</h1>
            <div className="row form-container">
            <Form horizontal onSubmit={ this.handleSubmit} className="loginForm">
        <FormGroup controlId="formHorizontalEmail">
          <Col sm={12}>
            <FormControl 
            type="email" 
            placeholder="Email"
            name="email"
            className={classnames('form-control form-control-lg', {
                'is-invalid': errors.email
            })}
            onChange={ this.handleInputChange }
            value={ this.state.email } />
            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
          </Col>
        </FormGroup>
      
        <FormGroup controlId="formHorizontalPassword">
          <Col sm={12}>
            <FormControl 
            type="password" 
            placeholder="Password"
            name="password"
            className={classnames('form-control form-control-lg', {
                'is-invalid': errors.password
            })} 
            onChange={ this.handleInputChange }
            value={ this.state.password } />
            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
          </Col>
        </FormGroup>
      
        <FormGroup > 
          <Col  sm={12} className="signInDiv">
            <Button 
            type="submit"  id="signInBtn">
            Sign in</Button>
          </Col>
        </FormGroup>
      </Form>
      </div>
      </div>)
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)