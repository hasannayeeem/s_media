'use strict'
import Route from "@ioc:Adonis/Core/Route";


//Auth Routes
import "App/Controllers/Http/Api/Auth/auth";
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

Route.get("/", async ({ response }) => {
  return response.json({ response: "Welcome to Scl Media API" });
});

Route.get("*", (ctx) => {
  return ctx.response
    .status(404)
    .send({ response: "Sorry, this route does not exist" });
});
