import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postNewRequest } from '../../actions/currentCategory';
import { logoutUser } from '../../actions/authentication';
import {FormGroup, Button, FormControl, InputGroup, HelpBlock } from 'react-bootstrap';
import {Chip} from "metro-ui-components";


class AddRequest extends Component{

    constructor(props){
        super(props);
        this.state = {
            openRequest: false,
            newRequestBody: "",
            newRequestHashTag: "",
            newRequestHashtagsArray: [],
            textareaError: {validationState: null, message: null},
            hashtagsError:  {validationState: null, message: null},
        }

        this.addHashTag = this.addHashTag.bind(this);
        this.deleteHashTag = this.deleteHashTag.bind(this);
        this.postRequest = this.postRequest.bind(this);
    }

    addHashTag(){
        if(this.state.newRequestHashTag)
        {
            this.state.newRequestHashtagsArray.push(this.state.newRequestHashTag);
            this.setState({newRequestHashtagsArray: this.state.newRequestHashtagsArray, newRequestHashTag: ""})
            this.setState({hashtagsError:{validationState:null, message: null}})
        }
    }

    deleteHashTag(index){
        this.state.newRequestHashtagsArray.splice(index,1);
        this.setState({newRequestHashtagsArray: this.state.newRequestHashtagsArray})
    }

    postRequest(e){
        e.preventDefault() ;

        this.setState({
            textareaError: {validationState: null, message: null},
            hashtagsError:  {validationState: null, message: null}
        })

        var date = new Date();
        let newRequest = {
              "date": date.toISOString(),
              "body": this.state.newRequestBody,
              "hashtags": this.state.newRequestHashtagsArray,
              "authorName": this.props.auth.user.full_name,
              "managerResponse": null,
              "comments": []
        }
        
        if(this.state.newRequestBody && this.state.newRequestHashtagsArray.length!=0)
        {
            this.props.postNewRequest(newRequest,this.props.current_category._id_capabilitate,this.props.current_category.current_category._id)
            this.setState({newRequestBody: "", newRequestHashtagsArray: []})

        }
        else{
            if(this.state.newRequestBody==""){ this.setState({textareaError: {validationState:"error", message: "You can't post a empty request!"}})}
            if(this.state.newRequestHashtagsArray.length==0){ this.setState({hashtagsError:{validationState:"error", message: "You can't post a request with no hashtags!"}})}
            if(this.state.newRequestHashtagsArray.length>10){ this.setState({hashtagsError:{validationState:"error", message: "Maximum number of hashtags is 10!"}})}

        }

    }

    

    render(){
        return(
            
            <form className="addRequestForm" onKeyPress={(e) => {(e.key === 'Enter' ? e.preventDefault() : null)}}>
                
                <FormGroup controlId="formControlsTextarea" validationState={this.state.textareaError.validationState}>
                <FormControl componentClass="textarea"
                 placeholder="Add a new request ..."
                 className="textareaAddRequest"
                 onChange={(e)=>{this.setState({newRequestBody: e.target.value})}}
                 value={this.state.newRequestBody}
                 />
                {this.state.textareaError.message && (<HelpBlock>{this.state.textareaError.message}</HelpBlock>)}
                </FormGroup>

                <FormGroup  validationState={this.state.hashtagsError.validationState}>
                <InputGroup className="hashTagInputGroup" >
                    <InputGroup.Addon>#</InputGroup.Addon>
                    <FormControl type="text" id="hashTagInput" 
                                 placeholder="Add a new hashtag ..."  
                                 onChange={(e)=>{this.setState({newRequestHashTag: e.target.value})}} 
                                 onKeyPress={(e) => {(e.key === 'Enter' ? this.addHashTag() : null)}} 
                                 value={this.state.newRequestHashTag}  />
                    <InputGroup.Button><Button className="addHashtag" onClick={this.addHashTag}>+</Button></InputGroup.Button>
                </InputGroup>
                {(<HelpBlock >{this.state.hashtagsError.message}</HelpBlock>)}
                </FormGroup>
                <div className="hashTagsContainer">
                    {this.state.newRequestHashtagsArray.map(function(hashtag,index){
                        return(
                            <Chip key={index}
                            onDelete={this.deleteHashTag.bind(index)}
                            size="medium">
                            #{hashtag}
                            </Chip>
                        )
                    }.bind(this))}

                </div>
                
                <Button 
                type="submit"
                className="btn-lg addRequestBtn"
                onClick={this.postRequest}
                >Add the request</Button>
            </form>
        )
    }
}

AddRequest.propTypes = {
    postNewRequest: PropTypes.func.isRequired,
    current_category: PropTypes.object.isRequired,
    is_set: PropTypes.bool.isRequired,
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    is_set: state.currentCategory.is_set,
    current_category: state.currentCategory,
    auth: state.auth,
})


export default connect(mapStateToProps, { postNewRequest, logoutUser })(AddRequest); 