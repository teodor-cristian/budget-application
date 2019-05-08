import React,{Component} from 'react';
import {Row, Col, Glyphicon} from 'react-bootstrap';


class RequestManagerResponse extends Component{

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    render(){
        return(
            <div className="relativeContainer">
            <span className="tip tip-down"></span>
            <div className="requestResponse requestResponseDisplay">
                        <Row>
                        <Col md={12} className="requestResponseTop">
                        <h3>{this.props.request.managerResponse.name} {' '}
                            {this.props.request.managerResponse.grantPermission?
                                    (
                                    <Glyphicon glyph="glyphicon glyphicon-ok-circle glyphiconRequest" />
                                    )
                                :null}
                            {this.props.request.managerResponse.postponed?
                                    (<span>
                                    <span className="requestDate">
                                    <Glyphicon glyph="glyphicon glyphicon-time glyphiconRequest" />
                                     </span>
                                    </span>)
                                :null}
                                </h3>
                        </Col>
                        <Col md={12} className="requestResponseBody">
                            <p>{this.props.request.managerResponse.body}</p>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={12} className="requestResponseBottom">
                            <p className="requestDate">{this.parseISOString(this.props.request.managerResponse.date).toDateString() }</p>
                        </Col>
                        </Row>
                    </div>
                </div>
        )
    }
}


export default RequestManagerResponse;

