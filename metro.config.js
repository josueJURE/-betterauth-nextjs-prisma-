const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite uses a WebAssembly worker on web. Native bundles continue to use
// the platform SQLite implementation.
config.resolver.assetExts.push("wasm");

module.exports = config;
