// src/components/Message.tsx
import React, { Fragment } from "react";


const Message = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div
        style={{
          color: message.isUser ? "black" : "black",
          backgroundColor: message.isUser ? "#7ba7d3" : "#b7cde3",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {message.text.split("\n").map((text, index) => (
          <Fragment key={index}>
            {text}
            <br />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;