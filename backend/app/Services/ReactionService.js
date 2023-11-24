// app/Services/ReactionService.js

const Reaction = use('App/Models/Reaction');

class ReactionService {
  async reactToPost(postId, userId, reactionType) {
    const existingReaction = await Reaction.query()
      .where('post_id', postId)
      .where('user_id', userId)
      .first();

    if (existingReaction) {
      existingReaction.reaction_type = reactionType;
      await existingReaction.save();
    } else {
      await Reaction.create({ post_id: postId, user_id: userId, reaction_type: reactionType });
    }
  }

  async getPostReactions(postId) {
    const reactions = await Reaction.query().where('post_id', postId).fetch();
    return reactions;
  }
}

module.exports = ReactionService;

