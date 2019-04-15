import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {addManagerResponse} from '../../actions/capabilityManagement';
import classnames from 'classnames';

import {Grid, Row, Col, Checkbox, Alert, Glyphicon} from 'react-bootstrap';

var Button = require('react-bootstrap/lib/Button');
var Form = require('react-bootstrap/lib/Form');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');



class Comments extends Component{
    constructor(props, context) {
        super(props, context);
    
        const {user} = this.props.auth;

        this.state = {
            isPosted: false,
            managerResponse: "",
            currentDate: null,
            grantPermission: false,
            style: null,
            userManager: user,
            comment: null,
            emptyManagerResponse: false
        }


        this.postReplyComment = this.postReplyComment.bind(this);
      }

      parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

      changePermission(){
          this.setState({grantPermission: !this.state.grantPermission,style: "success"});
          if(this.state.grantPermission){
              this.setState({style: null});
          }
      }

      postReplyComment(e){
          e.preventDefault();
          let currentDate=new Date();

          if(this.state.managerResponse)
          {let managerResponse={
              name: this.state.userManager.full_name,
              body: this.state.managerResponse,
              grantPermission: this.state.grantPermission,
              date: currentDate.toISOString()
          }

          addManagerResponse(this.props._id_capabilitate,this.props._id_categorie ,this.props.comment._id_comment, this.state.comment.name,managerResponse,this.state.userManager.full_name);
          this.props.addManagerResponse(this.props.index_categorie,this.props.index_comentariu,managerResponse)

          this.state.comment.managerResponse = managerResponse;
          this.setState({isPosted: true, comment: this.state.comment});}
          else{
              this.setState({emptyManagerResponse: true});
          }

      }

      componentWillMount(){
          this.setState({comment: this.props.comment})

          if(this.props.comment.managerResponse){
              this.setState({isPosted: true});
          }
      }


    render(){
        return(
            <div>
            <div className="pointer"></div>
            <div className='comment-node' >
            <div className='print-author'>
                <h3>{this.state.comment.name}  {this.state.comment.messageRead}</h3> 
            </div> 
            <p>{this.state.comment.body}</p>
            <p className="comment-date">
            {this.parseISOString(this.state.comment.date).toDateString()}
            </p>
        </div>
        <div className="pointer-reply"></div>
            <div className='comment-node reply' >
            <div className='print-author'>
                 
            </div> 
            {!this.state.isPosted?
            (<Form 
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
                {this.state.emptyManagerResponse && (<p id="emptyManagerResponse">The comment field is empty</p>)}
                <Alert bsStyle={this.state.style} className="grantPermission">
                <FormGroup>
                <Checkbox onChange={this.changePermission.bind(this)} inline>Grant <strong>{this.state.comment.name}</strong> the permission to add his request as an expense</Checkbox>
                </FormGroup>
                </Alert>
                </Col>
                <Col xs={6} md={1} className="reply-btn">
                <Button type="submit" bsStyle="primary" bsSize="large" className="postResponseManager" >Post</Button>
                </Col>
                </Row>
                </Grid>
                </FormGroup>
                </Form>)
            :
            (<div className='comment-node'>
                <div className='print-author'>
                <h3>{this.state.comment.managerResponse.name}{' '}
                {this.state.comment.managerResponse.grantPermission?
                (
                    <Glyphicon glyph="glyphicon glyphicon-ok-circle" />
                ):null}
                </h3> 
                </div> 
                <p>{this.state.comment.managerResponse.body}</p>
                <p className="comment-date">
                {this.parseISOString(this.state.comment.managerResponse.date).toDateString()
                }
                </p>
            </div>)
            }
            
        </div>
        </div>
        )
    }
}

// export default Comments;

Comments.propTypes = {
    auth: PropTypes.object
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  })
  
  export default connect(mapStateToProps)(withRouter(Comments));