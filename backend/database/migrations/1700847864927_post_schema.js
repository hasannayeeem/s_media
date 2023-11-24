'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('content');
      table.string('image_url');
      table.timestamps();
    });
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
