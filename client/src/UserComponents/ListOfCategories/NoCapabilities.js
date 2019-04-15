import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Jumbotron} from 'react-bootstrap';
import { getAllManagers, sendCapabilityRequest } from './../../actions/allManagers';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class NoCapabilities extends Component{

    constructor(props){
        super(props);
        this.state = {
            managerID: ''
        }

        this.sendRequest = this.sendRequest.bind(this);
    }

    componentWillMount(){
        this.props.getAllManagers();
    }

    componentWillReceiveProps (nextProps) {
        this.setState({managerID: nextProps.allManagers[0]._id}) ;
    }

    sendRequest(){
        this.props.sendCapabilityRequest(this.state.managerID)
        console.log(this.state.managerID)
        NotificationManager.success('Your request has been sent successfully!', 'Successful request!');

    }

    render(){
        // console.log(localStorage.jwtToken)
        return(
          <div className="noCapabilitiesWrapper">
                  <NotificationContainer/>
                <h1>Ooops...it seems like you aren't assigned to any capability</h1>
                <Jumbotron className="requestCapabilityWrapper">
                    <h2>Select your manager</h2>

                    {this.props.allManagers_fetched?
                        (<form>
                        <select 
                        onChange={(e)=>{this.setState({managerID: e.target.value})}} 
                        value={this.state.managerID}
                        className="selectManager">
                        {this.props.allManagers.map(function(manager,index){
                        return(
                        <option key={index} value={manager._id}>{manager.full_name}</option>
                        )
                        })}
                        </select>
                        </form>)
                        :
                        null
                    }
                    
                    <Button className="btn-primary sendRequestBtn" onClick={this.sendRequest}>Send request</Button>

                </Jumbotron>
          </div>  
        )
    }
}

const mapStateToProps = (state) => ({
    allManagers: state.allManagers.allManagers,
    allManagers_fetching: state.allManagers.allManagers_fetching,
    allManagers_fetched: state.allManagers.allManagers_fetched
})

const mapDispatchToProps = (dispatch) => {
    return {
        getAllManagers: () => {
          dispatch(getAllManagers())
      },
      sendCapabilityRequest: (manager_id) => {
          dispatch(sendCapabilityRequest(manager_id))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoCapabilities);
