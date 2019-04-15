import React,{Component} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {postRequestManagerResponse} from '../../../actions/currentCapabilityManager';
import {Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import {ToggleButton, Button} from 'metro-ui-components';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';


class AddRequestManagerResponse extends Component{
    constructor() {
        super();
        this.state = {
            managerResponse: "",
            grantPermissionToAddExpense: false,
            delayPermissionToAddExpense: false,
            selectedDay: new Date(),
            emptyManagerResponse: false
        };

        this.postManagerRequestResponse = this.postManagerRequestResponse.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
      }

    changePermission(){
        this.setState({grantPermissionToAddExpense: !this.state.grantPermissionToAddExpense})     
    }

    changePermissionDelay(){
        this.setState({delayPermissionToAddExpense: !this.state.delayPermissionToAddExpense})        
    }

    handleDayChange(day) {
        this.setState({ selectedDay: day });
    }

    postManagerRequestResponse(){

        let currentDate=new Date()

        if(this.state.managerResponse)
        {
            let managerResponse={
            name: this.props.auth.full_name,
            body: this.state.managerResponse,
            grantPermission: this.state.grantPermissionToAddExpense,
            postponed: this.state.delayPermissionToAddExpense,
            postponed_date: this.state.selectedDay.toISOString(),
            date:  currentDate.toISOString()
              }

        let _id_capabilitate = this.props.current_capability._id;
        let _id_categorie = this.props.current_capability.categories[this.props.current_category_index]._id;
        let _id_request = this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index]._id;
        let userName = this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index].authorName;
      //   console.log(userName);
        this.props.postRequestManagerResponse(managerResponse, _id_capabilitate, _id_categorie, _id_request, userName)

        }
        else{
            this.setState({emptyManagerResponse: true});
        }
    }

    render(){
        return(
            <div className="relativeContainer">
            <span className="tip tip-down"></span>
            <div className="requestResponse">
                        <Row>
                        <Col md={12}>
                            <FormControl 
                            componentClass="textarea" 
                            placeholder="Add your comment here ..." 
                            value={this.state.managerResponse} 
                            className="textareaResponseManager"
                            onChange={(e)=>{this.setState({managerResponse: e.target.value})}}
                            className={classnames({
                                'is-invalid': this.state.emptyManagerResponse
                            })}
                            />
                        </Col>
                        {this.state.emptyManagerResponse && (<Col md={12}><p id="emptyManagerResponse">The comment field is empty</p></Col>)}

                        </Row>

            <Row>
            <FormGroup className="formGroupModalRequest">
                    <Col xs={5} md={5}>
                    <ToggleButton
                    value={this.state.grantPermissionToAddExpense}
                    label="Grant the permission to add his request as an expense"
                    name="the-name"
                    onChange={this.changePermission.bind(this)} 
                    errorMessage=""
                    />
                    </Col> 

                    <Col xs={4} md={4}>
                    <ToggleButton
                    value={this.state.delayPermissionToAddExpense}
                    label="Delay the request"
                    name="the-name"
                    onChange={this.changePermissionDelay.bind(this)} 
                    errorMessage=""
                    />
                    </Col>
                    {this.state.delayPermissionToAddExpense? 
                    (
                    <Col xs={2} md={2}>
                    <div>
                    {this.state.selectedDay && <p>Delay date: {this.state.selectedDay.toLocaleDateString()}</p>}
                    {!this.state.selectedDay && <p>Choose a date for delay</p>}

                    </div>
                    <DayPickerInput onDayChange={this.handleDayChange} />
                    </Col>
                    ):
                    null}
                    

            </FormGroup>
            <Button className="postManagerRequestResponse" onClick={this.postManagerRequestResponse}>Post</Button>
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

export default connect(mapStateToProps, {postRequestManagerResponse})(AddRequestManagerResponse);


