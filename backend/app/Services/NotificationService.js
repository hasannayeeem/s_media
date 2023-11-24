// app/Services/NotificationService.js
'use strict';

const Notification = use('App/Models/Notification');

class NotificationService {
  async createNotification(userId, message) {
    await Notification.create({ user_id: userId, message });
  }
}

module.exports = NotificationService;
