/**
 * Raiz Dating App - Subscription System
 * Main entry point
 */

// Models
const User = require('./models/User');
const Subscription = require('./models/Subscription');

// Configuration
const SubscriptionTiers = require('./config/subscription-tiers');
const InAppPurchases = require('./config/in-app-purchases');

// Paywalls
const OnboardingPaywall = require('./paywalls/OnboardingPaywall');
const LimitReachedPaywall = require('./paywalls/LimitReachedPaywall');
const GridUpsell = require('./paywalls/GridUpsell');
const PostMatchUpsell = require('./paywalls/PostMatchUpsell');
const SettingsUpgrade = require('./paywalls/SettingsUpgrade');

// Features
const LikeManager = require('./features/LikeManager');
const PurchaseManager = require('./features/PurchaseManager');

module.exports = {
  // Models
  User,
  Subscription,
  
  // Configuration
  SubscriptionTiers,
  InAppPurchases,
  
  // Paywalls
  OnboardingPaywall,
  LimitReachedPaywall,
  GridUpsell,
  PostMatchUpsell,
  SettingsUpgrade,
  
  // Features
  LikeManager,
  PurchaseManager
};
