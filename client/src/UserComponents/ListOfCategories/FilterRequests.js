import React,{Component} from 'react';
import { connect } from 'react-redux';
import {filterRequests} from './../../actions/currentCategory';


class FilterRequests extends Component{

    constructor(props){
        super(props);
        this.state = {
            inputValue: "",
            hasResults: true
        }

        this.inputChange = this.inputChange.bind(this);
    }

    inputChange(e){
        this.setState({inputValue: e.target.value},()=>{
            this.filter();
        });

        
    }

    filter(){
        const filteredRequests = this.props.current_category.requests.filter(
            (request) => {
                return request.hashtags.indexOf(this.state.inputValue) !== -1;
            }
        )

        if(filteredRequests.length !== 0){
            this.setState({hasResults: true})
            this.props.filterRequests(filteredRequests)
        }
        else{
            this.setState({hasResults: false})
            this.props.filterRequests(this.props.current_category_unchanged.requests)
        }

        if(this.state.inputValue===''){
            this.setState({hasResults: true})
        }

        console.log(filteredRequests);
    }

    render(){

        return(
            <div className={this.state.inputValue? "searchContainer searchContainerActive" : "searchContainer"}>
            #{' '}<input 
            placeholder="Search a hashtag ..."
            value={this.state.inputValue} 
            onChange={this.inputChange.bind(this)}
            className="searchInput" />

            {this.state.hasResults ? null : <p className="noResultsFilter">No results found</p>}
            </div>
            )
    }
}

const mapStateToProps = (state) => ({
    current_category: state.currentCategory.current_category,
    current_category_unchanged: state.currentCategory.current_category_unchanged
})

export default connect(mapStateToProps, {filterRequests})(FilterRequests) ;