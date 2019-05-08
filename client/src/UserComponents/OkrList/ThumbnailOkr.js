import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Comment from './Comment'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {addComment} from '../../actions/postComment';
import {addUserExpense} from '../../actions/capabilityManagement';
import 'react-notifications/lib/notifications.css';
import classnames from 'classnames';




import "./style.css"
// jquery is required for bootstrap
import  'jquery'
import 'popper.js'
// bootstrap
import 'bootstrap'
// bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
// import {Button as ButtonM} from 'metro-ui-components/lib/react/Button';
import {Grid, Row, Col, Table, ControlLabel} from 'react-bootstrap';

var Thumbnail = require('react-bootstrap/lib/Thumbnail')
var Button = require('react-bootstrap/lib/Button');
var Well = require('react-bootstrap/lib/Well');
var Form = require('react-bootstrap/lib/Form');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');


class ThumbnailOkr extends Component{
    constructor(props, context) {
        super(props, context);
    
        const {user} = this.props.auth;

        this.state = {
          open: false,
          openModalExpenses: false,
          openModalAddExpenses: false,
          commentBody: "",
          user: user,
          expenses: [],
          addExpenseBtn: false,
          newExpenseName: "",
          newExpenseDescription: "",
          newExpenseSum: 0,
          empty: false,
          emptyExpenseName:false,
          emptyExpenseDescription:false,
          emptyExpenseSum:false
        };
      }

      onCommentBodyChange(e) {
        this.setState({commentBody: e.target.value});
      }

      postComment(e) {
        e.preventDefault();
    
        if(!this.state.commentBody)
        {
          this.setState({empty: true});
        }else
        {let currenetDate=new Date();

        let newcomment ={
          date: currenetDate.toISOString(),
          _id: this.props.category._id+1,
          name: this.state.user.full_name,
          body: this.state.commentBody,
          managerResponse: null
        }
        console.log(this.props.category._id);
        console.log(this.props.capability_id);

        let commentObject = {
          _id_capabilitate: this.props.capability_id,
          _id_categorie: this.props.category._id,
          newComment: {name: newcomment.name, body: newcomment.body, managerResponse: null}
        }

        addComment(commentObject);

        this.props.category.comments.push(newcomment);
        
        this.setState({commentBody: "", empty: false});}
      }

      parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

      getTotalExpense(){
        let total = 0;
        for (var i=0; i<this.state.expenses.length; i++) {
          if(this.props.category._id==this.state.expenses[i].category_id)
            total += this.state.expenses[i].sum;
        }
        return total;
    }

      postExpense(e){
        e.preventDefault();

        this.setState({emptyExpenseName: false,emptyExpenseDescription:false,emptyExpenseSum:false});

        if(this.state.newExpenseName && this.state.newExpenseDescription && Number(this.state.newExpenseSum)!=0 && Number(this.state.newExpenseSum)>0)
        {let currentDate=new Date();
        let newExpense={
          _id:  currentDate.toISOString(),
          name: this.state.newExpenseName,
          description: this.state.newExpenseDescription,
          sum: Number(this.state.newExpenseSum),
          category_id: this.props.category._id,
          date: currentDate.toISOString()
        }
        console.log(this.props.capability_id,newExpense);
        addUserExpense(this.props.capability_id,newExpense);
        
        NotificationManager.success('A new expense has been added to '+this.props.category.name+' category!', 'Successful post!');

        this.props.category.budget-=Number(this.state.newExpenseSum);
        this.state.expenses.push(newExpense);
        this.state.addExpenseBtn=false;
        this.state.openModalAddExpenses=false;
        this.state.openModalExpenses=true;
        this.setState(this.state);
        this.setState({emptyExpenseName: false,emptyExpenseDescription:false,emptyExpenseSum:false});
        }
        else{
          if(!this.state.newExpenseName){
            this.setState({emptyExpenseName: true});
          }
          if(!this.state.newExpenseDescription){
            this.setState({emptyExpenseDescription: true});
          }
          if(Number(this.state.newExpenseSum)==0 || Number(this.state.newExpenseSum)<0){
            this.setState({emptyExpenseSum: true});
          }
        }
      }

      componentWillMount(){
        this.setState({expenses: this.props.expenses});

        var addExp=this.state.user.hasPermissionToAddExpense.indexOf( this.props.category._id) > -1 ;
        this.setState({addExpenseBtn: addExp});

      }


