import React,{Component} from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import DownloadExpensesModal from './DownloadExpensesModal';
import 'react-table/react-table.css';



import {Button, Glyphicon} from 'react-bootstrap';

class ExpensesTable extends Component{

    constructor() {
      super();

      this.state = {
        openModalDownloadExpenses:false
    };

      this.openModal = this.openModal.bind(this);
      this.handleModalClose = this.handleModalClose.bind(this);
    }

    openModal(){
          this.setState({openModalDownloadExpenses: true})
      }

        
    handleModalClose(){
          this.setState({openModalDownloadExpenses: false});
      }
    

    render(){
        const data = this.props.current_capability.categories[this.props.current_category_index].list_of_expenses;


        const columns = [{
          Header: 'Name',
          accessor: 'name' // String-based value accessors!
        }, {
          Header: 'Description',
          accessor: 'description'
        }, {
          Header: 'Sum',
          accessor: 'sum'
        }, {
          Header: 'User',
          accessor: 'authorName'
        }, {
          Header: 'Date',
          accessor: 'date'
        }]
      
        return(
            <div className="expensesContainer">
            <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={5}
          />
          
          <Button onClick={this.openModal} className="btn btn-primary downloadBtnExpenses">
          <Glyphicon glyph="glyphicon glyphicon-download-alt" />{' '}
          Download as a xlsx...</Button>

          <DownloadExpensesModal  show={this.state.openModalDownloadExpenses} onHide={this.handleModalClose}  />
          </div>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
})

export default connect(mapStateToProps)(ExpensesTable);