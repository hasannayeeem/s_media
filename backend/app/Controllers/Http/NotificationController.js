// app/Controllers/Http/NotificationController.js
'use strict';

const Notification = use('App/Models/Notification');

class NotificationController {
  async index({ auth, response }) {
    try {
      const userId = auth.user.id;
      const notifications = await Notification.query().where('user_id', userId).orderBy('created_at', 'desc').fetch();
      return response.json(notifications);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async markAsRead({ auth, params, response }) {
    try {
      const { id: notificationId } = params;
      const userId = auth.user.id;

      const notification = await Notification.find(notificationId);

      if (!notification || notification.user_id !== userId) {
        return response.status(404).json({ error: 'Notification not found' });
      }

      notification.read = true;
      await notification.save();

      return response.json(notification);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = NotificationController;
