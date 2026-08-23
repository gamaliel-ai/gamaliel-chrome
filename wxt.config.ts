import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Gamaliel',
    description:
      'Find Scripture that helps renew your mind when you are on social media.',
    permissions: ['sidePanel', 'contextMenus', 'activeTab'],
    host_permissions: ['https://api.gamaliel.ai/*'],
  },
});
