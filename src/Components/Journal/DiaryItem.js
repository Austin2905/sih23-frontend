import React from "react";
import { Icon } from '@iconify/react'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

export default function DiaryItem({ item, showModal, deleteItem }) {
  return (
    <div className="diary-row">
      <span onClick={() => showModal(item)}>{item.title}</span>
      <div>
        <span className="date">{item.date}</span>
        <Link to="/chat" state={{ message: item.text }}><Button className="share" variant="light">Share with Baymax</Button></Link>
        <Icon id="skipBtn" className="icon" icon="typcn:delete" height="30" onClick={() => deleteItem(item.id)}  />
      </div>
    </div>
  );
}
