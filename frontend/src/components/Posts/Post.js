// src/components/Post.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Comment, List } from 'antd';
import { LikeOutlined, LaughOutlined, SmileOutlined, HeartOutlined, AngryOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { reactToPost, getPostReactions, updatePost, deletePost } from '../services/reaction';
import { createComment, getPostComments, updateComment, deleteComment } from '../services/comment';
import { createReply, getCommentReplies, updateReply, deleteReply } from '../services/reply';

const Post = ({ post }) => {
  const [reactions, setReactions] = useState({
    like: 0,
    laugh: 0,
    love: 0,
    angry: 0,
  });

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleReact = async (reactionType) => {
    try {
      await reactToPost(post.id, reactionType);
      fetchReactions();
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await getPostReactions(post.id);
      setReactions(response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleCreateComment = async () => {
    try {
      await createComment(post.id, { content: newComment });
      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getPostComments(post.id);
      setComments(response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await updatePost(post.id, { content: editedContent });
      setEditing(false);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      // You may want to trigger a callback to update the posts list after deletion
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchReactions();
    fetchComments();
  }, [post.id]);

  return (
    <Card>
      <p>{post.user.username}</p>

      {isEditing ? (
        <Input.TextArea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{post.content}</p>
      )}

      {post.image_url && <img src={post.image_url} alt="Post" />}

      <div>
        <Button icon={<LikeOutlined />} onClick={() => handleReact('like')}>
          Like <Badge count={reactions.like} />
        </Button>
        <Button icon={<LaughOutlined />} onClick={() => handleReact('laugh')}>
          Laugh <Badge count={reactions.laugh} />
        </Button>
        <Button icon={<HeartOutlined />} onClick={() => handleReact('love')}>
          Love <Badge count={reactions.love} />
        </Button>
        <Button icon={<AngryOutlined />} onClick={() => handleReact('angry')}>
          Angry <Badge count={reactions.angry} />
        </Button>
      </div>

      {isEditing ? (
        <Button type="primary" onClick={handleUpdatePost}>
          Save
        </Button>
      ) : (
        <>
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleDeletePost} danger>
            Delete
          </Button>
        </>
      )}

      {/* Comment Section */}
      <Input.TextArea
        rows={4}
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button
        type="primary"
        icon={<SmileOutlined />}
        onClick={handleCreateComment}
        style={{ marginTop: '8px' }}
      >
        Comment
      </Button>

      {/* List of Comments */}
      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item>
            <Comment comment={comment} />
            {/* Add a button to show/hide replies for this comment */}
            {/* Example: <Button onClick={() => handleToggleReplies(comment.id)}>Show Replies</Button> */}
            {/* You can implement a similar mechanism for replies */}
            {/* <List
              dataSource={replies[comment.id] || []}
              renderItem={(reply) => (
                <List.Item>
                  <ReplyComponent reply={reply} />
                </List.Item>
              )}
            /> */}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Post;
