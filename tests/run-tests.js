const assert = require('assert');
const User = require('../src/models/User');
const Boost = require('../src/models/Boost');
const ProfileHighlight = require('../src/models/ProfileHighlight');
const PremiumSubscription = require('../src/models/PremiumSubscription');
const monetizationService = require('../src/services/MonetizationService');
const userService = require('../src/services/UserService');

console.log('Running tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    testsFailed++;
  }
}

// Test User Model
test('User model - free user has limited likes', () => {
  const user = new User('testuser', 'test@example.com');
  assert.strictEqual(user.premiumTier, 'free');
  assert.strictEqual(user.likesRemaining, 10);
  assert.strictEqual(user.isPremium(), false);
});

test('User model - premium user check', () => {
  const user = new User('premiumuser', 'premium@example.com');
  user.premiumTier = 'premium';
  assert.strictEqual(user.isPremium(), true);
  assert.strictEqual(user.canLike(), true);
});

test('User model - free user can like when has remaining likes', () => {
  const user = new User('testuser', 'test@example.com');
  assert.strictEqual(user.canLike(), true);
  user.decrementLike();
  assert.strictEqual(user.likesRemaining, 9);
});

test('User model - free user cannot like when limit reached', () => {
  const user = new User('testuser', 'test@example.com');
  user.likesRemaining = 0;
  assert.strictEqual(user.canLike(), false);
});

test('User model - premium user has unlimited likes', () => {
  const user = new User('premiumuser', 'premium@example.com');
  user.premiumTier = 'premium';
  user.decrementLike();
  assert.strictEqual(user.canLike(), true);
});

// Test Boost Model
test('Boost model - creates boost with correct duration', () => {
  const boost = new Boost('user123', 30);
  assert.strictEqual(boost.userId, 'user123');
  assert.strictEqual(boost.durationMinutes, 30);
  assert.strictEqual(boost.active, true);
  assert.strictEqual(boost.price, 3.00);
});

test('Boost model - calculates correct price', () => {
  const boost30 = new Boost('user123', 30);
  assert.strictEqual(boost30.price, 3.00);
  
  const boost60 = new Boost('user123', 60);
  assert.strictEqual(boost60.price, 6.00);
});

test('Boost model - isActive returns true when active and not expired', () => {
  const boost = new Boost('user123', 30);
  assert.strictEqual(boost.isActive(), true);
});

// Test ProfileHighlight Model
test('ProfileHighlight model - creates highlight with correct duration', () => {
  const highlight = new ProfileHighlight('user123', 24);
  assert.strictEqual(highlight.userId, 'user123');
  assert.strictEqual(highlight.durationHours, 24);
  assert.strictEqual(highlight.active, true);
  assert.strictEqual(highlight.price, 2.00);
});

test('ProfileHighlight model - calculates correct price', () => {
  const highlight24 = new ProfileHighlight('user123', 24);
  assert.strictEqual(highlight24.price, 2.00);
  
  const highlight48 = new ProfileHighlight('user123', 48);
  assert.strictEqual(highlight48.price, 4.00);
});

// Test PremiumSubscription Model
test('PremiumSubscription model - creates monthly subscription', () => {
  const sub = new PremiumSubscription('user123', 'monthly');
  assert.strictEqual(sub.userId, 'user123');
  assert.strictEqual(sub.plan, 'monthly');
  assert.strictEqual(sub.price, 9.99);
  assert.strictEqual(sub.active, true);
});

test('PremiumSubscription model - creates yearly subscription', () => {
  const sub = new PremiumSubscription('user123', 'yearly');
  assert.strictEqual(sub.plan, 'yearly');
  assert.strictEqual(sub.price, 99.99);
});

// Test MonetizationService
test('MonetizationService - purchase boost', () => {
  const result = monetizationService.purchaseBoost('testuser1', 30);
  assert.strictEqual(result.success, true);
  assert.ok(result.boost);
  assert.strictEqual(result.boost.durationMinutes, 30);
});

test('MonetizationService - get active boosts', () => {
  const userId = 'testuser2';
  monetizationService.purchaseBoost(userId, 30);
  const boosts = monetizationService.getActiveBoosts(userId);
  assert.strictEqual(boosts.length, 1);
});

test('MonetizationService - purchase highlight', () => {
  const result = monetizationService.purchaseHighlight('testuser3', 24);
  assert.strictEqual(result.success, true);
  assert.ok(result.highlight);
  assert.strictEqual(result.highlight.durationHours, 24);
});

