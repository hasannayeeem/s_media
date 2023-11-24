'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReactionSchema extends Schema {
  up () {
    this.create('reactions', (table) => {
      table.increments();
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('reaction_type', 20).notNullable();
      table.timestamps();
    });
  }

  down () {
    this.drop('reactions')
  }
}

module.exports = ReactionSchema