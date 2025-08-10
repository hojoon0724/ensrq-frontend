# Composer Photos

This directory contains composer photos for the ProgramTile component.

## File Naming Convention

Photos should be named using the composer's `composerId` with a `.jpg` extension:

- `{composerId}.jpg`

For example:

- `bach-js.jpg` for Johann Sebastian Bach
- `mozart-wa.jpg` for Wolfgang Amadeus Mozart
- `beethoven-l.jpg` for Ludwig van Beethoven

## Image Requirements

- Format: JPEG (.jpg)
- Recommended size: 200x200 pixels (square aspect ratio)
- The ProgramTile component will automatically resize to 64x64 pixels
- If a photo is not available, the component will show the composer's initials as a fallback

## Adding New Photos

1. Save the composer photo with the correct filename in this directory
2. The ProgramTile component will automatically detect and display the photo
3. No code changes are required when adding new photos
