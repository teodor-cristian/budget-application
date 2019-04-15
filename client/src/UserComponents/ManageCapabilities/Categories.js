import React, {Component} from 'react';
import axios from 'axios';
import Comments from './Comments';
import {markAllCommentsAsRead, changeCategoryBudget} from '../../actions/capabilityManagement';
import classnames from 'classnames';


import Table from 'react-bootstrap/lib/Table';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Badge from 'react-bootstrap/lib/Badge';
import Well from 'react-bootstrap/lib/Well';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import 'react-input-range/lib/css/index.css'




class Categories extends Component{

    constructor(props){
        super(props);
        this.state = {
            categories: [],
            showModal: false,
            commentsModal: {showCommentModal: false, comments: [], categoryName: ""},
            value: 100,
            newCategoryName: "",
            newCategoryDescription: "",
            changeBudgetModal: false,
            categoryForModifyBudget: { category: {}, index: 0},
            newBudget: 0,
            emptyNewCategoryName: false,
            emptyNewCategoryDescription: false,
            emptyNewCategoryBudget: false
        }

        this.parseISOString=this.parseISOString.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleHideChangeBudget = this.handleHideChangeBudget.bind(this);
        this.addManagerResponse =this.addManagerResponse.bind(this);
        this.changeBudget = this.changeBudget.bind(this);
        this.changeBudgetOpenModal = this.changeBudgetOpenModal.bind(this);
    }

    handleHide() {

        for(let i=0;i<this.state.commentsModal.comments.length;i++){
            this.state.commentsModal.comments[i].messageRead=true;
        }
        markAllCommentsAsRead(this.props._id_capabilitate,this.state.commentsModal._id_category);

        this.setState({ showModal: false, value: 100, commentsModal: {showCommentModal: false, comments: []} });
      }

    handleHideChangeBudget(){
        this.setState({changeBudgetModal: false, categoryForModifyBudget: {category: {}, index: 0}});
    }

    changeBudgetOpenModal(category,index){
        this.setState({changeBudgetModal: true, categoryForModifyBudget: {category: category, index: index}});
        console.log(category) 
    }

