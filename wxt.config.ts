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
    action: {
      default_title: 'Gamaliel',
    },
    permissions: ['sidePanel', 'tabs'],
    host_permissions: [
      'https://api.gamaliel.ai/*',
      'https://*/*',
      'http://*/*',
    ],
  },
});
