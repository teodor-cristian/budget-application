import React,{Component} from 'react';
import { connect } from 'react-redux';
import {setCurrentRequest, postMarkCommentsAsRead, postMarkRequestAsRead} from '../../../actions/currentCapabilityManager';
import CommentsModal from './CommentsModal';
import {Media, MediaList, MediaVisual, MediaContent, MediaAside,
        Icon, ProfilePicture, Description, Badge} from 'metro-ui-components';

class Request extends Component{

    constructor() {
        super();
        this.state = {
            openModalComments: false
        };

        this.handleModalClose = this.handleModalClose.bind(this);
        this.openModal = this.openModal.bind(this);
      }

    handleModalClose(){
        this.setState({openModalComments: false});
    }

    openModal(){
        console.log("INDEXUL ESTE : ",this.props.request_index)
        this.setState({openModalComments: true});
        this.props.setCurrentRequest(this.props.request_index)
        this.props.postMarkCommentsAsRead(this.props.current_capability._id,
            this.props.current_capability.categories[this.props.current_category_index]._id,
            this.props.current_capability.categories[this.props.current_category_index].requests[this.props.request_index]._id)
        this.props.postMarkRequestAsRead(this.props.current_capability._id,
            this.props.current_capability.categories[this.props.current_category_index]._id,
            this.props.current_capability.categories[this.props.current_category_index].requests[this.props.request_index]._id)
    }

    getNoUnreadComments(request){
        var total=0;
        for(let i=0;i<request.comments.length;i++){
            if(!request.comments[i].messageRead)
            total++;
        }
        return total;
    }

    parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    render(){
        return(
            <span>
            <MediaList>
                <Media 
                // onClick={onClick}
                className={this.props.request.requestRead ? "" : "newRequest"} 
                >
                <MediaVisual>
                <ProfilePicture/>
                </MediaVisual>
                <MediaContent>
                <strong>
                {this.props.request.authorName}
                </strong>
                - {this.parseISOString(this.props.request.date).toDateString()}
                <br/>
                <Description>
                {this.props.request.body}
                </Description>
                <br />
                {this.props.request.hashtags.map(function(hashtag,index){
                    return (
                        <strong key={index} className="hashtags">
                        # {hashtag+" "}
                        </strong>
                    )
                })}
                </MediaContent>
                
                <MediaAside>
                <button className="commentsButton"  onClick={this.openModal} >
                <Icon type="messaging" />
                
                </button>
                {this.getNoUnreadComments(this.props.request)?
                <Badge
                count={this.getNoUnreadComments(this.props.request)}
                size="large"
                />
                :
                null}
                
                </MediaAside>
                </Media>     
                <CommentsModal show={this.state.openModalComments} onHide={this.handleModalClose} />
              
        </MediaList>
            
            
            </span>
        )
    }
}

const mapStateToProps = (state) => ({
    current_request_index: state.currentCapabilityManager.current_request_index,
    current_category_index: state.currentCapabilityManager.current_category_index,
    current_capability: state.currentCapabilityManager.current_capability
})

export default connect(mapStateToProps,{setCurrentRequest, postMarkCommentsAsRead, postMarkRequestAsRead})(Request);