    changeBudget(e){
        e.preventDefault();
        let index= this.state.categoryForModifyBudget.index;
        changeCategoryBudget(this.props._id_capabilitate,this.state.categoryForModifyBudget.category._id,this.state.newBudget);
        this.props.changeBudgetForCategory(index,this.state.newBudget);
        this.handleHideChangeBudget();
    }


    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }



    addManagerResponse(index_categorie, index_comentariu, managerResponse){
        this.state.categories[index_categorie].comments[index_comentariu].managerResponse=managerResponse;
        this.setState(this.state);
    }

    getNoUnreadComments(category){
        var total=0;
        for(let i=0;i<category.comments.length;i++){
            if(!category.comments[i].messageRead)
            total++;
        }
        return total;
    }

    componentWillMount(){
        this.setState({categories: this.props.categories});
        

    }

    componentWillReceiveProps (nextProps) {
        this.setState({categories: nextProps.categories}) ;
    }

    render() {
        
        return(
            <div>
            <Table responsive>
            <thead>
            <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Sum</th>
            <th>{' '}</th>
            <th>Date</th>
            <th>Comments</th>
            </tr>
            </thead>
        <tbody>

        {this.state.categories.map(function(category,index){
                 return (
                    <tr key={category._id}>
                    <td>{index+1}</td>
                    <td>{category.name}</td>
                    <td className="categoryDescription">{category.description}</td>
                    <td>{category.budget}€</td>
                    <td><Button bsStyle="primary" onClick={this.changeBudgetOpenModal.bind(this,category,index)}>Change category budget</Button></td>
                    <td>{this.parseISOString(category.date).toDateString()}</td>
                    <td>
                        <button 
                            className="commentsBtn"
                            onClick={()=>{console.log(category.comments);this.setState({commentsModal: {showCommentModal: true, comments:category.comments.reverse(), categoryName: category.name, _id_category: category._id, index_categorie: index}})}}>  
                            Show comments <Badge>{category.comments.length}
                            </Badge>
                        </button>
                        {this.getNoUnreadComments(category)?
                        (
                        // {this.getNoUnreadComments(category)} new {' '} 
                        <svg role="img" viewBox="0 0 32 32" className="newCommentsSVG" aria-hidden="true" focusable="false" ><path d="M32,1V12.74a1,1,0,0,1-1,1H26.81l-5.58,5A1,1,0,0,1,19.57,18V13.74h-1a1,1,0,0,1,0-2h2a1,1,0,0,1,1,1v3L25.77,12a1,1,0,0,1,.66-.25H30V2H12.43V6.22a1,1,0,0,1-2,0V1a1,1,0,0,1,1-1H31A1,1,0,0,1,32,1ZM21.57,27.74V31a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V27.74c0-.41,0-1.65,7.17-4.59V21.74A4.37,4.37,0,0,1,5.9,18.69a2.31,2.31,0,0,1-1-2A2.63,2.63,0,0,1,5.3,15.2a2,2,0,0,1,.29-.34c-.43-1-.89-2.3-.17-3.2A1.75,1.75,0,0,1,6.81,11c.75-1.17,2.4-1.9,4.48-1.9h0c2.53,0,4.43,1.06,4.84,2.71a5,5,0,0,1-.3,3,2.34,2.34,0,0,1,.57,1.62,2.79,2.79,0,0,1-.83,2.09,4.53,4.53,0,0,1-1.18,3.13v1.43C21.57,26.09,21.57,27.33,21.57,27.74Zm-2,.29A32.81,32.81,0,0,0,13,24.75a1,1,0,0,1-.63-.93V21.22c0-.48.17-.84.64-.93,0,0,.56-.49.56-2.33a1,1,0,0,1,.72-1,1.4,1.4,0,0,0,.08-.67,1,1,0,0,1-.81-1,2,2,0,0,1,.23-.81,3.57,3.57,0,0,0,.39-2.21c-.17-.68-1.42-1.2-2.9-1.2h0c-1.48,0-2.73.52-2.9,1.2a1,1,0,0,1-1.17.74l-.16,0a8.34,8.34,0,0,0,.5,1.34,2.38,2.38,0,0,1,.3,1,1,1,0,0,1-.92,1,.9.9,0,0,0,0,.61,1,1,0,0,1,.92,1c0,1.94.69,2.34.7,2.34a.91.91,0,0,1,.6.92v2.61a1,1,0,0,1-.63.93A32.81,32.81,0,0,0,2,28v2H19.57ZM17.32,7.79A1.32,1.32,0,1,0,16,6.47,1.32,1.32,0,0,0,17.32,7.79Zm4.95-1.32a1.32,1.32,0,1,0-1.32,1.32A1.32,1.32,0,0,0,22.26,6.47Zm3.91,0a1.32,1.32,0,1,0-1.32,1.32A1.32,1.32,0,0,0,26.18,6.47Z"></path></svg>
                        )
                        : 
                        null}
                    </td>

                    
                    </tr>
                    
                )
                }.bind(this))}

                
                <tr>
                    <td colSpan="7" className="addNewExpense"><button onClick={() => this.setState({ showModal: true })}><strong>Add a new category</strong></button></td>
                </tr>
               
        </tbody>
</Table>

  <div className="modal-container" >

  <Modal    
        animation={false}
        bsSize="large"
        show={this.state.showModal}
        onHide={this.handleHide}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header >
          <Modal.Title id="contained-modal-title">
              Add a new category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form 
           onSubmit={(this.props.postCategory).bind(this)}
          >
          <ControlLabel>Name</ControlLabel>
          <FormControl
          id="formControlsText"
          type="text"
          label="Text"
          placeholder="Name"
          value={this.state.newCategoryName} 
          onChange={(e)=>{this.setState({newCategoryName: e.target.value})}}
          className={classnames({
            'is-invalid': this.state.emptyNewCategoryName
          })}
          />
          {this.state.emptyNewCategoryName && (<div><ControlLabel id="emptyManagerResponse">The name field is empty</ControlLabel></div>)}
          <ControlLabel>Description</ControlLabel>
          <FormControl
          id="formControlsEmail"
          type="textarea"
          componentClass="textarea"
          label="Description"
          placeholder="Description"
          value={this.state.newCategoryDescription} 
          onChange={(e)=>{this.setState({newCategoryDescription: e.target.value})}}
          className={classnames({
            'is-invalid': this.state.emptyNewCategoryDescription
          })}
          />
          {this.state.emptyNewCategoryDescription && (<div><ControlLabel id="emptyManagerResponse">The description field is empty</ControlLabel></div>)}
          <ControlLabel>Budget</ControlLabel>
          <FormControl
          id="formControlsText"
          type="number"
          label="number"
          placeholder="Budget"
          value={this.state.value} 
          onChange={(e)=>{this.setState({value: Number(e.target.value)})}}
          className={classnames({
            'is-invalid': this.state.emptyNewCategoryBudget
          })}
          />
          {this.state.emptyNewCategoryBudget && (<div><ControlLabel id="emptyManagerResponse">The budget field cannot be 0</ControlLabel></div>)}
          <Button bsStyle="primary" bsSize="large" type="submit" className="addExpenseButton">Post</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
  </div>

    <div className="modal-container" >

<Modal    
      animation={false}
      bsSize="large"
      show={this.state.commentsModal.showCommentModal}
      onHide={this.handleHide}
      container={this}
      aria-labelledby="contained-modal-title"
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title">
            {this.state.commentsModal.categoryName} - Comments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.state.commentsModal.comments.length?
        (
        <Well>
        {
            this.state.commentsModal.comments.map(function(comment,index){
                return(
                    <div key={comment._id}>
                    <Comments _id_capabilitate={this.props._id_capabilitate} _id_categorie={this.state.commentsModal._id_category} index_categorie={this.state.commentsModal.index_categorie} index_comentariu={index} addManagerResponse={this.addManagerResponse} comment={{_id_comment: comment._id,name: comment.name, body: comment.body, date: comment.date, managerResponse: comment.managerResponse, messageRead: comment.messageRead}} />
                    </div>
                )

        }.bind(this))
        }
        </Well>
        )
         :
        (<h3 className="noComments">No comments yet</h3>)}
      </Modal.Body>
      <Modal.Footer>
        <Button 
        onClick={this.handleHide}
        >Close</Button>
      </Modal.Footer>
    </Modal>
</div>

        {/* Change the budget ********************************/}
<div className="modal-container" >

<Modal    
      animation={false}
      bsSize="large"
      show={this.state.changeBudgetModal}
      onHide={this.handleHideChangeBudget}
      container={this}
      aria-labelledby="contained-modal-title"
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title">

            {this.state.categoryForModifyBudget.category.name} - Change the budget
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form 
           onSubmit={this.changeBudget}
          >
          <ControlLabel>Current budget: {this.state.categoryForModifyBudget.category.budget}€</ControlLabel>
          <br />
          <ControlLabel>New budget</ControlLabel>
          <FormControl
          id="formControlsNumber"
          type="number"
          label="Number"
          placeholder="New budget"
          value={this.state.newBudget} 
          onChange={(e)=>{this.setState({newBudget: e.target.value})}}
          />
          
          <Button bsStyle="primary" bsSize="large" type="submit" className="addExpenseButton">Post</Button>
          </form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
        onClick={this.handleHideChangeBudget}
        >Close</Button>
      </Modal.Footer>
    </Modal>
</div>

</div>
        )
    }
}

export default Categories;