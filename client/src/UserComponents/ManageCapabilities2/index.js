import React,{Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import "./style.css"
import { getAllCapabilities } from '../../actions/capabilities';
import { setCurrentCapability } from '../../actions/currentCapabilityManager';
import Capability from './Capability';
import LoadingAnimation from '../ReusableComponents/LoadingAnimation';

import {Grid, Row, Col, Jumbotron} from 'react-bootstrap';
import {TabGroup} from 'metro-ui-components';


class ManageCapabilities extends Component{

    constructor(props){
        super(props);
        this.state = {
            activeTab: ""
        }

    }

    componentWillMount(){
        this.props.getAllCapabilities();

    }


    render(){
        const {capabilities, error, fetching, fetched, is_set}= this.props;
        
        return(
            <Grid>
                <Row>
                    
                    <Col className="managementTabs">
                    {fetching==true?
                    (<LoadingAnimation />)
                    :
                    null}
                    {
                    fetched? 
                    (<Jumbotron className="jumbotron">
                    <TabGroup activeTab={this.state.activeTab}>
                    {capabilities.map(function(capability,index){
                        return(
                            <button name={capability.name} onClick={()=>{this.setState({activeTab: capability.name}); this.props.setCurrentCapability(capability)}} key={capability._id}>
                            {capability.name}
                            </button>
                        )
                    }.bind(this))}
                    {/* <button name="addExpense">
                    Add a capability
                    </button> */}
                    </TabGroup>
                    </Jumbotron>)
                    :
                    null
                    }
                    </Col>

                    <Col className="capabilityManager">
                    {this.props.is_set?
                    <Capability />
                    : 
                    null}
                    </Col>
                </Row>
            </Grid>
        )
    }
}

ManageCapabilities.propTypes = {
    getAllCapabilities: PropTypes.func.isRequired,
    capabilities: PropTypes.array.isRequired,
    error: PropTypes.object,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    setCurrentCapability: PropTypes.func.isRequired,
    is_set: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    capabilities: state.capabilities.capabilities,
    error: state.capabilities.error,
    fetching: state.capabilities.fetching,
    fetched: state.capabilities.fetched,
    is_set: state.currentCapabilityManager.is_set
})

const mapDispatchToProps = (dispatch) => {
    return {
        getAllCapabilities: () => {
          dispatch(getAllCapabilities())
      },
        setCurrentCapability: (capability) =>{
            dispatch(setCurrentCapability(capability))
        }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps, null ,{ pure:true })(ManageCapabilities);