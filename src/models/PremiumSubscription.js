const { v4: uuidv4 } = require('uuid');

class PremiumSubscription {
  constructor(userId, plan = 'monthly') {
    this.id = uuidv4();
    this.userId = userId;
    this.plan = plan; // 'monthly', 'yearly'
    this.active = true;
    this.startDate = new Date();
    this.endDate = this.calculateEndDate(plan);
    this.price = this.calculatePrice(plan);
  }

  calculateEndDate(plan) {
    const startDate = new Date();
    if (plan === 'monthly') {
      return new Date(startDate.setMonth(startDate.getMonth() + 1));
    } else if (plan === 'yearly') {
      return new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    }
    return startDate;
  }

  calculatePrice(plan) {
    const prices = {
      'monthly': 9.99,
      'yearly': 99.99
    };
    return prices[plan] || 0;
  }

  isActive() {
    return this.active && this.endDate > new Date();
  }

  cancel() {
    this.active = false;
  }
}

module.exports = PremiumSubscription;
