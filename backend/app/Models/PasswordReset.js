class PasswordReset {
    // ... existing code ...
  
    user() {
      return this.belongsTo('App/Models/User');
    }
  }
  
  module.exports = PasswordReset;