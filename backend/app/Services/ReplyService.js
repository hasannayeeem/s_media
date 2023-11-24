
// app/Services/ReplyService.js

const Reply = use('App/Models/Reply');

class ReplyService {
  async getCommentReplies(commentId) {
    const replies = await Reply.query().where('comment_id', commentId).fetch();
    return replies;
  }
}

module.exports = ReplyService;
