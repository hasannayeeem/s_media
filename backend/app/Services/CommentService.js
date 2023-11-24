// app/Services/CommentService.js
'use strict';

const Comment = use('App/Models/Comment');

class CommentService {
  async getPostComments(postId) {
    const comments = await Comment.query().where('post_id', postId).fetch();
    return comments;
  }
}

module.exports = CommentService;
import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const createComment = async (postId, commentData) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comments`, commentData);
  return response.data;
};

export const getPostComments = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return response.data;
};

export const createReply = async (commentId, replyData) => {
  const response = await axios.post(`${API_URL}/comments/${commentId}/replies`, replyData);
  return response.data;
};

export const getCommentReplies = async (commentId) => {
  const response = await axios.get(`${API_URL}/comments/${commentId}/replies`);
  return response.data;
};
