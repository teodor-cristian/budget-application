import React,{Component} from 'react';
import { connect } from 'react-redux';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import DayPicker from 'react-day-picker/DayPicker';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {Modal, Button} from 'react-bootstrap';

class DownloadExpensesModal extends Component{

    static defaultProps = {
        numberOfMonths: 2,
      };  
    
    constructor() {
        super();
        
        this.downloadExpenses = this.downloadExpenses.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = this.getInitialState();
        }

        getInitialState() {
            return {
              from: undefined,
              to: undefined,
            };
          }

        handleDayClick(day) {
            const range = DateUtils.addDayToRange(day, this.state);
            this.setState(range);
          }
          handleResetClick() {
            this.setState(this.getInitialState());
          }
      
          s2ab(s) { 
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;    
          }
      
        downloadExpenses(){
            const allExpenses = this.props.current_capability.categories[this.props.current_category_index].list_of_expenses;
            
            var filtredExpenses=[];
        
            for(let i=0; i<allExpenses.length; i++){
                let date = new Date(allExpenses[i].date);
                if(date > this.state.from && date < this.state.to){
                    filtredExpenses.push(allExpenses[i])
                }
            }
      
            console.log(filtredExpenses);
            var worksheet = XLSX.utils.json_to_sheet(filtredExpenses);
            var new_workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      
            var wbout = XLSX.write(new_workbook,{ bookType: 'xlsx', type: 'binary'});
      
            let fileName="Expenses_"+this.state.from.toString()+"_"+this.state.to.toString()+".xlsx";
            saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), fileName);
      
          }


    render(){
        const category= this.props.current_capability.categories[this.props.current_category_index];        
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };

        return(
        <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        animation={false}
        bsSize="lg"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <div className="modalBudgetContainer">
        <h4>
          {!from && !to && 'Please select the first day.'}
          {from && !to && 'Please select the last day.'}
          {from &&
            to &&
            `Download the list of expenses from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{' '}
          {from &&
            to && (<span>
              <button className="btn btn-primary link" onClick={this.handleResetClick}>
                Reset
              </button>
              <button className="btn btn-primary link" onClick={this.downloadExpenses}>
              Download xlsx
            </button>
            </span>)}
          </h4>

          <DayPicker
          className="Selectable"
          numberOfMonths={this.props.numberOfMonths}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
        />
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

export default connect(mapStateToProps)(DownloadExpensesModal);