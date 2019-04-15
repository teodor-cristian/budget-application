import React, { Component } from 'react';
// import {getAllOkrs} from '../actions/getAndPostOkrs';
import axios from 'axios';
import ThumbnailOkr from './ThumbnailOkr';

import {Grid, Row, Col} from 'react-bootstrap';

import {Sticky, StickyContainer} from 'react-sticky';

// Echivalentul e mai sus
// var Grid = require('react-bootstrap/lib/Grid');
// var Row = require('react-bootstrap/lib/Row');
// var Col = require('react-bootstrap/lib/Col');

class OKR_List extends Component {

    constructor(props) {
        super(props)
         this.state = {
             capabilities: []
         }

    }
    

    componentDidMount() {
        const token='Bearer '+ localStorage.jwtToken;


        axios.get('/api/capabilities/get_all_capabilities',{ 'headers': { 'Authorization': token } })
                .then(res => {
                    const capabilitiess = res.data.capabilities;
                    this.setState({capabilities: capabilitiess});
                })
                .catch(err => {
                    console.log(err.response.data)
                });


    }

    render() {
    

        return (

            <Grid>
            {this.state.capabilities.length?
            null
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
            </Row>
            )
            }
            <Row>
            <Col xs={6} md={12}>
            {(this.state.capabilities).reverse().map(function(capability, index) {
                return (
                    <div key={capability._id}>
                    <StickyContainer>
                    <Sticky>{({ style }) => <h1 className="capabilityHeader" style={style}>{capability.name}</h1>}</Sticky>
                    {capability.categories.map(function(category,indexx){
                        return (
                            <ThumbnailOkr 
                            expenses={capability.list_of_expenses}
                            category={category}
                            capability_id={capability._id}
                            key={category._id} />
                            )
                            })}
                    </StickyContainer>
                    </div>
                    )
                    })}
            </Col>
            </Row>
            </Grid>
        );
    }
}



export  default OKR_List;