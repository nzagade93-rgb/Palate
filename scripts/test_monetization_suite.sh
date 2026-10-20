#!/bin/bash
set -e

BASE_URL="http://localhost:3000"
echo "================================================================="
echo "PALATE MONETIZATION TEST SUITE — SCENARIO VALIDATION"
echo "================================================================="

# ----------------------------------------------------------------------
# TEST 1: Monetization is disabled by default & stats are empty
# ----------------------------------------------------------------------
echo -n "[Test 1] Verifying monetization is disabled by default... "
SETTINGS_JSON=$(curl -s "$BASE_URL/api/monetization/settings")
MONETIZATION_ENABLED=$(echo "$SETTINGS_JSON" | grep -o '"monetization_enabled":false' || true)
if [ -n "$MONETIZATION_ENABLED" ]; then
  echo "PASSED (monetization_enabled=false)"
else
  echo "FAILED: $SETTINGS_JSON"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 2: Direct API call to create campaign when disabled fails (HTTP 403)
# ----------------------------------------------------------------------
echo -n "[Test 2] Direct API call to create campaign when disabled is rejected... "
CREATE_RES=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/monetization/campaigns" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"res_yasins","restaurantName":"Yasin'\''s Food Inn","packageId":"pkg_starter_battle","campaignName":"Hack Attempt"}')
HTTP_CODE=$(echo "$CREATE_RES" | tail -n1)
BODY=$(echo "$CREATE_RES" | sed '$d')
if [ "$HTTP_CODE" -eq 403 ] || echo "$BODY" | grep -q "disabled"; then
  echo "PASSED (Rejected with HTTP $HTTP_CODE: $BODY)"
else
  echo "FAILED: HTTP $HTTP_CODE - $BODY"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 3: Direct API call to checkout when disabled fails (HTTP 403)
# ----------------------------------------------------------------------
echo -n "[Test 3] Checkout endpoint rejects requests when monetization is OFF... "
CHECKOUT_RES=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/monetization/checkout" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"camp_dummy_123"}')
CHECKOUT_CODE=$(echo "$CHECKOUT_RES" | tail -n1)
CHECKOUT_BODY=$(echo "$CHECKOUT_RES" | sed '$d')
if [ "$CHECKOUT_CODE" -eq 403 ] || echo "$CHECKOUT_BODY" | grep -q "disabled"; then
  echo "PASSED (Rejected with HTTP $CHECKOUT_CODE)"
else
  echo "FAILED: HTTP $CHECKOUT_CODE - $CHECKOUT_BODY"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 4: Enabling one feature does NOT automatically enable others
# ----------------------------------------------------------------------
echo -n "[Test 4] Enabling Master + Sponsored Battles only... "
ENABLE_RES=$(curl -s -X POST "$BASE_URL/api/monetization/settings" \
  -H "Content-Type: application/json" \
  -d '{"settings":{"monetization_enabled":true,"sponsored_battles_enabled":true},"actor":"admin_test"}')
CHAMPION_ENABLED=$(echo "$ENABLE_RES" | grep -o '"champion_packages_enabled":false' || true)
OFFERS_ENABLED=$(echo "$ENABLE_RES" | grep -o '"restaurant_offers_enabled":false' || true)
if [ -n "$CHAMPION_ENABLED" ] && [ -n "$OFFERS_ENABLED" ]; then
  echo "PASSED (Champion & Offers remain FALSE)"
else
  echo "FAILED: $ENABLE_RES"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 5: Creating a Champion campaign fails when champion_packages_enabled is false
# ----------------------------------------------------------------------
echo -n "[Test 5] Champion campaign rejected while champion_packages_enabled=false... "
CHAMP_RES=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/monetization/champion" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"res_yasins","battleId":"battle_completed_winner_06","packageId":"pkg_champion_spotlight"}')
CHAMP_CODE=$(echo "$CHAMP_RES" | tail -n1)
CHAMP_BODY=$(echo "$CHAMP_RES" | sed '$d')
if [ "$CHAMP_CODE" -eq 403 ] || echo "$CHAMP_BODY" | grep -q "disabled"; then
  echo "PASSED (Rejected with HTTP $CHAMP_CODE)"
else
  echo "FAILED: HTTP $CHAMP_CODE - $CHAMP_BODY"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 6: Creating a Sponsored Battle now SUCCEEDS (since it was enabled)