    render(){
    return (

        <Thumbnail src={require("./metro_systems_thumbnail.png")} alt="242x200" className="thumbnailOkr">
        <NotificationContainer/>
        <h3>{this.props.category.name}</h3>
        <p>{this.props.category.description}</p>
        <Button bsStyle="primary" bsSize="large">Available budget: {this.props.category.budget} €</Button>
        <Button bsStyle="primary" bsSize="large" className="seeExpensesBtn" onClick={() => this.setState({ openModalExpenses: !this.state.openModalExpenses, open: false, openModalAddExpenses: false })}>Used budget</Button>
        {this.state.addExpenseBtn?
                <Button bsStyle="danger" bsSize="large" onClick={() => this.setState({ openModalAddExpenses: !this.state.openModalAddExpenses, openModalExpenses: false, open: false})} className="seeExpensesBtn">Add an expense</Button>
                :
                null
        }
        <Button bsStyle="primary" bsSize="large" onClick={() => this.setState({ open: !this.state.open, openModalExpenses: false, openModalAddExpenses: false})} className="seeCommentsButton">
          {this.state.open?
              "Hide the comments" :
              "See all the comments"}
        </Button>

<div>



        <div className="item-wrapper">
          <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={600}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={200}>
          {this.state.open ?
                    
                    <Well>
                    {this.props.category.comments.map(function(comment,indexx){
                     return (
                        <Comment comment={comment} key={comment._id} />
                    )
                    })}
                    <div className="pointer"></div>
            <div className='comment-node' >
            <div className='print-author'>
                 
            </div> 
            <Form onSubmit={(this.postComment).bind(this)}>
            <FormGroup controlId="formControlsTextarea">
            <Grid >
              <Row>
                <Col xs={6} md={11}>
            <FormControl 
            componentClass="textarea" 
            placeholder="Add your comment here ..." 
            value={this.state.commentBody} 
            onChange={(this.onCommentBodyChange).bind(this)}
            className={classnames({
              'is-invalid': this.state.empty
            })} />
            {this.state.empty && (<p id="emptyComment">The comment is empty</p>)}
            </Col>
            <Col xs={6} md={1}>
            <Button type="submit" bsStyle="primary" bsSize="large" >Post</Button>
            </Col>
            </Row>
            </Grid>
            </FormGroup>
            </Form>
        </div>
                  </Well>

                    :
                    null}
        </ReactCSSTransitionGroup>
        </div>

      {/* Expenses Module !!!!!!!! */}

      <div className="item-wrapper">
          <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={600}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={200}>
          {this.state.openModalExpenses ?
                    
                    <Well>
                      <h3>List of expenses:</h3>
                      <Table responsive>
                <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Sum</th>
                <th>Category</th>
                <th>Date</th>
                </tr>
                </thead>
            <tbody>

            {this.state.expenses.map(function(expense,index){
              if(this.props.category._id==expense.category_id)
                     return (
                        <tr key={expense._id}>
                        <td>{index+1}</td>
                        <td>{expense.name}</td>
                        <td>{expense.sum}€</td>
                        <td>{this.props.category.name}</td>
                        <td>{this.parseISOString(expense.date).toDateString()}</td>
                      </tr>
                    )
                    }.bind(this))}

                    <tr>
                        <td></td>
                        <td colSpan="1"><strong>Total expenses</strong></td>
                        <td><strong>{this.getTotalExpense()}€</strong></td>
                        <td colSpan="2"></td>
                    </tr>
                    

                          </tbody>
                        </Table>
                    </Well>

                    :
                    null}
        </ReactCSSTransitionGroup>
        </div>

          {/* Add Expense Module */}
         <div className="item-wrapper">
          <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={600}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={200}>
          {this.state.openModalAddExpenses ?
                    
                    <Well>
                      <h1>Add an expense *</h1>
                      <small>* Be careful, once you post the expense you cannot add another expense or edit the posted one</small>
                    
                     
          
            <form 
            onSubmit={(this.postExpense).bind(this)}
            >
            <FormGroup >
            <ControlLabel>Name</ControlLabel>
            <FormControl
            id="formControlsText"
            type="text"
            label="Text"
            placeholder="Name"
            value={this.state.newExpenseName} 
            onChange={(e)=>this.setState({newExpenseName: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseName
            })}
            />
            {this.state.emptyExpenseName && (<p id="emptyComment">The name field is empty</p>)}
            <ControlLabel>Description</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="textarea"
            componentClass="textarea"
            label="Description"
            placeholder="Description"
            value={this.state.newExpenseDescription} 
            onChange={(e)=>this.setState({newExpenseDescription: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseDescription
            })}
            />
            {this.state.emptyExpenseDescription && (<p id="emptyComment">The description field is empty</p>)}
            <ControlLabel>Sum</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="number"
            label="Sum"
            placeholder="Sum"
            value={this.state.newExpenseSum} 
            onChange={(e)=>this.setState({newExpenseSum: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseSum
            })}
            />
            {this.state.emptyExpenseSum && (<p id="emptyComment">The sum field is either 0 or a negative number</p>)}
            <Button bsStyle="primary" bsSize="large" type="submit" className="addExpenseButton">Post</Button>
            </FormGroup>
            </form>
        
                    </Well>

                    :
                    null}
        </ReactCSSTransitionGroup>
        </div>
          
      </div>



      </Thumbnail>
    );}
}

ThumbnailOkr.propTypes = {
  auth: PropTypes.object
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(withRouter(ThumbnailOkr));