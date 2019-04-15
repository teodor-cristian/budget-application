import React,{Component} from 'react';
import { connect } from 'react-redux';
import {postManagerResponse} from 'create-react-app/my-app/client/src/actions/currentCapabilityManager';
import classnames from 'classnames';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import {Modal, Button, Form, FormGroup, Grid, Row, Col, FormControl, Checkbox} from 'react-bootstrap';
import {ScrollPositionProvider, ScrollableContainer, Separator, ToggleButton} from 'metro-ui-components';

class AddManagerResponse extends Component{

    constructor() {
        super();
        this.state = {
            managerResponse: "",
            grantPermissionToAddExpense: false,
            delayPermissionToAddExpense: false,
            selectedDay: new Date(),
            emptyManagerResponse: false
        };
        this.postReplyComment = this.postReplyComment.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
      }

    postReplyComment(e){
        e.preventDefault();
        console.log(this.state.managerResponse);

        let currentDate=new Date();

        
          if(this.state.managerResponse)
          {
              let managerResponse={
              name: this.props.auth.full_name,
              body: this.state.managerResponse,
              grantPermission: this.state.grantPermissionToAddExpense,
              postponed: this.state.delayPermissionToAddExpense,
              postponed_date: this.state.selectedDay.toISOString(),
              date: currentDate.toISOString()
                }

          let _id_capabilitate = this.props.current_capability._id;
          let _id_categorie = this.props.current_capability.categories[this.props.current_category_index]._id;
          let _id_request = this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index]._id;
          let _id_comment = this.props._id_comment;
          let index_comment = this.props.index_comment;
          let userName = this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index].comments[this.props.index_comment].name;
        //   console.log(userName);
          this.props.postManagerResponse(managerResponse, _id_capabilitate, _id_categorie, _id_request, _id_comment, index_comment, userName)

          }
          else{
              this.setState({emptyManagerResponse: true});
          }
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

    render(){
        return(
            <div className="commentDiv">
                    <div className="pointer-reply"></div>
                    <div className='comment-node reply' >
                    <div className='print-author'>
                         
                    </div> 
                <Form 
                    onSubmit={(this.postReplyComment).bind(this)}
                    >
                    <FormGroup controlId="formControlsTextarea">
                    <Grid >
                      <Row>
                        <Col xs={6} md={11}>
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

                    <Col xs={6} md={1} className="reply-btn">
                    <Button type="submit" bsStyle="primary" bsSize="large" className="postResponseManager" >Post</Button>
                    </Col>
                    </Row>

                    <Row>
                    {this.state.emptyManagerResponse && (<Col md={12}><p id="emptyManagerResponse">The comment field is empty</p></Col>)}
                    <FormGroup>
                    <Col xs={6} md={6}>
                    <ToggleButton
                    value={this.state.grantPermissionToAddExpense}
                    label="Grant the permission to add his request as an expense"
                    name="the-name"
                    onChange={this.changePermission.bind(this)} 
                    errorMessage=""
                    />
                    </Col> 

                    <Col xs={6} md={6}>
                    <ToggleButton
                    value={this.state.delayPermissionToAddExpense}
                    label="Delay the request"
                    name="the-name"
                    onChange={this.changePermissionDelay.bind(this)} 
                    errorMessage=""
                    />
                    </Col>


                    </FormGroup>

                    {this.state.delayPermissionToAddExpense? 
                    (
                    <Col xs={2} md={2} className="datePickerColumn">
                    <div>
                    {this.state.selectedDay && <p id="datePickerLabel">Delay date: {this.state.selectedDay.toLocaleDateString()}</p>}
                    {!this.state.selectedDay && <p id="datePickerLabel">Choose a date for delay</p>}

                    </div>
                    <DayPickerInput onDayChange={this.handleDayChange} keepFocus={true} showOverlay={true} />
                    </Col>
                    ):
                    null}
                    </Row>

                    </Grid>
                    </FormGroup>
                    </Form>
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


export default connect(mapStateToProps, {postManagerResponse})(AddManagerResponse);