import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentCategory } from '../../actions/currentCategory';

import AddRequest from './AddRequest';
import FilterRequests from './FilterRequests';
import ListOfRequests from './ListOfRequests';
import UsedBudget from './UsedBudget';
import AddExpense from './AddExpense';
import Tagcloud from './TagCloud';

import {Button } from 'react-bootstrap';

import {TabGroup, ContentFade} from 'metro-ui-components';

class Category extends Component{

    constructor(props){
        super(props);
        this.state = {
            openRequest: false,
            openUsedBudget: false,
            activeTab: "",
            hasPermissionToAddExpense: true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.current_category._id !== prevProps.current_category._id) {
          this.setState({activeTab: ""})
        }
        // ***
        // atunci cand se schimba nr de cheltuieli se modifica activeTab: "usedBudget"
        // ***
        if(this.props.posted_new_expense !== prevProps.posted_new_expense) {
            this.setState({activeTab: "usedBudget"})
        }
      }
    
    render(){

        // console.log(this.props.current_category);

        const {current_category, is_set} = this.props;

        var currentTab=()=>{
            switch(this.state.activeTab) {
            case 'requests':
               return (<ContentFade>
                   <div>
                   <AddRequest />
                   <FilterRequests />
                   <ListOfRequests />
                   </div>
                   </ContentFade>)
               
            case 'usedBudget':
            return (<span>
                <UsedBudget />
                </span>)

            case 'addAnExpense':
            return (<span>
                    <AddExpense />
                    </span>
                    )
               
            default:
            return (<span>
                    {is_set ?
                    // <Tagcloud />    
                    null
                    :
                    null}
                    </span>)
            }}

        return(
            <div className="rightColumn">
            <div className="categoryNameHeader">
            <h1 >{is_set ? 
            (<span>{current_category.name} - {current_category.budget}€
            <span className="categoryButtons">

        
            <TabGroup activeTab={this.state.activeTab}>
            <button name="requests" 
            onClick={()=>this.setState({openRequest: true, openUsedBudget: false, activeTab: "requests"})}
            >
            Requests
            </button>
            <button name="usedBudget" 
            onClick={()=>this.setState({openRequest: false, openUsedBudget:true, activeTab: "usedBudget"})}
            >
            Used budget
            </button>
            <button name="addAnExpense" 
            onClick={()=>this.setState({activeTab: "addAnExpense"})}
            disabled={this.props.user.hasPermissionToAddExpense.indexOf(this.props.current_category._id) > -1? false: true}
            >
            Add an expense
            </button>
            </TabGroup>
        
            </span>
            </span>
            )
            :
            <p className="selectCategory">
            Select a category
            </p>}
            </h1>
            </div>
            
            {
               currentTab()
            }
            </div>
        )
    }
}

Category.propTypes = {
    getCurrentCategory: PropTypes.func.isRequired,
    current_category: PropTypes.object.isRequired,
    is_set: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    current_category: state.currentCategory.current_category,
    is_set: state.currentCategory.is_set,
    posted_new_expense: state.currentCategory.posted_new_expense,
    user: state.auth.user,
})

export default connect(mapStateToProps, { getCurrentCategory })(Category);