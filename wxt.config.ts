import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  // Visible folder for chrome://extensions → Load unpacked (WXT default `.output` is hidden).
  outDir: 'dist',
  manifest: {
    name: 'Gamaliel',
    description:
      'Find Scripture that helps renew your mind when you are on social media.',
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      96: 'icon-96.png',
      128: 'icon-128.png',
    },
    action: {
      default_title: 'Gamaliel',
      default_icon: {
        16: 'icon-16.png',
        32: 'icon-32.png',
        48: 'icon-48.png',
        128: 'icon-128.png',
      },
    },
    permissions: ['sidePanel', 'storage', 'tabs'],
    host_permissions: [
      'https://api.gamaliel.ai/*',
      'https://*/*',
      'http://*/*',
    ],
  },
});
