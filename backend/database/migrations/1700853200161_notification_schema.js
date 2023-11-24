'use strict';

const Schema = use('Schema');

class CreateNotificationsSchema extends Schema {
  up() {
    this.create('notifications', (table) => {
      table.increments();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
      table.string('message').notNullable();
      table.boolean('read').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('notifications');
  }
}

module.exports = CreateNotificationsSchema;

