const { v4: uuidv4 } = require('uuid');

class ProfileHighlight {
  constructor(userId, durationHours = 24) {
    this.id = uuidv4();
    this.userId = userId;
    this.active = true;
    this.durationHours = durationHours;
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    this.price = this.calculatePrice(durationHours);
  }

  calculatePrice(durationHours) {
    // Pricing: $2 per 24 hours
    return (durationHours / 24) * 2.00;
  }

  isActive() {
    return this.active && this.expiresAt > new Date();
  }

  deactivate() {
    this.active = false;
  }
}

module.exports = ProfileHighlight;
