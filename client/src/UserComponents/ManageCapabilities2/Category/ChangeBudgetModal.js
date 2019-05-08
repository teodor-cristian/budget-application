import React,{Component} from 'react';
import { connect } from 'react-redux';
import { postChangeBudget } from './../../../actions/currentCapabilityManager';

import {Modal, Button} from 'react-bootstrap';

class ChangeBudgetModal extends Component{

    
    constructor() {
        super();
        this.state = {
            newBudget: 0
        };

        this.postBudgetChange = this.postBudgetChange.bind(this);
        }

    postBudgetChange(){
        this.props.postChangeBudget(this.props.current_capability._id,
            this.props.current_capability.categories[this.props.current_category_index]._id,
            this.state.newBudget);
            this.props.onHide();
            this.setState({ newBudget: 0 })
    }

    render(){
        const category= this.props.current_capability.categories[this.props.current_category_index];        

        return(
        <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        animation={false}
        bsSize="small"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <div className="modalBudgetContainer">
        <h3>Current budget: {category.budget}€</h3>
        <h4>New budget:</h4>
        <input type="number" value={this.state.newBudget} onChange={(e)=>{ this.setState({newBudget: e.target.value })}} />
        <Button className="btn btn-md btn-primary changeBudget saveChangeBudget" onClick={this.postBudgetChange}>Save</Button>
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
})

export default connect(mapStateToProps, {postChangeBudget})(ChangeBudgetModal);