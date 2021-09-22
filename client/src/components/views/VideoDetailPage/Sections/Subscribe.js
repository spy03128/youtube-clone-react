import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };
    Axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 받아오지 못했습니다.");
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    Axios.post("/api/subscribe/subscribed", subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("정보를 받아오지 못했습니다");
        }
      }
    );
  }, []);

  const onSubscribe = () => {
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    //이미 구독중인 경우
    if (subscribed) {
      Axios.post("/api/subscribe/unSubscribe", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber - 1);
            setSubscribed(!subscribed);
          } else {
            alert("구독 취소하는데 실패 했습니다");
          }
        }
      );
    } else {
      //구독중이 아닌 경우
      Axios.post("/api/subscribe/subscribe", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber + 1);
            setSubscribed(!subscribed);
          } else {
            alert("구독 하는데 실패 했습니다");
          }
        }
      );
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubscribe}
      >
        {subscribeNumber} {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
