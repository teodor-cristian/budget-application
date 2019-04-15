import React, { Component } from 'react';
import 'C:/Users/t-c.solca/AppData/Roaming/npm/node_modules/create-react-app/my-app/client/node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import "./style.css"
import Capability from './Capability';
import axios from 'axios';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';





class ManageCapabilities extends Component{
    constructor(props){
        super(props);
        this.state = {
          open: false,
          capabilities: [],
          openCapability: null
        }

        this.openWall=this.openWall.bind(this);
        // this.openTheCapabilityManagement = this.openTheCapabilityManagement.bind(this);
    }

    openWall(){
      this.setState({ open: !this.state.open })
    }

    openTheCapabilityManagement(capability){

         this.setState({ openCapability: capability});
     }

    componentWillMount(){
      const token='Bearer '+ localStorage.jwtToken;
    
      axios.get('/api/capabilities/get_all_capabilities',{ 'headers': { 'Authorization': token } })
              .then(res => {
                  const capabilities = res.data.capabilities;
                  this.setState({capabilities: capabilities});
                  this.setState({ openCapability: this.state.capabilities[0]})

              })
              .catch(err => {
                  console.log(err.response.data)
              });
    }



    render(){
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={12}>
              <Jumbotron className="jumbotron">
                <h1>Manage Capabilities</h1>
                    {/* <Button bsStyle="primary" bsSize="large" onClick={this.openWall}>
                      Javascript
                    </Button> */}
                    
                    {this.state.capabilities.map(function(capability,index){
                      return(
                        <span key={capability._id}>
                        <Button bsStyle="primary" bsSize="large" className="chooseCapabilityBtn" onClick={this.openTheCapabilityManagement.bind(this, capability)}>
                        {capability.name} 
                        </Button> 
                        </span>
                      )
                    }.bind(this))}
                      <Button bsStyle="primary" bsSize="large" className="addNewCapability">
                       Add a new capability 
                      </Button> 
              </Jumbotron>
              </Col>
              <Col md={12}>
              <div>

              {this.state.openCapability? 

              (
                <div className="item-wrapper">
                <ReactCSSTransitionGroup
                transitionName="fade"
                transitionAppear={true}
                transitionAppearTimeout={600}
                transitionEnterTimeout={600}
                transitionLeaveTimeout={200}>
                
                    
                  <Jumbotron>

                   <Capability capability={this.state.openCapability} />
                  </Jumbotron>

                    
                </ReactCSSTransitionGroup>
                </div>
              )
                
                :
                
                (
                <Row>
                <Col xs={6} xsOffset={5}>
                <div className="load-1">
                <h1>Loading...</h1>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                </div>
                </Col>
                </Row>) 
              }

               
                </div>
              </Col>
            </Row>
          </Grid>
        );
    }
}

export default ManageCapabilities;