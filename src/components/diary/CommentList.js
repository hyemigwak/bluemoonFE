import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Comment from "./Comment";
import CommentInput from "./CommentInput";


CommentList.propTypes = {
    comments: PropTypes.array
};

function CommentList(props) {

    const { comments, setParentId, isReplyClicked, replyClickHandler, parentCommentId } = props;
    // const reversedComments = comments.reverse();


    return (
        <React.Fragment>
            <CommentsContainer>
                {
                    comments.map((comment) => {
                        return <Comment key={comment.commentUuid} comment={comment} replyClickHandler={replyClickHandler}
                                        setParentId={setParentId} isReplyClicked={isReplyClicked} parentCommentId={parentCommentId}/>
                    })
                }
            </CommentsContainer>
        </React.Fragment>
    )
}

export default CommentList;

const CommentsContainer = styled.div`
    width: 876px;
`;