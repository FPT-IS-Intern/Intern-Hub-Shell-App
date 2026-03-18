#!/bin/sh
set -eu

TEMPLATE_FILE="/usr/share/nginx/html/env.js.template"
OUTPUT_FILE="/usr/share/nginx/html/env.js"

if [ ! -f "$TEMPLATE_FILE" ]; then
  exit 0
fi

envsubst '${FIREBASE_API_KEY} ${FIREBASE_AUTH_DOMAIN} ${FIREBASE_PROJECT_ID} ${FIREBASE_STORAGE_BUCKET} ${FIREBASE_MESSAGING_SENDER_ID} ${FIREBASE_APP_ID} ${FIREBASE_MEASUREMENT_ID} ${FIREBASE_VAPID_KEY}' < "$TEMPLATE_FILE" > "$OUTPUT_FILE"
