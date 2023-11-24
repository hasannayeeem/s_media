// app/Controllers/Http/ReactionController.js

const ReactionService = use('App/Services/ReactionService');

class ReactionController {
  async reactToPost({ auth, params, request, response }) {
    try {
      const { id: postId } = params;
      const userId = auth.user.id;
      const { reactionType } = request.only(['reactionType']);

      const reactionService = new ReactionService();
      await reactionService.reactToPost(postId, userId, reactionType);

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPostReactions({ params, response }) {
    try {
      const { id: postId } = params;

      const reactionService = new ReactionService();
      const reactions = await reactionService.getPostReactions(postId);

      return response.json(reactions);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ReactionController;

