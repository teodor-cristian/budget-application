import React,{Component} from 'react';
import { connect } from 'react-redux';
import { deleteUserFromCapability } from './../../../../actions/allUsers';
import LoadingAnimation from './../../../ReusableComponents/LoadingAnimation';
import { Badge, Alert, Button } from 'react-bootstrap';

class CurrentUsers extends Component{
    constructor() {
        super();
    
        this.state = {
            showAlert: false,
            userToBeDeleted: {full_name: "null"}
        };
        
      } 

      deleteUser(user){
        this.setState({showAlert: true, userToBeDeleted: user});
      }

      cancelAlert(){
        this.setState({showAlert: false});
      }

      deleteUserFromList(){
        this.setState({showAlert: false});

        this.props.deleteUserFromCapability(this.state.userToBeDeleted._id, this.props.current_capability._id);

        // let index = this.state.usersFromCategory.findIndex(user => user.name ==this.state.userToBeDeleted.name);

        // let users= this.state.usersFromCategory.splice(index,1);
        // // *** Update the database
        
        // deleteCapibilityFromUser(this.state.userToBeDeleted.name,this.state.capability._id);

        // this.setState({usersFromCategory: this.state.usersFromCategory});

      }

    render(){

        var currentUsers=[];

        this.props.users.map(function(user,index){
            if(user.capabilities.indexOf( this.props.current_capability._id) > -1){
                currentUsers.push(user);
            }
          }.bind(this))


        return(
            <div>
                {this.props.users_fetching  ?
                    <LoadingAnimation />
                    :
                    <span>
                    {
                        currentUsers.map(function(user,index){

                        return(
                            <span key={index}>
                            <Badge className="employeesBadge">{user.full_name} 
                            <Badge className="deleteUserBadge" 
                            onClick={this.deleteUser.bind(this,user)}
                            >X</Badge>
                            </Badge>
                            </span>
                        )
                        }.bind(this))
                    }
                        { this.state.showAlert? 
                        (<Alert bsStyle="danger" onDismiss={this.cancelAlert.bind(this)}>
                        <h4>Are you sure that you want to delete {this.state.userToBeDeleted.full_name} from {this.props.current_capability.name} ?</h4>
                        <p>
                        <Button bsStyle="danger" onClick={this.deleteUserFromList.bind(this)}>Delete user</Button>
                        <span> or </span>
                        <Button className="closeBtn" onClick={this.cancelAlert.bind(this)}>Cancel</Button>
                        </p>
                        </Alert>)
                        :
                        null
                        }
                    </span>
            }
              </div>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.allUsers.users,
    users_fetching : state.allUsers.users_fetching ,
    current_capability: state.currentCapabilityManager.current_capability
})

export default connect(mapStateToProps, {deleteUserFromCapability}, null, {pure: false})(CurrentUsers);