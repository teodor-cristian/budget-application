import React,{Component} from 'react';
import { connect } from 'react-redux';
import AutosuggestUsers from './AutosuggestUsers';
import CurrentUsers from './CurrentUsers';
import './style.css'; 

import {Grid, Row, Col } from 'react-bootstrap';


class CapabilityUsers extends Component{

    render(){
        return(
            <Grid>
                <Row>
                    <Col xs={6} md={6} >
                        <AutosuggestUsers />
                    </Col>
                    <Col xs={6} md={6} >
                        <CurrentUsers />
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default CapabilityUsers;