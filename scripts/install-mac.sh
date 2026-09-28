#!/bin/sh
# Installs the signed and notarized universal app for the current macOS user.
set -eu

base='https://github.com/will-krof/sketchspace/releases/latest/download'
name='Sketchspace-mac-universal.dmg'
work="$(mktemp -d)"
mount="$work/volume"
target_dir="$HOME/Applications"
target="$target_dir/Sketchspace.app"
incoming="$target_dir/.Sketchspace-new-$$.app"
backup="$target_dir/.Sketchspace-old-$$.app"
mounted=false

cleanup() {
  if [ "$mounted" = true ]; then hdiutil detach "$mount" -quiet || true; fi
  if [ -d "$backup" ] && [ ! -e "$target" ]; then mv "$backup" "$target"; fi
  rm -rf "$incoming" "$work"
}
trap cleanup EXIT HUP INT TERM

if pgrep -x Sketchspace >/dev/null; then
  echo 'Quit Sketchspace before installing a new version.' >&2
  exit 1
fi
curl -fLsS --retry 3 "$base/$name" -o "$work/$name"
curl -fLsS --retry 3 "$base/$name.sha512" -o "$work/$name.sha512"
expected="$(awk 'NR == 1 { print $1 }' "$work/$name.sha512")"
actual="$(shasum -a 512 "$work/$name" | awk '{ print $1 }')"
if [ "${#expected}" -ne 128 ] || [ "$actual" != "$expected" ]; then
  echo 'Installer checksum verification failed.' >&2
  exit 1
fi

mkdir -p "$mount" "$target_dir"
hdiutil attach "$work/$name" -nobrowse -readonly -quiet -mountpoint "$mount"
mounted=true
spctl --assess --type exec "$mount/Sketchspace.app"
ditto "$mount/Sketchspace.app" "$incoming"
codesign --verify --deep --strict "$incoming"
if [ -e "$target" ]; then mv "$target" "$backup"; fi
mv "$incoming" "$target"
rm -rf "$backup"
echo "Installed Sketchspace in $target"
open "$target"
