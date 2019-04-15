import React, { Component } from 'react';
import {getAllOkrs, addOkr} from '../actions/getAndPostOkrs';

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var InputGroup = require('react-bootstrap/lib/InputGroup');
var Button = require('react-bootstrap/lib/Button');

export default class OKR_Management extends Component {

    constructor(props) {
        super(props)
        this.state = {
            okr_name: "",
            okr_description: "",
            okr_price: 0,
            isLoading: false
        }
    }

    componentDidMount() {
     console.log(getAllOkrs());
    }
    
    onOkrNameChange(e) {
        this.setState({okr_name: e.target.value});
      }

      onOkrDescriptionChange(e) {
        this.setState({okr_description: e.target.value});
      }

      onOkrValueChange(e) {
        if(e.target.value<0){
            this.setState({okr_price: 0});
        }else{
            this.setState({okr_price: e.target.value});
        }
      }


    onSubmit(e) {
        e.preventDefault();
    

        this.setState({ isLoading: true });

        setTimeout(() => {
            console.log("submit button");
        
            console.log(this.state);
    
            addOkr(this.state);
    
            this.setState({ isLoading: false });

            this.props.history.push(`/okr_list_protected`)

        }, 2000);
      }

    render() {
        var { isLoading } = this.state.isLoading;

        return (
            <Grid>

            <Row className="show-grid">
            <Col sm={6} md={12} >
                <h1>Add a new OKR</h1>
            </Col>
            </Row>

            <Row className="show-grid">
            <Col sm={6} md={12} >
            <form onSubmit={!isLoading ? (this.onSubmit).bind(this) : null}>
                <FormGroup bsSize="large">
                <ControlLabel>OKR Name</ControlLabel>
                <FormControl type="text" placeholder="OKR Name" value={this.state.okr_name} onChange={(this.onOkrNameChange).bind(this)} />
                </FormGroup>

                <FormGroup controlId="formControlsTextarea">
                <ControlLabel>OKR Description</ControlLabel>
                <FormControl componentClass="textarea" rows={10} placeholder="OKR Description" value={this.state.okr_description} onChange={(this.onOkrDescriptionChange).bind(this)} />
                </FormGroup>

                <FormGroup>
                <InputGroup>
                <InputGroup.Addon>€</InputGroup.Addon>
                <FormControl type="number" id="inputValue" value={this.state.okr_price} onChange={(this.onOkrValueChange).bind(this)} />
                <InputGroup.Addon>.0</InputGroup.Addon>
                </InputGroup>
                </FormGroup>

                <Button 
                type="submit" 
                bsStyle="primary" 
                bsSize="large" 
                disabled={isLoading}
                >
                {isLoading ? 'Loading...' : 'Add OKR'}
                </Button>

            </form>
            </Col>
            </Row>
            </Grid>
        );
    }
}