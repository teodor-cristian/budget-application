import React,{Component} from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { connect } from 'react-redux';

class UsedBudget extends Component{

    constructor(props){
        super(props);
        
        this.state = {
          data: [],
          total_used_budget: 0
        }
    }

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

    totalUsedBudget(){
      let total_used_budget=0;

      for(let i=0; i<this.props.current_category.list_of_expenses.length; i++){
        total_used_budget+=this.props.current_category.list_of_expenses[i].sum;
      }
      return total_used_budget;
    }

    render(){
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
      
        
      return (<span>
          <ReactTable
          data={this.props.current_category.list_of_expenses}
          columns={columns}
          defaultPageSize={10}
        />
        <h2 className="totalUsedBudget">Total used budget: {this.totalUsedBudget()}€</h2>
        </span>
      )
    }
}

const mapStateToProps = (state) => ({
    current_category: state.currentCategory.current_category,
    capabilities: state.capabilities.capabilities
})

export default connect(mapStateToProps)(UsedBudget);