test('MonetizationService - get active highlights', () => {
  const userId = 'testuser4';
  monetizationService.purchaseHighlight(userId, 24);
  const highlights = monetizationService.getActiveHighlights(userId);
  assert.strictEqual(highlights.length, 1);
});

test('MonetizationService - purchase premium subscription', () => {
  const result = monetizationService.purchasePremium('testuser5', 'monthly');
  assert.strictEqual(result.success, true);
  assert.ok(result.subscription);
  assert.strictEqual(result.subscription.plan, 'monthly');
});

test('MonetizationService - get premium status', () => {
  const userId = 'testuser6';
  monetizationService.purchasePremium(userId, 'monthly');
  const status = monetizationService.getPremiumStatus(userId);
  assert.strictEqual(status.isPremium, true);
  assert.strictEqual(status.hasUnlimitedLikes, true);
});

test('MonetizationService - cancel premium subscription', () => {
  const userId = 'testuser7';
  monetizationService.purchasePremium(userId, 'monthly');
  const result = monetizationService.cancelPremium(userId);
  assert.strictEqual(result.success, true);
});

// Test UserService
test('UserService - create user', () => {
  const user = userService.createUser('john_doe', 'john@example.com');
  assert.ok(user.id);
  assert.strictEqual(user.username, 'john_doe');
  assert.strictEqual(user.email, 'john@example.com');
  assert.strictEqual(user.premiumTier, 'free');
});

test('UserService - get user', () => {
  const user = userService.createUser('jane_doe', 'jane@example.com');
  const retrieved = userService.getUser(user.id);
  assert.strictEqual(retrieved.id, user.id);
  assert.strictEqual(retrieved.username, 'jane_doe');
});

test('UserService - update premium status', () => {
  const user = userService.createUser('premium_user', 'premium@example.com');
  const updated = userService.updateUserPremiumStatus(user.id, true);
  assert.strictEqual(updated.premiumTier, 'premium');
});

test('UserService - record like for free user', () => {
  const user = userService.createUser('free_user', 'free@example.com');
  const result = userService.recordLike(user.id);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.likesRemaining, 9);
});

test('UserService - record like fails when limit reached', () => {
  const user = userService.createUser('limited_user', 'limited@example.com');
  user.likesRemaining = 0;
  const result = userService.recordLike(user.id);
  assert.strictEqual(result.success, false);
  assert.ok(result.message.includes('limit reached'));
});

test('UserService - premium user has unlimited likes', () => {
  const user = userService.createUser('premium_user2', 'premium2@example.com');
  userService.updateUserPremiumStatus(user.id, true);
  const result = userService.recordLike(user.id);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.likesRemaining, 'unlimited');
});

test('UserService - get user profile', () => {
  const user = userService.createUser('profile_user', 'profile@example.com');
  const profile = userService.getUserProfile(user.id);
  assert.ok(profile);
  assert.strictEqual(profile.username, 'profile_user');
  assert.ok(profile.monetization);
});

// Test Integration - Full User Journey
test('Integration - user upgrades to premium and gets unlimited likes', () => {
  const user = userService.createUser('journey_user', 'journey@example.com');
  
  // User starts as free with limited likes
  assert.strictEqual(user.premiumTier, 'free');
  assert.strictEqual(user.likesRemaining, 10);
  
  // User purchases premium
  monetizationService.purchasePremium(user.id, 'monthly');
  userService.updateUserPremiumStatus(user.id, true);
  
  // User now has unlimited likes
  const updatedUser = userService.getUser(user.id);
  assert.strictEqual(updatedUser.premiumTier, 'premium');
  assert.strictEqual(updatedUser.canLike(), true);
});

test('Integration - user purchases boost and highlight', () => {
  const user = userService.createUser('power_user', 'power@example.com');
  
  // Purchase boost
  const boostResult = monetizationService.purchaseBoost(user.id, 60);
  assert.strictEqual(boostResult.success, true);
  
  // Purchase highlight
  const highlightResult = monetizationService.purchaseHighlight(user.id, 48);
  assert.strictEqual(highlightResult.success, true);
  
  // Check status
  const status = monetizationService.getUserMonetizationStatus(user.id);
  assert.strictEqual(status.activeBoosts, 1);
  assert.strictEqual(status.activeHighlights, 1);
});

// Print results
console.log('\n' + '='.repeat(50));
console.log(`Tests completed: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
