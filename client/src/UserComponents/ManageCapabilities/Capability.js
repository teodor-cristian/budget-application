import React, { Component } from 'react';
import Categories from './Categories';
import axios from 'axios';

import ExpensesTable from './ExpensesTable';
import AutosuggestUsers from './AutosuggestUsers';
import {deleteCapibilityFromUser, addCategory, addExpense} from '../../actions/capabilityManagement';


import Table from 'react-bootstrap/lib/Table';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Badge from 'react-bootstrap/lib/Badge';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Alert from 'react-bootstrap/lib/Alert';

class Capability extends Component{
    
    constructor(props){
        super(props);
        this.state = {
          capability : null,
          showModal: false,
          newExpenseName: "",
          newExpenseDescription: "",
          newExpenseSum: 0,
          newExpenseCategory: "",
          users: [],
          usersFromCategory: [],
          showAlert: false,
          userToBeDeleted: {}
        }

        this.parseISOString=this.parseISOString.bind(this);
        this.handleHide = this.handleHide.bind(this);

        this.postCategoryInDatabase = this.postCategoryInDatabase.bind(this);
        this.addUserToCategory = this.addUserToCategory.bind(this);
        this.filterList = this.filterList.bind(this);

        this.changeBudgetForCategory = this.changeBudgetForCategory.bind(this);

    }

    handleHide() {
        this.setState({ showModal: false });
      }

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

    getTotalExpense(){
        let total = 0;
        for (var i=0; i<this.state.capability.list_of_expenses.length; i++) {
            total += this.state.capability.list_of_expenses[i].sum;
        }
        return total;
    }

    getAvailableBudget(){
        let total=0;
        for (var i=0; i<this.state.capability.categories.length; i++) {
            total += this.state.capability.categories[i].budget;
        }
        return total;
    }

    getTotalBudget(){
      return this.getAvailableBudget() + this.getTotalExpense();
    }

    onNewExpenseName(e){
        this.setState({newExpenseName: e.target.value});
    }

    onNewExpenseDescription(e){
        this.setState({newExpenseDescription: e.target.value});
    }

    onNewExpenseSum(e){
        if(e.target.value<0){
            e.target.value=0;
        }
        this.setState({newExpenseSum: e.target.value});
    }

    onNewExpenseCategory(e){
      console.log(e.target.value);
      this.setState({newExpenseCategory: e.target.value});
    }


    postExpense(e) {
        e.preventDefault();
    
        let currentDate=new Date();

        var categ = this.state.newExpenseCategory.split("|");
        let newExpense={
            _id:  currentDate.toISOString(),
            name: this.state.newExpenseName,
            description: this.state.newExpenseDescription,
            sum: Number(this.state.newExpenseSum),
            category_name: categ[0],
            category_id:  categ[1],
            date: currentDate.toISOString()
        };

        console.log(newExpense);

        addExpense(this.state.capability._id,newExpense);

        this.state.capability.list_of_expenses.push(newExpense);

        for(let i=0;i<this.state.capability.categories.length;i++){
          if(this.state.capability.categories[i]._id==newExpense.category_id){
            this.state.capability.categories[i].budget= this.state.capability.categories[i].budget - Number(this.state.newExpenseSum);
          }
        }

        this.setState(this.state);
        
        console.log(newExpense);

        this.setState({ showModal: false });

      }

      postCategory(e) {
        e.preventDefault();
    
        let currentDate=new Date();   
        
        this.setState({emptyNewCategoryName: false,emptyNewCategoryDescription:false,emptyNewCategoryBudget:false});

        if(this.state.newCategoryName && this.state.newCategoryDescription && Number(this.state.value)!=0)
        {let newCategory={
            name: this.state.newCategoryName,
            description: this.state.newCategoryDescription,
            budget: this.state.value,
            _id:  currentDate.toISOString(),
            date:  currentDate.toISOString(),
            comments: []
        }
        
        this.props.postCategoryInDatabase(newCategory);

        this.setState({ showModal: false, newCategoryName: "", newCategoryDescription:"", value: 0 });
      }
        else{
          if(!this.state.newCategoryName){
            this.setState({emptyNewCategoryName: true});
          }
          if(!this.state.newCategoryDescription){
            this.setState({emptyNewCategoryDescription: true});
          }
          if(Number(this.state.value)==0){
            this.setState({emptyNewCategoryBudget: true});
          }
        }
      }

