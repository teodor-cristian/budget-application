import React,{Component} from 'react';
import { connect } from 'react-redux';
import {postRequestManagerResponse} from '../../../actions/currentCapabilityManager';
import AddRequestManagerResponse from './AddRequestManagerResponse';
import RequestManagerResponse from './RequestManagerResponse';
import {Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import {ToggleButton, Button} from 'metro-ui-components';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';



class RequestModal extends Component{

    constructor() {
        super();
        this.state = {
            updated: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index].managerResponse !== prevProps.current_capability.categories[prevProps.current_category_index].requests[prevProps.current_request_index].managerResponse) 
        {
            this.setState({updated: true});
        }
        
      }

    render(){
        const request= this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index];        

        return(
            <span>
            <div className="requestTumblr">
            <Grid className="requestContainer requestContainerModal" fluid={true}>
            <Row>
            <Col xs={6} md={1} className="requestSvg">

            <svg role="img" viewBox="0 0 32 32" fill="#0064fe" aria-hidden="true" focusable="false"><path d="m31.9699867 25.012c.132.536-.196 1.078-.732 1.209-.535.136-1.078-.196-1.209-.733l-.427-1.738h-7.938l-1.436 5.502c-.117.45-.523.748-.967.748-.084 0-.169-.011-.253-.032-.535-.14-.855-.686-.715-1.22l.651-2.498h-16.03600004l-.954 3.049c-.134.428-.529.701-.954.701-.099 0-.2-.015-.299-.046-.527-.165-.82-.725-.655-1.253l7.826-25c.133-.428.527-.688.954-.687v-.014h16.95600004.007c.458.003.855.317.964.762zm-28.43600004-.762h15.93200004l5.022-19.25h-14.92800004zm18.65100004-2.5h6.926l-3.358-13.676zm-4.698-.25c0 .553-.447 1-1 1h-9.00400004c-.553 0-1-.447-1-1s.447-1 1-1h9.00400004c.553 0 1 .447 1 1zm4.078-13.75c0 .553-.447 1-1 1h-9.004c-.553 0-1-.447-1-1s.447-1 1-1h9.004c.553 0 1 .447 1 1zm-1.799 2.126c.313 0 .608.146.797.395.189.25.25.573.166.875l-2.108 7.533c-.121.431-.515.73-.963.73h-9.13000004c-.316 0-.614-.149-.803-.404-.188-.254-.246-.582-.154-.885l2.277-7.533c.127-.422.51700004-.711.95700004-.711zm-2.867 7.533 1.549-5.533h-6.9l-1.67300004 5.533z"></path></svg>
            </Col>
            <Col xs={6} md={11}>
            <span>
                {request.body}  
            </span>
            </Col>
            </Row>

            <Row>
                <Col md={1}>
                </Col>
                <Col md={6} className="tagsContainer">
                <span >
                <svg role="img" viewBox="0 0 16 16" className="m-icon" id="tagSvg"  fill="#0064fe" aria-hidden="true" focusable="false"><path d="m15.773244 9.75173858-6.02150542 6.02150542c-.30234138.3023413-.79253363.3023413-1.09487501 0l-8.43010753-8.43010757c-.14518945-.14518945-.22675604-.34210861-.22675604-.54743751v-6.02150537c0-.42757529.34661826-.77419355.77419355-.77419355h6.02150537c.2053289 0 .40224806.08156659.54743751.22675604l8.43010757 8.43010753c.3023413.30234138.3023413.79253363 0 1.09487501zm-1.6423126-.5474375-7.65591394-7.65591398h-4.92663036v4.92663036l7.65591398 7.65591394zm-9.14168409-2.40860216c-.99716129 0-1.80645161-.80929032-1.80645161-1.80645161 0-.99625806.80929032-1.80645161 1.80645161-1.80645161.99806452 0 1.80645161.81019355 1.80645161 1.80645161 0 .99716129-.80838709 1.80645161-1.80645161 1.80645161z"></path></svg>
                <span id="tags">
                {request.hashtags.map(function(hashtag,index){
                    return( "#"+ hashtag + " " );
                })}
                </span>
                </span>
                </Col>
                <Col md={5} className="userRequestContainer">
                <span>
                <svg id="svgUserRequest" role="img" viewBox="0 0 32 32"  fill="#0064fe" aria-hidden="true" focusable="false"><path d="M32,16A16,16,0,1,0,4.63,27.25h0a16,16,0,0,0,22.76,0h0A15.9,15.9,0,0,0,32,16ZM2,16a14,14,0,1,1,24.51,9.25A39.61,39.61,0,0,0,21.05,23l-1.44-.52v-2a4.87,4.87,0,0,0,1.93-3.82,2.44,2.44,0,0,0,.83-2,2.58,2.58,0,0,0-.63-1.79,8.37,8.37,0,0,0,.44-4.32c-.5-2-3.12-2.71-5.21-2.71-1.78,0-3.93.51-4.85,1.9a2.19,2.19,0,0,0-1.63.68c-1.05,1.14-.57,3.19-.22,4.44a2.56,2.56,0,0,0-.65,1.81,2.44,2.44,0,0,0,.83,2,4.87,4.87,0,0,0,1.93,3.83v2L11.08,23a41,41,0,0,0-5.57,2.31A13.9,13.9,0,0,1,2,16ZM7,26.73a49.21,49.21,0,0,1,4.74-1.89l2-.73a1,1,0,0,0,.65-.94V19.91a1,1,0,0,0-.66-.94c-.05,0-1.3-.54-1.3-3a1,1,0,0,0-.77-1,1.36,1.36,0,0,1,0-.66,1,1,0,0,0,.77-1,3,3,0,0,0-.17-.8c-.61-2.16-.42-2.67-.31-2.79s.17-.08.58,0a1,1,0,0,0,1.17-.74c.14-.58,1.44-1.2,3.27-1.2s3.13.62,3.27,1.2a7.34,7.34,0,0,1-.48,3.46,2.89,2.89,0,0,0-.2.86,1,1,0,0,0,.77,1,1.34,1.34,0,0,1,0,.66,1,1,0,0,0-.77,1c0,2.43-1.24,3-1.27,3a1,1,0,0,0-.68.95v3.26a1,1,0,0,0,.65.94l2.11.77A49.47,49.47,0,0,1,25,26.72a14,14,0,0,1-18,0Z"></path></svg>
                <span>{request.authorName}</span>
                </span>
                </Col>
            </Row>
            </Grid>
            </div>

           {!this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index].managerResponse? 
            <AddRequestManagerResponse />
            :
            <RequestManagerResponse />
        }


            {/* {this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index].managerResponse ?
            <RequestManagerResponse />
            :
            null} */}

            </span>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
    current_request_index: state.currentCapabilityManager.current_request_index,
    auth: state.auth.user
})

export default connect(mapStateToProps, {postRequestManagerResponse})(RequestModal);


