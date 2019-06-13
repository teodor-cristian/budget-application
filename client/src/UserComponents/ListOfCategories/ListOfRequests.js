import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentCategory } from '../../actions/currentCategory';
import Request from './Request'
import LoadingAnimation from '../ReusableComponents/LoadingAnimation'
import { StyleRoot } from 'radium'
import Timeline from 'react-dual-timeline'


class ListOfRequests extends Component{

    constructor(props){
        super(props);
        this.state = {
        }

    }


    render(){
        return(
           <span>
               {this.props.posting_new_request?
                <LoadingAnimation />
                :
                null
                }
            <StyleRoot >
            <Timeline 
             activeColor='#4eb7f5' lineColor="#005cbf" itemWidth={600} animations={false} twoSidedOverlap={200}>
            {
                this.props.current_category.requests.map(function(request,index){ // MDF-PERF.reverse()
                    return(<span key={request._id}>
                        <Request
                        style={{'text-align': 'left'}}
                        request={request} request_id={request._id} request_index={index} />
                        {/* <div icon='x'>Arbitrary entry</div> */}
                        </span>
                          )
                })
            }
            </Timeline>
            </StyleRoot>

           </span>
        )
    }
}

ListOfRequests.propTypes = {
    getCurrentCategory: PropTypes.func.isRequired,
    current_category: PropTypes.object.isRequired,
    is_set: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    posting_new_request: state.currentCategory.posting_new_category,
    current_category: state.currentCategory.current_category,
    is_set: state.currentCategory.is_set,
})

export default connect(mapStateToProps, { getCurrentCategory },null,{ pure:true })(ListOfRequests);