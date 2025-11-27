const { v4: uuidv4 } = require('uuid');

class Boost {
  constructor(userId, durationMinutes = 30) {
    this.id = uuidv4();
    this.userId = userId;
    this.active = true;
    this.durationMinutes = durationMinutes;
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
    this.price = this.calculatePrice(durationMinutes);
  }

  calculatePrice(durationMinutes) {
    // Pricing: $1 per 10 minutes
    return (durationMinutes / 10) * 1.00;
  }

  isActive() {
    return this.active && this.expiresAt > new Date();
  }

  deactivate() {
    this.active = false;
  }
}

module.exports = Boost;
