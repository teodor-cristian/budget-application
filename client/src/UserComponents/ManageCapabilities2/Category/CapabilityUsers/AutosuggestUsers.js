import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { getAllUsers, addUserToCapability } from './../../../../actions/allUsers';

import axios from 'axios';

import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';

// import {addCapability} from '../../actions/capabilityManagement';



// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <span><strong>{suggestion.full_name}</strong>
  <div>
    <h5 className="suggestionEmail">{suggestion.email}</h5>
  </div>    </span>

);



class AutosuggestUsers extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      users: [],
      user_id: ''
    };

    this.addUser = this.addUser.bind(this);

  }

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = (suggestion) => { 
        this.setState({user_id: suggestion._id});
        return suggestion.full_name;
    };


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
    const inputValue =  value.trim().toLowerCase(); 
    const inputLength = inputValue.length;
  

    return inputLength === 0 ? [] : this.props.users.filter(user =>
      user.full_name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  componentDidMount() {
    // const token='Bearer '+ localStorage.jwtToken;

    // axios.get('/api/users/get_all_users',{ 'headers': { 'Authorization': token } })
    //         .then(res => {
    //             const users = res.data.userMap;
    //             this.setState({users: users});
    //         })
    //         .catch(err => {
    //             console.log(err.response.data)
    //         });

    // this.props.getAllUsers();
    // if(this.props.user_fetched){
    //         this.setState({users: this.props.users});
    //     };
    

}

    componentWillMount(){

    // const token='Bearer '+ localStorage.jwtToken;

    // axios.get('/api/users/get_all_users',{ 'headers': { 'Authorization': token } })
    //         .then(res => {
    //             const users = res.data.userMap;
    //             this.setState({users: users});
    //         })
    //         .catch(err => {
    //             console.log(err.response.data)
    //         });

        this.props.getAllUsers();
        this.setState({users: this.props.users});

      
    }

    addUser(e){
        e.preventDefault();
        this.setState({value: ""});
        this.props.addUserToCapability(this.state.user_id,this.props.current_capability._id);
        console.log(this.state.user_id)
    }

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for an employee...',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
    <Form inline onSubmit={this.addUser}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <Button className="addUserBtn" type="submit">Add this user to the capability</Button>
    </Form>
    );
  }
}

const mapStateToProps = (state) => ({
    user_fetched: state.allUsers.user_fetched,
    users: state.allUsers.users,
    current_capability: state.currentCapabilityManager.current_capability
})

const mapDispatchToProps = (dispatch) => {
    return {
        getAllUsers: () => {
          dispatch(getAllUsers())
      },
        addUserToCapability: (user_id, capability_id) => {
          dispatch(addUserToCapability(user_id, capability_id))
        }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps )(AutosuggestUsers);