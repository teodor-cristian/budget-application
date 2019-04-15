import React,{Component} from 'react';
import { connect } from 'react-redux';
import {postNewExpense} from '../../actions/currentCategory';
import {getAllCategories} from '../../actions/capabilities'

import {Well, FormGroup, ControlLabel, FormControl, Button, Glyphicon, Alert, Badge, Form} from 'react-bootstrap';
import classnames from 'classnames';
import { promises } from 'fs';


class AddExpense extends Component{

    constructor(props){
        super(props);
        this.state = {
            newExpenseName: "",
            newExpenseDescription: "",
            newExpenseSum: 0,
            emptyExpenseName: false,
            emptyExpenseDescription: false,
            emptyExpenseSum: false,
            newRelatedExpenses: false,
            secondCategoryId: this.props.getAllCategories(this.props._id_capabilitate,this.props.current_category._id)[0]._id_category,
            secondExpenseName: "",
            secondExpenseDescription: "",
            secondExpenseSum: 0
        }

        this.addRelatedExpense = this.addRelatedExpense.bind(this);
        
    }

    postExpense(e){
        e.preventDefault();

        this.setState({emptyExpenseName: false,emptyExpenseDescription:false,emptyExpenseSum:false});

        if(this.state.newExpenseName && this.state.newExpenseDescription && Number(this.state.newExpenseSum)!=0 && Number(this.state.newExpenseSum)>0)
        {
        let currentDate=new Date();
        let newExpense={
          name: this.state.newExpenseName,
          description: this.state.newExpenseDescription,
          sum: Number(this.state.newExpenseSum),
          authorName: this.props.user.full_name,
          date: currentDate.toISOString()
        }

        this.props.postNewExpense(newExpense, this.props._id_capabilitate,this.props.current_category._id)

        // Second expense
        if(this.state.newRelatedExpenses){
          let secondExpense={
            name: this.state.secondExpenseName,
            description: this.state.secondExpenseDescription,
            sum: Number(this.state.secondExpenseSum),
            authorName: this.props.user.full_name,
            date: currentDate.toISOString()
          }

          this.props.postNewExpense(secondExpense, this.props._id_capabilitate, this.state.secondCategoryId)

        }
        
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

    addRelatedExpense(){
      this.setState({newRelatedExpenses: this.state.newRelatedExpenses+1})
      console.log(this.state.newRelatedExpenses);
    }

    render(){
      const availableCategories = this.props.getAllCategories(this.props._id_capabilitate,this.props.current_category._id);
      // this.setState({secondCategory: availableCategories[0]})
      return(
            <Well className="addExpenseWell">
            <h1>Add an expense *</h1>
            <small>* Be careful, once you post the expense you cannot add another expense or edit the posted one</small>
                    
            <form 
            onSubmit={(this.postExpense).bind(this)}
            >
            <FormGroup >
            <ControlLabel className="addExpenseLabel">Name</ControlLabel>
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
            <ControlLabel className="addExpenseLabel">Description</ControlLabel>
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
            <ControlLabel className="addExpenseLabel">Sum</ControlLabel>
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

            <input type="checkbox" onClick={()=>{this.setState({newRelatedExpenses: !this.state.newRelatedExpenses})}} />
            <ControlLabel className="otherExpense">
            Other expenses related to this request that belong to another category?            
            </ControlLabel>


            {this.state.newRelatedExpenses?
            (<Alert variant="primary">
            <h3>Add an expense to another category</h3>

            {/* Second expense form  */}
            
            <FormGroup >


            <ControlLabel  className="addExpenseLabel">Category</ControlLabel>
            <select 
            onChange={(e)=>{this.setState({secondCategoryId: e.target.value})}} 
            value={this.state.secondCategoryId}
            className="selectCategoryInput">
            {availableCategories.map(function(category,index){
              return(
              <option key={index} value={category._id_category}>{category.category_name}</option>
              )
            })}
            </select>
  
         

            <ControlLabel className="addExpenseLabel">Name</ControlLabel>
            <FormControl
            id="formControlsText"
            type="text"
            label="Text"
            placeholder="Name"
            value={this.state.secondExpenseName} 
            onChange={(e)=>this.setState({secondExpenseName: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseName
            })}
            />
            {this.state.emptyExpenseName && (<p id="emptyComment">The name field is empty</p>)}
            <ControlLabel className="addExpenseLabel">Description</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="textarea"
            componentClass="textarea"
            label="Description"
            placeholder="Description"
            value={this.state.secondExpenseDescription} 
            onChange={(e)=>this.setState({secondExpenseDescription: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseDescription
            })}
            />
            {this.state.emptyExpenseDescription && (<p id="emptyComment">The description field is empty</p>)}
            <ControlLabel className="addExpenseLabel">Sum</ControlLabel>
            <FormControl
            id="formControlsEmail"
            type="number"
            label="Sum"
            placeholder="Sum"
            value={this.state.secondExpenseSum} 
            onChange={(e)=>this.setState({secondExpenseSum: e.target.value})}
            className={classnames({
              'is-invalid': this.state.emptyExpenseSum
            })}
            />
            {this.state.emptyExpenseSum && (<p id="emptyComment">The sum field is either 0 or a negative number</p>)}
            </FormGroup>
        
            {/*  */}

                <div className="d-flex justify-content-end">
                      <Button onClick={
                        ()=>{console.log(this.state.secondCategoryId)}
                      } variant="outline-success">
                        Close me ya'll!
                      </Button>
                    </div>
              </Alert>)
            :
            null}
            

            <div className="addExpenseBtnWrap">
            <Button bsStyle="primary" bsSize="large" type="submit" className="addExpenseButton">Post</Button>
            </div>
            
            </FormGroup>
            </form>
        
            </Well>
        )
    }
}

const mapStateToProps = (state) => ({
    current_category: state.currentCategory.current_category,
    _id_capabilitate: state.currentCategory._id_capabilitate,
    is_set: state.currentCategory.is_set,
    user: state.auth.user,
})

export default connect(mapStateToProps, {postNewExpense, getAllCategories})(AddExpense);