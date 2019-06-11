import React, { Component } from 'react';
import './NavbarStyle.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            location: ""
        }
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    componentWillMount(){
        this.setState({location: this.props.location})

    }

    componentWillReceiveProps (nextProps) {
        this.setState({location: nextProps.location}) ;
  
      }

    render() {
        const {isAuthenticated, user} = this.props.auth;

        const authLinks = (
            <ul className="navbar-nav ml-auto">
                {user.admin? 
                (<span>
                <NavLink  to="/manageCapabilities" className="nav-link" activeClassName="activeLink" pathname={this.state.location}>
                Manage Capabilities
                </NavLink ></span>
                )
                :
                null}
                <NavLink to="/list_of_categories" className="nav-link" activeClassName="activeLink" pathname={this.state.location}>
                List of categories
                </NavLink>
                <NavLink to="/" className="nav-link" onClick={this.onLogout.bind(this)} >
                Logout
                </NavLink>
            </ul>
        )
      const guestLinks = (
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/idam-login">Sign In</Link>
            </li>
        </ul>
      )
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            {isAuthenticated ?
            (
            <Link className="navbar-brand profileSVGLink" to='/list_of_categories' >
             <svg id="profileSVG" role="img" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M32,16A16,16,0,1,0,4.63,27.25h0a16,16,0,0,0,22.76,0h0A15.9,15.9,0,0,0,32,16ZM2,16a14,14,0,1,1,24.51,9.25A39.61,39.61,0,0,0,21.05,23l-1.44-.52v-2a4.87,4.87,0,0,0,1.93-3.82,2.44,2.44,0,0,0,.83-2,2.58,2.58,0,0,0-.63-1.79,8.37,8.37,0,0,0,.44-4.32c-.5-2-3.12-2.71-5.21-2.71-1.78,0-3.93.51-4.85,1.9a2.19,2.19,0,0,0-1.63.68c-1.05,1.14-.57,3.19-.22,4.44a2.56,2.56,0,0,0-.65,1.81,2.44,2.44,0,0,0,.83,2,4.87,4.87,0,0,0,1.93,3.83v2L11.08,23a41,41,0,0,0-5.57,2.31A13.9,13.9,0,0,1,2,16ZM7,26.73a49.21,49.21,0,0,1,4.74-1.89l2-.73a1,1,0,0,0,.65-.94V19.91a1,1,0,0,0-.66-.94c-.05,0-1.3-.54-1.3-3a1,1,0,0,0-.77-1,1.36,1.36,0,0,1,0-.66,1,1,0,0,0,.77-1,3,3,0,0,0-.17-.8c-.61-2.16-.42-2.67-.31-2.79s.17-.08.58,0a1,1,0,0,0,1.17-.74c.14-.58,1.44-1.2,3.27-1.2s3.13.62,3.27,1.2a7.34,7.34,0,0,1-.48,3.46,2.89,2.89,0,0,0-.2.86,1,1,0,0,0,.77,1,1.34,1.34,0,0,1,0,.66,1,1,0,0,0-.77,1c0,2.43-1.24,3-1.27,3a1,1,0,0,0-.68.95v3.26a1,1,0,0,0,.65.94l2.11.77A49.47,49.47,0,0,1,25,26.72a14,14,0,0,1-18,0Z"></path></svg>
             </Link>
             )
            :
            (<svg id="metroSVG" role="img" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M13.4,29,8,12.67V29H0V3H10.8L16,16,21.2,3H32V29H24V12.67L18.64,29Z"></path></svg>)}

              
                {isAuthenticated ? 
                (
                 <h2>{user.full_name}</h2>
                )
                : 
                <h2 className="budgetHeader">etro Systems - Budget Application</h2>}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location:  PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    location: state.location
})

export default connect(mapStateToProps, { logoutUser },null,{pure: false})(withRouter(Navbar));