import React, { useState, useEffect } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]); //commentList가 바뀔때마다 useEffect 실행

  const renderReplyComment = (parentCommentId) => {
    return props.commentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              comment={comment}
              postId={props.postId}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment
              parentCommentId={comment._id}
              postId={props.postId}
              commentLists={props.commentLists}
              refreshFunction={props.refreshFunction}
            />
          </div>
        )}
      </React.Fragment>
    ));
  };

  const onHandleChange = () => {
    setOpenReplyComments(!openReplyComments);
    console.log(openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={onHandleChange}
        >
          View {childCommentNumber} more comment(s)
        </p>
      )}
      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