# ----------------------------------------------------------------------
echo -n "[Test 6] Creating Sponsored Battle campaign succeeds... "
SUBMIT_CAMP=$(curl -s -X POST "$BASE_URL/api/monetization/campaigns" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"res_yasins","restaurantName":"Yasin'\''s Food Inn","packageId":"pkg_starter_battle","campaignName":"Yasin'\''s Dum Spotlight"}')
CAMP_ID=$(echo "$SUBMIT_CAMP" | grep -o '"id":"camp_[^"]*' | head -n1 | cut -d'"' -f4)
if [ -n "$CAMP_ID" ]; then
  echo "PASSED (Created campaign ID: $CAMP_ID)"
else
  echo "FAILED: $SUBMIT_CAMP"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 7: Attempting to activate campaign without payment fails
# ----------------------------------------------------------------------
echo -n "[Test 7] Activating campaign without payment fails... "
ACT_RES=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/api/monetization/campaigns" \
  -H "Content-Type: application/json" \
  -d "{\"campaignId\":\"$CAMP_ID\",\"status\":\"active\",\"actor\":\"admin_test\"}")
ACT_CODE=$(echo "$ACT_RES" | tail -n1)
ACT_BODY=$(echo "$ACT_RES" | sed '$d')
if [ "$ACT_CODE" -eq 403 ] || echo "$ACT_BODY" | grep -q "Payment has not been completed"; then
  echo "PASSED (Activation rejected: Payment required)"
else
  echo "FAILED: HTTP $ACT_CODE - $ACT_BODY"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 8: Approving campaign & recording payment
# ----------------------------------------------------------------------
echo -n "[Test 8] Approving campaign & recording pilot payment... "
curl -s -X PATCH "$BASE_URL/api/monetization/campaigns" \
  -H "Content-Type: application/json" \
  -d "{\"campaignId\":\"$CAMP_ID\",\"status\":\"approved\",\"actor\":\"admin_test\"}" > /dev/null

PAY_RES=$(curl -s -X POST "$BASE_URL/api/monetization/webhook" \
  -H "Content-Type: application/json" \
  -d "{\"campaignId\":\"$CAMP_ID\",\"providerOrderId\":\"order_pilot_001\",\"providerPaymentId\":\"pay_pilot_001\",\"idempotencyKey\":\"idemp_test_$CAMP_ID\",\"isPilot\":true}")
if echo "$PAY_RES" | grep -q '"success":true'; then
  echo "PASSED (Payment recorded)"
else
  echo "FAILED: $PAY_RES"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 9: Duplicate payment webhook is rejected (Idempotency)
# ----------------------------------------------------------------------
echo -n "[Test 9] Duplicate payment webhook rejected by idempotency key... "
DUP_PAY=$(curl -s -X POST "$BASE_URL/api/monetization/webhook" \
  -H "Content-Type: application/json" \
  -d "{\"campaignId\":\"$CAMP_ID\",\"providerOrderId\":\"order_pilot_001\",\"providerPaymentId\":\"pay_pilot_001\",\"idempotencyKey\":\"idemp_test_$CAMP_ID\",\"isPilot\":true}")
if echo "$DUP_PAY" | grep -q 'Duplicate payment transaction'; then
  echo "PASSED (Idempotency enforced)"
else
  echo "FAILED: $DUP_PAY"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 10: Now activation succeeds after payment
# ----------------------------------------------------------------------
echo -n "[Test 10] Activating paid campaign... "
ACT_PAID=$(curl -s -X PATCH "$BASE_URL/api/monetization/campaigns" \
  -H "Content-Type: application/json" \
  -d "{\"campaignId\":\"$CAMP_ID\",\"status\":\"active\",\"actor\":\"admin_test\"}")
if echo "$ACT_PAID" | grep -q '"status":"active"'; then
  echo "PASSED (Campaign is now ACTIVE)"
else
  echo "FAILED: $ACT_PAID"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 11: Enabling Offers & Testing Single-Use Anti-Fraud Redemption
# ----------------------------------------------------------------------
echo -n "[Test 11] Enabling Offers and testing single-use redemption... "
curl -s -X POST "$BASE_URL/api/monetization/settings" \
  -H "Content-Type: application/json" \
  -d '{"settings":{"restaurant_offers_enabled":true},"actor":"admin_test"}' > /dev/null

RED_RES1=$(curl -s -X POST "$BASE_URL/api/monetization/offers/redeem" \
  -H "Content-Type: application/json" \
  -d '{"offerId":"offer_demo_yasins_30","consumerFingerprint":"diner_device_xyz","couponCode":"PALATEYASIN30"}')
if echo "$RED_RES1" | grep -q '"success":true'; then
  echo "PASSED (First redemption accepted)"
