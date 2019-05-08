import React, { Component } from 'react';

import {Glyphicon} from 'react-bootstrap';


class Comment extends Component{

      parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }

    render(){
        return(
            <div>
            <div className="pointer"></div>
            <div className='comment-node' >
            <div className='print-author'>
                <h3>{this.props.comment.name}</h3> 
            </div> 
            <p>{this.props.comment.body}</p>
            <p className="comment-date">{this.parseISOString(this.props.comment.date).toDateString()}</p>
        </div>


        {this.props.comment.managerResponse?
        (
            <div>
            <div className="pointer-reply"></div>
            <div className='comment-node reply' >
            <div className='print-author'>
            </div> 
                <div className='comment-node'>
                <div className='print-author'>
                <h3>{this.props.comment.managerResponse.name} {' '}
                {this.props.comment.managerResponse.grantPermission?
                (
                    <Glyphicon glyph="glyphicon glyphicon-ok-circle" />
                ):null}
                </h3> 
                </div> 
                <p>{this.props.comment.managerResponse.body}</p>
                <p className="comment-date">
                {this.parseISOString(this.props.comment.managerResponse.date).toDateString()}
                </p>
            </div>
                </div>
            </div>
        )
        : 
        null
    }
        

        </div>
        )
    }
}

export default Comment;