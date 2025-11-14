/**
 * Raiz Dating App - Usage Examples
 * Demonstrates the subscription system functionality
 */

const {
  User,
  Subscription,
  SubscriptionTiers,
  OnboardingPaywall,
  LimitReachedPaywall,
  GridUpsell,
  PostMatchUpsell,
  SettingsUpgrade,
  LikeManager,
  PurchaseManager
} = require('../src');

console.log('=== Raiz Dating App - Subscription System Demo ===\n');

// Example 1: Creating a new user
console.log('1. Creating a New User');
console.log('-------------------');
const user = new User('user123', 'John Doe', 'john@example.com');
console.log(`User created: ${user.name}`);
console.log(`Current tier: ${user.subscription.getTierName()}`);
console.log(`Tagline: ${user.subscription.getTierTagline()}`);
console.log(`Daily like limit: ${user.subscription.getLikeLimit()}`);
console.log();

// Example 2: Onboarding Paywall
console.log('2. Onboarding Paywall');
console.log('-------------------');
const onboardingPaywall = OnboardingPaywall.getPaywallContent();
console.log(`Title: ${onboardingPaywall.title}`);
console.log('Tiers available:');
onboardingPaywall.tiers.forEach(tier => {
  console.log(`  - ${tier.name}: ${tier.tagline}`);
  console.log(`    Price: $${tier.pricing.monthly}/month`);
  if (tier.highlighted) {
    console.log(`    ⭐ ${tier.badge || 'Featured'}`);
  }
});
console.log();

// Example 3: Processing likes
console.log('3. Processing Likes');
console.log('-------------------');
for (let i = 1; i <= 27; i++) {
  const result = LikeManager.processLike(user, `target_${i}`);
  
  if (i <= 25) {
    console.log(`Like ${i}: Success. Remaining: ${result.remainingLikes}`);
  } else {
    console.log(`Like ${i}: ${result.error} - ${result.message}`);
    
    if (!result.success) {
      // Show paywall
      const paywall = LimitReachedPaywall.getDailyLikeLimitPaywall();
      console.log(`\nPaywall triggered:`);
      console.log(`  Title: ${paywall.title}`);
      console.log(`  Message: ${paywall.message}`);
      console.log(`  CTA: ${paywall.cta.primary}`);
      break;
    }
  }
}
console.log();

// Example 4: Upgrading to Plus
console.log('4. Upgrading to Raiz Plus');
console.log('-------------------');
const upgraded = user.subscription.upgradeTo(
  SubscriptionTiers.SUBSCRIPTION_TIERS.PLUS,
  'monthly'
);
console.log(`Upgrade successful: ${upgraded}`);
console.log(`New tier: ${user.subscription.getTierName()}`);
console.log(`Unlimited likes: ${user.subscription.hasUnlimitedLikes()}`);
console.log(`Can see who liked you: ${user.subscription.canSeeWhoLikedYou()}`);
console.log(`Boosts per week: ${user.subscription.getBoostsIncluded()}`);
console.log();

// Example 5: Purchasing and using a boost
console.log('5. Purchasing and Using Boosts');
console.log('-------------------');
const boostModal = PurchaseManager.getBoostPurchaseModal();
console.log(`Purchase modal: ${boostModal.title}`);
console.log(`Packages available:`);
boostModal.packages.forEach(pkg => {
  console.log(`  - ${pkg.name}: ${pkg.quantity} boost(s) for $${pkg.price}`);
  if (pkg.savings) {
    console.log(`    Save ${pkg.savings}%!`);
  }
});

// Simulate purchase completion
user.addToInventory('boosts', 5);
console.log(`\nBoosts added to inventory: ${user.inventory.boosts}`);

// Use a boost
const boostUsed = user.useBoost();
console.log(`Boost activated: ${boostUsed}`);
console.log(`Boost active: ${user.hasActiveBoost()}`);
console.log(`Remaining boosts: ${user.inventory.boosts}`);
console.log();

// Example 6: Visibility status
console.log('6. Visibility Status');
console.log('-------------------');
const visibility = LikeManager.getVisibilityStatus(user);
console.log(`Visibility multiplier: ${visibility.multiplier}x`);
console.log(`Description: ${visibility.description}`);
console.log(`Boost active: ${visibility.boostActive}`);
console.log(`Grid priority: ${visibility.gridPriority}`);
console.log();

// Example 7: Grid Upsell
console.log('7. Grid Upsell Cards');
console.log('-------------------');
const upsellCard = GridUpsell.getBoostUpsellCard();
console.log(`Card type: ${upsellCard.type}`);
console.log(`Title: ${upsellCard.title}`);
console.log(`Headline: ${upsellCard.headline}`);
console.log(`Description: ${upsellCard.description}`);
console.log();

// Example 8: Post-Match Upsell
console.log('8. Post-Match Upsell');
console.log('-------------------');
const postMatchUpsell = PostMatchUpsell.getPostMatchUpsell({
  hasReachedLikeLimit: false,
  hasActiveBoost: true,
  subscriptionTier: SubscriptionTiers.SUBSCRIPTION_TIERS.PLUS,
  matchCount: 5
});
console.log(`Upsell type: ${postMatchUpsell.type}`);
console.log(`Title: ${postMatchUpsell.title}`);
if (postMatchUpsell.message) {
  console.log(`Message: ${postMatchUpsell.message}`);
}
console.log();

// Example 9: Settings Upgrade Banner
console.log('9. Settings Upgrade Banner');
console.log('-------------------');
const banner = SettingsUpgrade.getUpgradeBanner(
  SubscriptionTiers.SUBSCRIPTION_TIERS.PLUS
);
if (banner) {
  console.log(`Banner title: ${banner.title}`);
  console.log(`Tagline: ${banner.tagline}`);
  console.log(`Price: ${banner.price}`);
  console.log('Benefits:');
  banner.benefits.forEach(benefit => {
    console.log(`  - ${benefit}`);
  });
}
console.log();

// Example 10: Feature Comparison
console.log('10. Feature Comparison Table');
console.log('-------------------');
const comparison = SettingsUpgrade.getComparisonTable();
console.log(`Title: ${comparison.title}`);
console.log('\nTiers:');
comparison.tiers.forEach(tier => {
  console.log(`  - ${tier.name}: ${tier.price}`);
});
console.log('\nSample features:');
comparison.features[0].items.forEach(item => {
  console.log(`  ${item.feature}:`);
  console.log(`    Basic: ${item.basic}, Plus: ${item.plus}, Flame: ${item.flame}`);
});
console.log();

// Example 11: User Summary
console.log('11. Complete User Summary');
console.log('-------------------');
const summary = user.getSummary();
console.log(JSON.stringify(summary, null, 2));
console.log();

console.log('=== Demo Complete ===');
