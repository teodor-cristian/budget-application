import React,{Component} from 'react';
import { connect } from 'react-redux';
import CustomScroll from 'react-custom-scroll';
import './../../../../node_modules/react-custom-scroll/dist/customScroll.css';

import Request from './Request';

class PostponedRequests extends Component{

    render(){
        const allRequest= this.props.current_capability.categories[this.props.current_category_index].requests;        

        const currentDate=new Date();
        const currentMonth=currentDate.getMonth()
        const currentYear=currentDate.getFullYear();
        const postponedRequests=[];

        for(let i=1; i<allRequest.length; i++){
            if(allRequest[i].managerResponse){
                let date = new Date(allRequest[i].managerResponse.postponed_date);
                let requestMonth=date.getMonth();
                let requestYear=date.getFullYear();
                if(allRequest[i].managerResponse.postponed==true && requestMonth==currentMonth && requestYear==currentYear)
                {
                    postponedRequests.push(allRequest[i]);
                    allRequest[i].request_index=i;


                }
            }

        }

        return(
            <span>
            <h2>Postponed Requests (current month)</h2>
            <CustomScroll flex="1" keepAtBottom={true}>
            {postponedRequests.map(function(request,index){
                return(
                    <Request key={index} request={request} request_index={request.request_index} />
                )
            })}
            </CustomScroll>
            </span>
        )
    }
}

const mapStateToProps = (state) => ({
    current_capability: state.currentCapabilityManager.current_capability,
    current_category_index: state.currentCapabilityManager.current_category_index,
    current_request_index: state.currentCapabilityManager.current_request_index,
    auth: state.auth.user
})


export default connect(mapStateToProps)(PostponedRequests);