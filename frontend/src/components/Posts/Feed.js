// src/components/Feed.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button } from 'antd';
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import Post from './Post';
import { createPost, getPosts } from '../../Services/post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      await createPost({ content });
      fetchPosts();
      setContent('');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Card>
      <Form
          layout="vertical"
          onFinish={(values) => handleCreatePost(values.content)}
        >
          <Form.Item>
            <Input.TextArea
              rows={4}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
              Post
            </Button>
            <Button type="dashed" icon={<PictureOutlined />} style={{ marginLeft: '8px' }}>
              Add Image
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;