      postCategoryInDatabase(newCategory){
          
        addCategory(this.state.capability,newCategory);
        console.log(newCategory);
        this.state.capability.categories.push(newCategory);
        this.setState(this.state);
      }

      addUserToCategory(newUserToCategory){
         this.state.usersFromCategory.push({name: newUserToCategory, id: newUserToCategory+1});
        this.setState({usersFromCategory: this.state.usersFromCategory});
      }

      filterList(event){
        var updatedList = this.state.usersFromCategory;
        updatedList = updatedList.filter(function(item){
          return item.name.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });
        this.setState({usersFromCategory: updatedList});
      }

      getCategoryNameFromId(category_id){
        for(var i = 0; i < this.state.capability.categories.length; i++) {
          if (this.state.capability.categories[i]._id == category_id) {
              return this.state.capability.categories[i].name;
          }}
      }

      deleteUser(user){
        this.setState({showAlert: true, userToBeDeleted: user});
      }

      cancelAlert(){
        this.setState({showAlert: false});
      }

      deleteUserFromList(){
        this.setState({showAlert: false});

        let index = this.state.usersFromCategory.findIndex(user => user.name ==this.state.userToBeDeleted.name);

        let users= this.state.usersFromCategory.splice(index,1);
        // *** Update the database
        
        deleteCapibilityFromUser(this.state.userToBeDeleted.name,this.state.capability._id);

        this.setState({usersFromCategory: this.state.usersFromCategory});

      }

      changeBudgetForCategory(index,newBudget){
        
        this.state.capability.categories[index].budget = Number(newBudget);
        this.setState(this.state);
    }

    componentWillMount(){

      this.setState({capability: this.props.capability}) ;

      const token='Bearer '+ localStorage.jwtToken;
    
      axios.get('/api/users/get_all_users',{ 'headers': { 'Authorization': token } })
              .then(res => {
                  const users = res.data.userMap;
                  this.setState({users: users});

                  this.state.users.map(function(user,index){
                    if(user.capabilities.indexOf( this.state.capability._id) > -1){
                      this.state.usersFromCategory.push({name: user.full_name, id: user._id.$oid});
                      this.setState({usersFromCategory: this.state.usersFromCategory})
                    }
                  }.bind(this)) 

              })
              .catch(err => {
                  console.log(err.response.data)
              });
    }

    componentWillReceiveProps (nextProps) {
      this.setState({capability: nextProps.capability, usersFromCategory: []}) ;

      const token='Bearer '+ localStorage.jwtToken;
    
      axios.get('/api/users/get_all_users',{ 'headers': { 'Authorization': token } })
              .then(res => {
                  const users = res.data.userMap;
                  this.setState({users: users});

                  this.state.users.map(function(user,index){
                    if(user.capabilities.indexOf( this.state.capability._id) > -1){
                      this.state.usersFromCategory.push({name: user.full_name, id: user._id.$oid});
                      this.setState({usersFromCategory: this.state.usersFromCategory})
                    }
                  }.bind(this)) 

              })
              .catch(err => {
                  console.log(err.response.data)
              });

    }

    componentDidUpdate(prevProps) {
      
    }

