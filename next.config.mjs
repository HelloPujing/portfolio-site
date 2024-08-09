/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // 允许生成out目录下的静态文件
    trailingSlash: true, // 生成/dir/index.html 为了配合oss配置
    skipTrailingSlashRedirect: true, // 保持路径，不自动加/
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        console.log('APP_ENV: ', process.env.APP_ENV);
        console.log('NEXT_PUBLIC_API_HOST: ', process.env.NEXT_PUBLIC_API_HOST);
        return config;
    },
    transpilePackages: [
        // antd & deps
        // "@rc-component",
        "@ant-design",
        "antd",
        "rc-cascader",
        "rc-checkbox",
        "rc-collapse",
        "rc-dialog",
        "rc-drawer",
        "rc-dropdown",
        "rc-field-form",
        "rc-image",
        "rc-input",
        "rc-input-number",
        "rc-mentions",
        "rc-menu",
        "rc-motion",
        "rc-notification",
        "rc-pagination",
        "rc-picker",
        "rc-progress",
        "rc-rate",
        "rc-resize-observer",
        "rc-segmented",
        "rc-select",
        "rc-slider",
        "rc-steps",
        "rc-switch",
        "rc-table",
        "rc-tabs",
        "rc-textarea",
        "rc-tooltip",
        "rc-tree",
        "rc-tree-select",
        "rc-upload",
        "rc-util",
    ], // 不然引入antd组件会报错！
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                hostname: "web-bq-resource.oss-cn-hangzhou.aliyuncs.com/.*",
            },
            {
                hostname: "global-resource.oss-cn-hangzhou.aliyuncs.com/.*"
            }
        ],
    }
};

export default nextConfig;
