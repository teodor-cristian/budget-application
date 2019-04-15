import React, { Component } from 'react';
import "./style.css"

import {Grid, Row, Col} from 'react-bootstrap';


class LoadingAnimation extends React.Component {
    render() {
      return (
        <Row>
            <Col md={6} mdOffset={5}>
            <div className="load-1">
            <h1>Loading...</h1>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            </div>
            </Col>
        </Row>
      );
    }
  }

export default LoadingAnimation;