    render(){
        return(
            <div>
            <h1>{this.state.capability.name}</h1>
            <p><strong>Budget: </strong>
            {/* {this.state.capability.budget}  */}
            {this.getTotalBudget()}
            €</p>
            <p><strong>Available budget: </strong>{this.getAvailableBudget()} €</p>
            <h3>List of expenses:</h3>
            <ExpensesTable list_of_expenses={this.state.capability.list_of_expenses} />
            {/* ************************************  TABEL DE CHELTUIELI ***************************/}
            <Table responsive>
                <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Sum</th>
                <th>Category</th>
                <th>Date</th>
                </tr>
                </thead>
            <tbody>

            {this.state.capability.list_of_expenses.map(function(expense,index){
                     return (
                        <tr key={expense._id}>
                        <td>{index+1}</td>
                        <td>{expense.name}</td>
                        <td className="expenseDescription">{expense.description}</td>
                        <td>{expense.sum}€</td>
                        <td>{this.getCategoryNameFromId(expense.category_id)}</td>
                        <td>{this.parseISOString(expense.date).toDateString()}</td>
                      </tr>
                    )
                    }.bind(this))}
                    
                    <tr>
                        <td></td>
                        <td></td>
                        <td colSpan="2" className="addNewExpense"><button onClick={() => this.setState({ showModal: true })}><strong>Add a new expense</strong></button></td>
                        <td colSpan="2"></td>
                    </tr>
                   
                    <tr>
                        <td></td>
                        <td colSpan="2"><strong>Total expenses</strong></td>
                        <td><strong>{this.getTotalExpense()}€</strong></td>
                        <td colSpan="2"></td>
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
                Add a new expense
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(this.postExpense).bind(this)}>
            <ControlLabel>Name</ControlLabel>
            <FormControl
            id="formControlsText"
            type="text"
            label="Text"
            placeholder="Name"
            value={this.state.newExpenseName} 
            onChange={(this.onNewExpenseName).bind(this)}
            />
            <ControlLabel>Description</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="textarea"
            componentClass="textarea"
            label="Description"
            placeholder="Description"
            value={this.state.newExpenseDescription} 
            onChange={(this.onNewExpenseDescription).bind(this)}
            />
          <FormGroup controlId="formControlsSelect" defaultValue={this.state.capability.categories[0]._id.$oid}>
            <ControlLabel>Category</ControlLabel>
            <FormControl componentClass="select" placeholder="select" onChange={(this.onNewExpenseCategory).bind(this)}>
            {this.state.capability.categories.map(function(category,index){
              return(
                <option key={category._id} value={ category.name +"|"+ category._id}>{category.name}</option>
              )
            })}
            </FormControl>
          </FormGroup>
            <ControlLabel>Sum</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="number"
            label="Sum"
            placeholder="Sum"
            value={this.state.newExpenseSum} 
            onChange={(this.onNewExpenseSum).bind(this)}
            />
            <Button bsStyle="primary" bsSize="large" type="submit" className="addExpenseButton">Post</Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHide}>Close</Button>
          </Modal.Footer>
        </Modal>
</div>
{/* *********************************************************************************************************** */}

            <h3>Categories: </h3>
        
                    <Categories _id_capabilitate={this.state.capability._id} categories = {this.state.capability.categories} postCategory={this.postCategory} postCategoryInDatabase={this.postCategoryInDatabase} remainingBudget={this.state.capability.budget - this.getTotalExpense()} changeBudgetForCategory={this.changeBudgetForCategory} />

            <p><strong>Manage Employees</strong></p>
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={6}>
              <AutosuggestUsers capability_id={this.state.capability._id} addUserToCategory={this.addUserToCategory}/>
              </Col>
              <Col xs={12} md={6}>
              <form>
              <fieldset className="form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
              </fieldset>
              </form>
              {
                this.state.usersFromCategory.map(function(user,index){

                  return(
                    <span key={index}>
                    <Badge className="employeesBadge">{user.name} 
                    <Badge className="deleteUserBadge" onClick={this.deleteUser.bind(this,user)}>X</Badge>
                    </Badge>
                    </span>
                  )
                }.bind(this))
                
              }
              { this.state.showAlert? 
                (<Alert bsStyle="danger" onDismiss={this.cancelAlert.bind(this)}>
                <h4>Are you sure that you want to delete {this.state.userToBeDeleted.name} ?</h4>
                <p>
                <Button bsStyle="danger" onClick={this.deleteUserFromList.bind(this)}>Delete user</Button>
                <span> or </span>
                <Button onClick={this.cancelAlert.bind(this)}>Cancel</Button>
                </p>
                </Alert>)
                :
                null
                }  
              </Col>
              </Row>
              </Grid>
            </div>
        )
    }
}

export default Capability;

