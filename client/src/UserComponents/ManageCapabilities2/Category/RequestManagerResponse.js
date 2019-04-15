import React,{Component} from 'react';
import { connect } from 'react-redux';

import {Row, Col, Glyphicon} from 'react-bootstrap';

class RequestManagerResponse extends Component{

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    render(){
        const request= this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index];        

        return(
            <div className="relativeContainer">
            <span className="tip tip-down"></span>
            <div className="requestResponse requestResponseDisplay">
                        <Row>
                        <Col md={12}>
                            {request.managerResponse.grantPermission?
                                    (
                                    <Glyphicon glyph="glyphicon glyphicon-ok-circle glyphiconRequest" />
                                    )
                                :null}
                            {request.managerResponse.postponed?
                                    (<span>
                                    <span className="requestDate">
                                    <Glyphicon glyph="glyphicon glyphicon-time glyphiconRequest" />
                                     - {this.parseISOString(request.managerResponse.postponed_date).toDateString() }
                                     </span>
                                    </span>)
                                :null}
                        </Col>
                        <Col md={12}>
                            <p>{request.managerResponse.body}</p>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={12}>
                            <p className="requestDate">{this.parseISOString(request.managerResponse.date).toDateString() }</p>
                        </Col>
                        </Row>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
    current_request_index: state.currentCapabilityManager.current_request_index,
    auth: state.auth.user
})

export default connect(mapStateToProps)(RequestManagerResponse);

