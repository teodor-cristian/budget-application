import React, { Component } from 'react';
import "./style.css"
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllCapabilities } from '../../actions/capabilities';

import LoadingAnimation from '../ReusableComponents/LoadingAnimation'
import Category from './Category';
import NoCapabilities from './NoCapabilities';

import {Grid, Row, Col} from 'react-bootstrap';
import LeftNavigation from 'create-react-app/my-app/client/src/UserComponents/ListOfCategories/LeftNavigation';

class ListOfCategories extends Component{

    componentWillMount(){
        this.props.getAllCapabilities();

    }

    render(){

        const {capabilities, error, fetching, fetched}= this.props;

        const capabilitiesExist = (<Row className="show-grid">
        <Col sm={2} md={1} className="leftMenuCol">
            <LeftNavigation {...this.props} />
        </Col>
        <Col sm={10} md={11}   className="rightCol">
            <Category />
        </Col>
        </Row>);

        const capabilitiesRendered = fetching ?
        (<LoadingAnimation />)
        :
        (
            capabilities.length!=0 ?
            capabilitiesExist
            :
            <NoCapabilities />
        )


        return (
            
            <Grid fluid={true}>
            {capabilitiesRendered}            
            </Grid>
        )
    }
}

ListOfCategories.propTypes = {
    getAllCapabilities: PropTypes.func.isRequired,
    capabilities: PropTypes.array.isRequired,
    error: PropTypes.object,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    capabilities: state.capabilities.capabilities,
    error: state.capabilities.error,
    fetching: state.capabilities.fetching,
    fetched: state.capabilities.fetched
})

const mapDispatchToProps = (dispatch) => {
    return {
        getAllCapabilities: () => {
          dispatch(getAllCapabilities())
      }
    }
  }

export default connect(mapStateToProps,mapDispatchToProps, null ,{ pure:false })(ListOfCategories)