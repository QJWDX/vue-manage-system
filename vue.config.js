const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
 
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = "后台框架";
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    lintOnSave: process.env.NODE_ENV === "development",
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                "@": resolve("src"),
                "@i": resolve("src/api"),
                "@c": resolve("src/components"),
                "@v": resolve("src/pages"),
                "@s": resolve("src/static"),
                "@u": resolve("src/utils")
            }
        },
        plugins: [
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), //匹配文件名
                threshold: 10240, //对10K以上的数据进行压缩
                minRatio: 0.8,
                deleteOriginalAssets: false //是否删除源文件
            })
        ]
    },
    devServer: {
        open: false, // 打开页面
        host: '0.0.0.0', // 域名   127.0.0.0本机    0.0.0.0真机测试
        port: '8198', // 端口号
        https: false, // 是否使用https
        hotOnly: false, // 热更新
        proxy: {
            '/api':{
                // target:'http://127.0.0.1',
                target:'http://www.hhdxdx.cn/',
                ws: true, // 是否跨域
                logLevel: 'debug',
                changeOrigin:true,
                // pathRewrite:{
                //     '*/api':''
                // }
            },
            '/auth':{
                // target:'http://127.0.0.1',
                target:'http://www.hhdxdx.cn/',
                ws: true, // 是否跨域
                logLevel: 'debug',
                changeOrigin:true,
                // pathRewrite:{
                //     '*/auth':''
                // }
            },
            '/system':{
                // target:'http://127.0.0.1',
                target:'http://www.hhdxdx.cn/',
                ws: true, // 是否跨域
                logLevel: 'debug',
                changeOrigin:true,
                // pathRewrite:{
                //     '*/auth':''
                // }
            }
        }
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
}