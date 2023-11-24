'use strict'

// start/routes.js

Route.group(() => {
    Route.post('auth/signup', 'AuthController.signup');
    Route.post('auth/login', 'AuthController.login');
    Route.post('auth/logout', 'AuthController.logout');
    Route.post('auth/password-reset', 'AuthController.sendPasswordResetEmail');
    Route.post('auth/reset-password', 'AuthController.resetPassword');
  }).prefix('api');
  
  Route.group(() => {
    // ... existing routes ...
  
    Route.post('posts', 'PostController.create').middleware('auth');
    Route.get('posts', 'PostController.index');
  }).prefix('api');
  // start/routes.js

Route.group(() => {
    // ... existing routes ...
  
    Route.post('posts/:id/react', 'ReactionController.reactToPost').middleware('auth');
    Route.get('posts/:id/reactions', 'ReactionController.getPostReactions');
  }).prefix('api');
  
Route.group(() => {
    // ... existing routes ...
  
    Route.post('posts/:id/comments', 'CommentController.create').middleware('auth');
    Route.post('comments/:id/replies', 'ReplyController.create').middleware('auth');
  }).prefix('api');

Route.group(() => {
    // ... existing routes ...
  
    Route.get('notifications', 'NotificationController.index').middleware('auth');
    Route.put('notifications/:id/mark-as-read', 'NotificationController.markAsRead').middleware('auth');
  }).prefix('api');
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
