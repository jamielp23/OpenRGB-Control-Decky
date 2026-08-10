# OpenRGB Control for Decky

A small modern Decky Loader plugin for SteamOS Gaming Mode.

## Controls

- 🎮 Steam -> `Steam.orp`
- 🎮 Xbox -> `Xbox.orp`
- 🌈 Rainbow -> `Rainbow.orp`
- ⚪ White -> `White.orp`
- ⚫ Off -> `Off.orp`

## Backend

The plugin calls the SteamOS system Flatpak executable explicitly:

`/usr/bin/flatpak run org.openrgb.OpenRGB --profile "<profile>.orp"`

This avoids the bundled `flatpak`/libcrypto problem encountered inside Decky's backend environment.

## Build

The Steam Machine does not need Node.js, npm, pnpm or TypeScript.

This repository includes a GitHub Actions workflow that builds the frontend and produces an installable ZIP artifact.

After the GitHub Action finishes, download the artifact named `OpenRGB-Control-Decky-v0.1.0`, extract the ZIP, and install the resulting plugin ZIP through Decky.

## Assumptions

OpenRGB Flatpak is installed and these profiles already work from the SteamOS terminal:

- Steam.orp
- Xbox.orp
- Rainbow.orp
- White.orp
- Off.orp