else
  echo "FAILED: $RED_RES1"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 12: Duplicate redemption for same consumer fingerprint is rejected
# ----------------------------------------------------------------------
echo -n "[Test 12] Duplicate redemption rejected for same fingerprint... "
RED_RES2=$(curl -s -X POST "$BASE_URL/api/monetization/offers/redeem" \
  -H "Content-Type: application/json" \
  -d '{"offerId":"offer_demo_yasins_30","consumerFingerprint":"diner_device_xyz","couponCode":"PALATEYASIN30"}')
if echo "$RED_RES2" | grep -q 'already redeemed'; then
  echo "PASSED (Duplicate redemption blocked)"
else
  echo "FAILED: $RED_RES2"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 13: Enabling Champion Packages & Testing Organic Victory Requirement
# ----------------------------------------------------------------------
echo -n "[Test 13] Champion package requires verified victory... "
curl -s -X POST "$BASE_URL/api/monetization/settings" \
  -H "Content-Type: application/json" \
  -d '{"settings":{"champion_packages_enabled":true},"actor":"admin_test"}' > /dev/null

# Non-winner attempting to claim
FAKE_CHAMP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/monetization/champion" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"res_fake_loser","restaurantName":"Fake Stall","battleId":"battle_completed_winner_06","packageId":"pkg_champion_spotlight"}')
FAKE_CODE=$(echo "$FAKE_CHAMP" | tail -n1)
FAKE_BODY=$(echo "$FAKE_CHAMP" | sed '$d')
if [ "$FAKE_CODE" -eq 403 ] || echo "$FAKE_BODY" | grep -q "Only the verified winning restaurant"; then
  echo "PASSED (Fake winner rejected with HTTP $FAKE_CODE)"
else
  echo "FAILED: HTTP $FAKE_CODE - $FAKE_BODY"
  exit 1
fi

# Real winner (Yasin's Food Inn) claiming
REAL_CHAMP=$(curl -s -X POST "$BASE_URL/api/monetization/champion" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"res_yasins","restaurantName":"Yasin'\''s Food Inn","battleId":"battle_completed_winner_06","packageId":"pkg_champion_spotlight"}')
if echo "$REAL_CHAMP" | grep -q '"success":true'; then
  echo "PASSED (Real winner Yasin'\''s successfully claimed Champion package)"
else
  echo "FAILED: $REAL_CHAMP"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 14: Verifying Audit Logs
# ----------------------------------------------------------------------
echo -n "[Test 14] Administrative audit log records all actions... "
AUDIT_RES=$(curl -s "$BASE_URL/api/monetization/audit")
AUDIT_COUNT=$(echo "$AUDIT_RES" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ "$AUDIT_COUNT" -gt 3 ]; then
  echo "PASSED ($AUDIT_COUNT audit entries recorded)"
else
  echo "FAILED: $AUDIT_RES"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 15: Disabling monetization does NOT erase financial records
# ----------------------------------------------------------------------
echo -n "[Test 15] Disabling monetization preserves financial records... "
curl -s -X POST "$BASE_URL/api/monetization/settings" \
  -H "Content-Type: application/json" \
  -d '{"settings":{"monetization_enabled":false,"sponsored_battles_enabled":false,"champion_packages_enabled":false,"restaurant_offers_enabled":false},"actor":"admin_test"}' > /dev/null

VERIFY_STATS=$(curl -s "$BASE_URL/api/monetization/settings")
REVENUE=$(echo "$VERIFY_STATS" | grep -o '"totalRevenuePaise":[0-9]*' | cut -d':' -f2)
if [ "$REVENUE" -gt 0 ]; then
  echo "PASSED (Revenue preserved: $REVENUE paise, master switch is back OFF)"
else
  echo "FAILED: $VERIFY_STATS"
  exit 1
fi

# ----------------------------------------------------------------------
# TEST 16: Organic voting is unaffected
# ----------------------------------------------------------------------
echo -n "[Test 16] Organic food battle voting remains intact... "
VOTE_RES=$(curl -s -X POST "$BASE_URL/api/vote" \
  -H "Content-Type: application/json" \
  -d '{"battle_id":"battle_vada_pav_01","chosen_restaurant_id":"cont_vashi_vadapav","voter_fingerprint":"curl_monetization_verifier"}')
if echo "$VOTE_RES" | grep -q '"success":true'; then
  echo "PASSED (Organic voting works 100%)"
else
  echo "FAILED: $VOTE_RES"
  exit 1
fi

echo "================================================================="
echo "ALL 16 MONETIZATION SCENARIOS PASSED WITH ZERO ERRORS!"
echo "================================================================="
