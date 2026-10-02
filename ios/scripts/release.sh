#!/usr/bin/env bash
# 构建并(可选)上传 iOS App Store 包。
#   ios/scripts/release.sh            # 网页构建 + 归档 + 导出 IPA
#   ios/scripts/release.sh --upload   # 同上,并上传到 App Store Connect
# 需要 ~/.appstoreconnect/private_keys/AuthKey_$ASC_KEY_ID.p8
set -euo pipefail

TEAM_ID="${TEAM_ID:-6ZPXG4KVVS}"
ASC_KEY_ID="${ASC_KEY_ID:-U4QUAH53N9}"
ASC_ISSUER_ID="${ASC_ISSUER_ID:-8f41f165-4ec4-46b7-a529-634b024931f6}"
ASC_KEY_PATH="$HOME/.appstoreconnect/private_keys/AuthKey_${ASC_KEY_ID}.p8"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/ios/App/output/release"
AUTH=(-allowProvisioningUpdates
  -authenticationKeyPath "$ASC_KEY_PATH"
  -authenticationKeyID "$ASC_KEY_ID"
  -authenticationKeyIssuerID "$ASC_ISSUER_ID")

cd "$ROOT"
npm run app:build

# 每次上传的 build 号必须递增:用时间戳,版本号(MARKETING_VERSION)在 Xcode 里改
BUILD_NUMBER="${BUILD_NUMBER:-$(date +%Y%m%d%H%M)}"

rm -rf "$OUT" && mkdir -p "$OUT"
cd "$ROOT/ios/App"
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$OUT/App.xcarchive" \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER" "${AUTH[@]}" archive

cat > "$OUT/ExportOptions.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>$([[ "${1:-}" == "--upload" ]] && echo upload || echo export)</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>signingStyle</key><string>automatic</string>
  <key>uploadSymbols</key><true/>
  <key>manageAppVersionAndBuildNumber</key><false/>
</dict></plist>
EOF

xcodebuild -exportArchive -archivePath "$OUT/App.xcarchive" -exportPath "$OUT/export" \
  -exportOptionsPlist "$OUT/ExportOptions.plist" "${AUTH[@]}"

echo "build $BUILD_NUMBER -> $OUT/export"
