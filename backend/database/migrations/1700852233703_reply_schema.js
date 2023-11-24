'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReplySchema extends Schema {
  up () {
    this.create('replies', (table) => {
      table.increments();
      table.integer('comment_id').unsigned().references('id').inTable('comments').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.text('content').notNullable();
      table.timestamps();
    });
  }

  down () {
    this.drop('replies')
  }
}

module.exports = ReplySchema
