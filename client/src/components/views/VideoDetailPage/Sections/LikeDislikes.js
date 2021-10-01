import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [likeAction, setLikeAction] = useState(null);
  const [disLikeAction, setDisLikeAction] = useState(null);

  let variable = {};

  if (props.viedo) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);

        //내가 이미 좋아요를 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("like의 정보를 가져오지 못했습니다.");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((response) => {
      if (response.data.success) {
        //얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);

        //내가 이미 싫어요를 눌렀는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("dislike의 정보를 가져오지 못했습니다.");
      }
    });
  }, []);

  const onLike = () => {
    //좋아요 버튼 클릭이 안되어있을때
    if (likeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(likes + 1);
          setLikeAction("liked");

          if (disLikeAction !== null) {
            setDisLikeAction(null);
            setDislikes(dislikes - 1);
          }
        } else {
          alert("Like를 올리지 못했습니다");
        }
      });
    } else {
      //클릭이 되어있을 때
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(likes - 1);
          setLikeAction(null);
        } else {
          alert("Like를 내리지 못했습니다");
        }
      });
    }
  };

  const onDisLike = () => {
    //싫어요 버튼이 클릭되어있을때
    if (likeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setDisLikeAction(null);
        } else {
          alert("Dislike를 내리지 못했습니다");
        }
      });
    } else {
      //클릭이 되어있지않을 때
      Axios.post("/api/like/upDislike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes + 1);
          setDisLikeAction("disliked");

          if (likeAction !== null) {
            setLikeAction(null);
            setLikes(likes - 1);
          }
        } else {
          alert("Like를 올리지 못했습니다");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={likeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-like">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={likeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{dislikes}</span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
