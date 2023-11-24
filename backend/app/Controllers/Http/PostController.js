// app/Controllers/Http/PostController.js

const Post = use('App/Models/Post');

class PostController {
  async create({ auth, request, response }) {
    try {
      const user = await auth.getUser();
      const postData = request.only(['content', 'image_url']);
      const post = await user.posts().create(postData);

      return response.json(post);
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async update({ auth, params, request, response }) {
    try {
      const { id: postId } = params;
      const userId = auth.user.id;
      const post = await Post.find(postId);

      if (!post) {
        return response.status(404).json({ error: 'Post not found' });
      }

      if (post.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      const { content, image_url } = request.only(['content', 'image_url']);
      post.merge({ content, image_url });
      await post.save();

      return response.json(post);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async destroy({ auth, params, response }) {
    try {
      const { id: postId } = params;
      const userId = auth.user.id;
      const post = await Post.find(postId);

      if (!post) {
        return response.status(404).json({ error: 'Post not found' });
      }

      if (post.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      await post.delete();

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
  async index({ response }) {
    try {
      const posts = await Post.query().with('user').fetch();
      return response.json(posts);
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PostController;


