// app/Controllers/Http/AuthController.js

const User = use('App/Models/User');
const Hash = use('Hash');
const Mail = use('Mail');
const Database = use('Database');
const PasswordReset = use('App/Models/PasswordReset');
const randomString = require('random-string');

class AuthController {
  async signup({ request, auth, response }) {
    try {
      const userData = request.only(['username', 'email', 'password']);
      const user = await User.create(userData);

      const token = await auth.generate(user);

      return response.json({
        user,
        token,
      });
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async login({ request, auth, response }) {
    try {
      const { email, password } = request.all();
      const token = await auth.attempt(email, password);

      return response.json({
        token,
      });
    } catch (error) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async logout({ auth, response }) {
    try {
      await auth.logout();
      return response.send('Logged out successfully');
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async sendPasswordResetEmail({ request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findBy('email', email);

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      const token = randomString({ length: 40 });
      await PasswordReset.create({ email, token });

      // Send reset email (you need to implement the email sending logic)
      // Example using Adonis.js Mail
      await Mail.send('emails.reset', { user, token }, (message) => {
        message
          .to(user.email)
          .from('your-email@example.com')
          .subject('Password reset request');
      });

      return response.send('Password reset email sent');
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  async resetPassword({ request, response }) {
    try {
      const { email, token, password } = request.all();
      const resetData = await PasswordReset.query().where({ email, token }).first();

      if (!resetData) {
        return response.status(404).json({ error: 'Invalid or expired token' });
      }

      const user = await User.findBy('email', email);
      user.password = await Hash.make(password);
      await user.save();

      // Delete the used token
      await resetData.delete();

      return response.send('Password reset successful');
    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
