// src/components/Comment.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Comment as AntComment } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const Comment = ({ comment }) => {
  return (
    <AntComment
      author={comment.user.username}
      content={comment.content}
    />
  );
};

export default Comment;
