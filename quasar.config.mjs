/* eslint-env node */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import babel from '@qubit-ltd/vite-plugin-babel';
/* eslint func-names: 0 */
/* eslint global-require: 0 */
import { configure } from 'quasar/wrappers';
import generateFile from 'vite-plugin-generate-file';
import appInfo from './lib/app-info';
import getProcessEnv from './lib/get-process-env';

const processEnv = getProcessEnv(appInfo);

export default configure((ctx) => ({
  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
  devServer: {
    https: true,
    open: false, // opens browser window automatically
  },
  // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
  preFetch: false,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli-vite/boot-files
  boot: [
    'logging',
    'config',
    'loading',        // 配置loading遮盖层
    'alert',          // 配置alert对话框
    'confirm',        // 配置confirm对话框
    'notify',         // 配置notify消息通知
    'http',           // 配置http请求对象
    'vconsole',       // 配置 vconsole 调试工具
  ],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
  css: [
    'app.scss',
  ],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    'fontawesome-v6',
    'material-icons', // optional, you are not bound to it
    'material-icons-outlined',
    'material-symbols-outlined',
    'material-symbols-rounded',
    'bootstrap-icons',
  ],

  // 可注入 HTML 文件的变量
  htmlVariables: {
    appName: processEnv.APP_NAME,
    appVersion: processEnv.APP_VERSION,
    appCode: processEnv.APP_CODE,
    nodeEnv: processEnv.NODE_ENV,
    prodMode: processEnv.PROD_MODE,
    devMode: processEnv.DEV_MODE,
    stageMode: processEnv.STAGE_MODE,
    debug: processEnv.DEBUG,
    showVersionNumber: processEnv.SHOW_VERSION_NUMBER,
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
  build: {
    target: {
      browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
      node: 'node20',
    },
    vueRouterMode: 'hash', // available values: 'hash', 'history'
    // vueRouterBase,
    vueDevtools: processEnv.DEBUG,
    vueOptionsAPI: true,

    // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

    publicPath: './',  // 需要将资源路径设置为相对路径，注意后面还要修改vite配置
    analyze: processEnv.USE_ANALYZER,
    // env: {},
    // rawDefine: {}
    // ignorePublicFolder: true,
    minify: processEnv.PROD_MODE,
    polyfillModulePreload: true,
    // distDir
    transpile: true,
    transpileDependencies: [],
    extendViteConf(viteConf) {
      // 注意：设置 quasar 的 build.publicPath 为 './'，quasar 会奇怪地把
      // vite 的 base 设置为 '/./'，导致静态资源的路径错误。所以我们需要
      // 手动把 vite 的 base 设置为 './'。
      viteConf.base = './';
      // 注意，我们需要手动注入 process.env 变量
      // 如果只在 build.env 中设置，quasar dev 环境下生效，但是 quasar build 后的失效
      viteConf.define = {
        'process.env': processEnv,
      };
    },
    viteVuePluginOptions: {
      script: {
        // 启用对JS装饰器的支持
        babelParserPlugins: ['decorators'],
      },
    },
    vitePlugins: [
      babel(),
      // 修改了 @qubit-ltd/common-decorator 后，不再需要 node polyfills
      // nodePolyfills(),
      // 生成 app-info.json，保存当前版本信息，用于自动更新
      generateFile([{
        type: 'json',
        output: './app-info.json',
        data: appInfo,
      }]),
    ],
  },

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
  framework: {
    config: {},
    iconSet: 'material-icons', // Quasar icon set
    lang: 'zh-CN', // Quasar language pack，设置为简体中文

    // For special cases outside of where the auto-import strategy can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    components: [],
    directives: [],
    // Quasar plugins
    plugins: [
      'Dialog',
      'Loading',
      'Notify',
    ],
  },

  // animations: 'all', // --- includes all animations
  // https://v2.quasar.dev/options/animations
  animations: [],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-sourcefiles
  sourceFiles: {
    rootComponent: 'src/App.vue',
    router: 'src/router/index',
    store: 'src/stores/index',
    // pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
    // pwaServiceWorker: 'src-pwa/custom-service-worker',
    // pwaManifestFile: 'src-pwa/manifest.json',
    // electronMain: 'src-electron/electron-main',
    // electronPreload: 'src-electron/electron-preload',
    // bexManifestFile: 'src-bex/manifest.json',
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
  ssr: {
    prodPort: 3000, // The default port that the production server should use (gets superseded if process.env.PORT is specified at runtime)
    middlewares: [
      'render', // keep this as last one
    ],

    // extendPackageJson (json) {},
    // extendSSRWebserverConf (esbuildConf) {},

    // manualStoreSerialization: true,
    // manualStoreSsrContextInjection: true,
    // manualStoreHydration: true,
    // manualPostHydrationTrigger: true,

    pwa: false,

    // pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!
    // will mess up SSR

    // pwaExtendGenerateSWOptions (cfg) {},
    // pwaExtendInjectManifestOptions (cfg) {}
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
  pwa: {
    workboxMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
    // swFilename: 'sw.js',
    // manifestFilename: 'manifest.json'
    // extendManifestJson (json) {},
    // useCredentialsForManifestTag: true,
    // injectPwaMetaTags: false,
    // extendPWACustomSWConf (esbuildConf) {},
    // extendGenerateSWOptions (cfg) {},
    // extendInjectManifestOptions (cfg) {}
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
  cordova: {
    // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: true,
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
  electron: {
    // extendElectronMainConf (esbuildConf) {},
    // extendElectronPreloadConf (esbuildConf) {},

    // extendPackageJson (json) {},

    // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
    preloadScripts: ['electron-preload'],

    // specify the debugging port to use for the Electron app when running in development mode
    inspectPort: 5858,

    bundler: 'packager', // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

      // OS X / Mac App Store
      // appBundleId: '',
      // appCategoryType: '',
      // osxSign: '',
      // protocol: 'myapp://path',

      // Windows only
      // win32metadata: { ... }
    },

    builder: {
      // https://www.electron.build/configuration/configuration

      appId: 'quasar-app-template',
    },
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
  bex: {
    // extendBexScriptsConf (esbuildConf) {},
    // extendBexManifestJson (json) {},

    contentScripts: [
      'my-content-script',
    ],
  },
}));
