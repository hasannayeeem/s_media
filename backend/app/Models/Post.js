'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
    static boot() {
        super.boot();
    
        this.addHook('afterDelete', async (postInstance) => {
          await postInstance.reactions().delete();
          await postInstance.comments().delete();
        });
      }
      user() {
        return this.belongsTo('App/Models/User');
      }
    
      reactions() {
        return this.hasMany('App/Models/Reaction');
      }
    
      comments() {
        return this.hasMany('App/Models/Comment');
      }
  }
  

module.exports = Post
