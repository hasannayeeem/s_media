// app/Controllers/Http/ReplyController.js

const Reply = use('App/Models/Reply');

class ReplyController {
  async create({ auth, params, request, response }) {
    try {
        const { id: commentId } = params;
        const userId = auth.user.id;
        const { content } = request.only(['content']);
        const reply = await Reply.create({ comment_id: commentId, user_id: userId, content });
        const reactionService = new ReactionService();
        const reactions = await reactionService.getPostReactions(reply.id);
  
        return response.json({ reply, reactions });
      } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
  async update({ auth, params, request, response }) {
    try {
      const { id: replyId } = params;
      const userId = auth.user.id;
      const reply = await Reply.find(replyId);

      if (!reply) {
        return response.status(404).json({ error: 'Reply not found' });
      }

      if (reply.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      const { content } = request.only(['content']);
      reply.merge({ content });
      await reply.save();

      return response.json(reply);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async destroy({ auth, params, response }) {
    try {
      const { id: replyId } = params;
      const userId = auth.user.id;
      const reply = await Reply.find(replyId);

      if (!reply) {
        return response.status(404).json({ error: 'Reply not found' });
      }

      if (reply.user_id !== userId) {
        return response.status(403).json({ error: 'Permission denied' });
      }

      await reply.delete();

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ReplyController;

