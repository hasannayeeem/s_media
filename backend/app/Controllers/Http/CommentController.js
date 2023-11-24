// app/Controllers/Http/CommentController.js

const Comment = use('App/Models/Comment');
const ReactionService = use('App/Services/ReactionService');

class CommentController {
  async create({ auth, params, request, response }) {
    try {
      const { id: postId } = params;
      const userId = auth.user.id;
      const { content } = request.only(['content']);
      const comment = await Comment.create({ post_id: postId, user_id: userId, content });
      const reactionService = new ReactionService();
      const reactions = await reactionService.getPostReactions(comment.id);
      return response.json({ comment, reactions });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
  async update({ auth, params, request, response }) {
    try {
      const { id: commentId } = params;
      const userId = auth.user.id;
      const comment = await Comment.find(commentId);

      if (!comment) {
        return response.status(404).json({ error: 'Comment not found' });
      }

      if (comment.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      const { content } = request.only(['content']);
      comment.merge({ content });
      await comment.save();

      return response.json(comment);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async destroy({ auth, params, response }) {
    try {
      const { id: commentId } = params;
      const userId = auth.user.id;
      const comment = await Comment.find(commentId);

      if (!comment) {
        return response.status(404).json({ error: 'Comment not found' });
      }

      if (comment.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      await comment.delete();

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

}

module.exports = CommentController;

