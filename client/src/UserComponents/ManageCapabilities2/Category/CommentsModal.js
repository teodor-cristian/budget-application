import React,{Component} from 'react';
import { connect } from 'react-redux';
import RequestModal from './RequestModal';
import CommentNode from './CommentNode';
import AddManagerResponse from './AddCommentManagerResponse';
import CustomScroll from 'react-custom-scroll';
import './../../../../node_modules/react-custom-scroll/dist/customScroll.css';
import {Modal, Button, Form, FormGroup, Grid, Row, Col, FormControl, Checkbox} from 'react-bootstrap';
import {ScrollPositionProvider, ScrollableContainer, Separator, ToggleButton} from 'metro-ui-components';
class CommentsModal extends Component{

    
    constructor() {
        super();
        this.state = {
            managerResponse: "",
            grantPermissionToAddExpense: false
        };
        this.postReplyComment = this.postReplyComment.bind(this);

        }

    postReplyComment(e){
        e.preventDefault();
        console.log(this.state.managerResponse);
    }

    changePermission(){
        this.setState({grantPermissionToAddExpense: !this.state.grantPermissionToAddExpense})
    }

    

    render(){
        const request= this.props.current_capability.categories[this.props.current_category_index].requests[this.props.current_request_index];        

       

        return(
        <Modal
        // {...this.props}
        show={this.props.show}
        onHide={this.props.onHide}
        animation={false}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <div className="modalContainer">
        {/* <ScrollPositionProvider> */}
        <CustomScroll flex="1">


          <RequestModal />
          <Separator> - </Separator>

         {request.comments.map(function(comment,index){
             return (<span  key={index}>
             <CommentNode comment={comment} />
             {!comment.managerResponse?
                (
                    <AddManagerResponse _id_comment={comment._id} index_comment={index} />
                )
                :
                null
                }
            </span>
             )
         }.bind(this))}

        </CustomScroll>
          {/* </ScrollPositionProvider> */}

          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
    current_request_index: state.currentCapabilityManager.current_request_index
})

export default connect(mapStateToProps)(CommentsModal);