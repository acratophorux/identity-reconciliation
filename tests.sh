#!/bin/bash

# this is for using github codespaces; when serving/deploying elsewhere, modify the base url
BASE_URL="https://vigilant-space-acorn-wg475pxjp9rcgv6j-3000.app.github.dev/identify"

post() {
  echo -e "\n $1"
  curl -s -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "$2" | jq
}

echo " Running Identity Reconciliation Tests..."

# 1: when there is no match
post " 1: New primary (a1@example.com, 1111111111)" \
'{"email": "a1@example.com", "phoneNumber": "1111111111"}'

#  2: when there is match by phone
post " 2: Match by phone, new email (a2@example.com)" \
'{"email": "a2@example.com", "phoneNumber": "1111111111"}'

# 3: when there is match by email 
post " 3: Match by email, new phone (2222222222)" \
'{"email": "a2@example.com", "phoneNumber": "2222222222"}'

# 4: when there is exact match 
post " 4: Match by both (should NOT create new row)" \
'{"email": "a2@example.com", "phoneNumber": "1111111111"}'

#5:when two primaries merged
# TODO: MERGE DOES NOT WORK PROPERLY RIGHT NOW; WHY: A NEW ID IS CREATED INSTEAD OF DEMOTING ONE TO SECONDARY.
post "5a: New primary (b1@example.com, 3333333333)" \
'{"email": "b1@example.com", "phoneNumber": "3333333333"}'

post "5b: New primary (b2@example.com, 4444444444)" \
'{"email": "b2@example.com", "phoneNumber": "4444444444"}'

post "5c: Merge primaries via common contact (b1 email + b2 phone)" \
'{"email": "b1@example.com", "phoneNumber": "4444444444"}'

echo -e "\n Done!"