const { v4: uuidv4 } = require('uuid');

class User {
  constructor(username, email) {
    this.id = uuidv4();
    this.username = username;
    this.email = email;
    this.premiumTier = 'free'; // 'free', 'premium'
    this.likesRemaining = 10; // Free users get 10 likes per day
    this.lastLikesReset = new Date();
    this.boosts = [];
    this.profileHighlights = [];
    this.createdAt = new Date();
  }

  isPremium() {
    return this.premiumTier === 'premium';
  }

  hasActiveBooost() {
    const now = new Date();
    return this.boosts.some(boost => 
      boost.active && 
      boost.expiresAt > now
    );
  }

  hasActiveHighlight() {
    const now = new Date();
    return this.profileHighlights.some(highlight => 
      highlight.active && 
      highlight.expiresAt > now
    );
  }

  canLike() {
    if (this.isPremium()) {
      return true; // Premium users have unlimited likes
    }

    // Reset likes if a day has passed
    const now = new Date();
    const hoursSinceReset = (now - this.lastLikesReset) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 24) {
      this.likesRemaining = 10;
      this.lastLikesReset = now;
    }

    return this.likesRemaining > 0;
  }

  decrementLike() {
    if (!this.isPremium() && this.likesRemaining > 0) {
      this.likesRemaining--;
    }
  }
}

module.exports = User;
