import React,{Component} from 'react';
import { connect } from 'react-redux';
import { setCurrentCapability } from '../../actions/currentCapabilityManager';

import ListOfCategories from './ListOfCategories';
import Category from 'create-react-app/my-app/client/src/UserComponents/ManageCapabilities2/Category/Category';
import CapabilityUsers from  './Category/CapabilityUsers/index';
import {Jumbotron} from 'react-bootstrap';
import {Separator} from 'metro-ui-components';


class Capability extends Component{

    getAvailableBudget(){
        let total=0;
        for (var i=0; i<this.props.current_capability.categories.length; i++) {
            total += Number(this.props.current_capability.categories[i].budget);
        }
        return total;
    }

    render(){
        return(
            <Jumbotron>
            <p><strong>Budget: </strong>
            {this.getAvailableBudget()}
            €
            </p>
            <Separator> - </Separator>
            <h3 className="categoriesHeader">Categories: </h3>
            <ListOfCategories />
            <Category />
            <Separator> - </Separator>
            <h3>Users</h3>
            <CapabilityUsers />
            </Jumbotron>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability
})

export default connect(mapStateToProps)(Capability);