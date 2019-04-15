import React,{Component} from 'react';
import "./style.css"
import Request from './Request';
import ExpensesTable from './ExpensesTable';
import PostponedRequests from './PostponedRequests';
import ChangeBudgetModal from './ChangeBudgetModal';
import { connect } from 'react-redux';
import CustomScroll from 'react-custom-scroll';
import './../../../../node_modules/react-custom-scroll/dist/customScroll.css';

import { Button } from 'react-bootstrap';
import { Separator } from 'metro-ui-components';

class Category extends Component{

    constructor() {
        super();
        this.state = {
            openModalBudget:false
        };

        this.openModal = this.openModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
      }

    openModal(){
        this.setState({openModalBudget: true})
    }

      
    handleModalClose(){
        this.setState({openModalBudget: false});
    }

    render(){
        

        return (<span>
            {this.props.is_set_current_category?
            (<span>
            <Separator> - </Separator>
            <h3>Category budget: {this.props.current_capability.categories[this.props.current_category_index].budget}€
            {' '}
            <Button className="btn btn-md btn-primary changeBudget" onClick={this.openModal}>Change budget</Button></h3>
            <Separator> - </Separator>
            <h3>List of expenses:</h3>
            <ExpensesTable />
            <Separator> - </Separator>
            <h2 className="requestHeader">
            {/* {this.props.current_capability.categories[this.props.current_category_index].name} */}
            Requests
            </h2>
            <div className="allRequest">
            <CustomScroll flex="1" keepAtBottom={false}>
            {this.props.current_capability.categories[this.props.current_category_index].requests.reverse().map(function(request,index){ //.reverse()
                return(
                    <Request key={index} request={request} request_index={index} />
                )
            })}
            </CustomScroll>
            </div>
            <Separator> - </Separator>
            <PostponedRequests  />

            </span>
            )
            : null}
            
            <ChangeBudgetModal show={this.state.openModalBudget} onHide={this.handleModalClose} />
            
            </span>
        )
            
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
    is_set_current_category: state.currentCapabilityManager.is_set_current_category

})

export default connect(mapStateToProps)(Category);