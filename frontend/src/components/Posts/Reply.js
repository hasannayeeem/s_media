// src/components/Reply.js
import React from 'react';
import { Comment as AntComment } from 'antd';

const Reply = ({ reply }) => {
  return (
    <AntComment
      author={reply.user.username}
      content={reply.content}
    />
  );
};

export default Reply;
