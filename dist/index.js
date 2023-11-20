'use strict';

var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

const tailwindcssContent = `/* purgecss start ignore */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* purgecss end ignore */
`;
const tailwindConfigJS = `
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

function getTailwindConfigFilePath(api) {
    const { tailwindConfigFilePath } = api.userConfig.tailwindcss || {};
    const configFile = tailwindConfigFilePath ||
        path.join(process.env.APP_ROOT || api.cwd, 'tailwind.config.js');
    return configFile;
}
var index = (api) => {
    api.describe({
        key: 'tailwindcss',
        config: {
            schema(joi) {
                return joi.object({
                    tailwindCssFilePath: joi.string(),
                    tailwindConfigFilePath: joi.string(),
                });
            },
        },
    });
    // 添加postcss-plugin配置
    api.modifyConfig((config) => {
        const configPath = getTailwindConfigFilePath(api);
        // fix #8
        if (!fs__default["default"].existsSync(configPath)) {
            console.log('generate tailwind.config.js.');
            fs__default["default"].writeFileSync(configPath, tailwindConfigJS, 'utf8');
        }
        const tailwindcssPackageName = 'tailwindcss';
        const autoprefixerOptions = api.userConfig.autoprefixer;
        config.extraPostCSSPlugins = [
            ...(config.extraPostCSSPlugins || []),
            require(tailwindcssPackageName)({ config: configPath }),
            require('autoprefixer')(autoprefixerOptions),
        ];
        return config;
    });
    // 添加依赖
    api.addProjectFirstLibraries(() => [
        {
            name: 'tailwindcss',
            path: path.dirname(require.resolve('tailwindcss')),
        },
    ]);
    // 添加文件
    api.onGenerateFiles(() => {
        const { tailwindCssFilePath } = api.userConfig.tailwindcss || {};
        if (!tailwindCssFilePath) {
            api.writeTmpFile({
                path: `tailwind.css`,
                content: tailwindcssContent,
            });
        }
        // 添加tailwind.config.js
        const ConfigFile = getTailwindConfigFilePath(api);
        if (!fs__default["default"].existsSync(ConfigFile)) {
            console.log('generate tailwind.config.js.');
            fs__default["default"].writeFileSync(ConfigFile, tailwindConfigJS, 'utf8');
        }
    });
    api.addEntryImportsAhead(() => {
        const { tailwindCssFilePath } = api.userConfig.tailwindcss || {};
        return {
            source: tailwindCssFilePath || './tailwind.css',
        };
    });
};

module.exports = index;
