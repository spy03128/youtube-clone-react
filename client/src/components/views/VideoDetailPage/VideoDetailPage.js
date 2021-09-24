import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [videoDetail, setVideoDetail] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오는데 실패했습니다");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(comments);
      } else {
        alert("코멘트 정보를 가져오는 것을 실패 하였습니다");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(comments.concat(newComment));
  };

  if (videoDetail.writer) {
    const subscribeButton = videoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={videoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            ></video>

            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />
            </List.Item>

            <Comment
              postId={videoId}
              commentLists={comments}
              refreshFunction={refreshFunction}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>...loading</div>;
  }
}

export default VideoDetailPage;
