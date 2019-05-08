import React,{Component} from 'react';
import { connect } from 'react-redux';
import {setCurrentCategory} from '../../actions/currentCapabilityManager'
import {TabGroup} from 'metro-ui-components';

class ListOfCategories extends Component{

    
    constructor(props){
        super(props);
        this.state = {
            activeTab: ""
        }
    }

    closeModal(){

    }

    render(){
        return(
                <TabGroup activeTab={this.state.activeTab}>
                    {this.props.current_capability.categories.map(function(category,index){
                        return(
                            <button name={category.name} onClick={()=>{this.setState({activeTab: category.name}); this.props.setCurrentCategory(index)}} key={category._id}>
                            {category.name}
                            </button>
                        )
                    }.bind(this))}
                    {/* <button name="addExpense">
                    Add a new category
                    </button> */}
                    </TabGroup>             )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability
})

export default connect(mapStateToProps,{setCurrentCategory})(ListOfCategories);