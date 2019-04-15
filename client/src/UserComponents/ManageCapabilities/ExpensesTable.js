import React, { Component } from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'


class ExpensesTable extends Component{

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

    render(){
        const data = this.props.list_of_expenses;
        
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
            Header: 'Date',
            accessor: 'date'
          }]
        
          
        return (
            <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={5}
          />
        )
    }
}

export default ExpensesTable;