const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
 
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = "后台框架";
module.exports = {
    baseUrl: './',
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
        proxy: {
            '/':{
                target:'http://127.0.0.1',
                // target:'https:/www.hhdxdx.cn',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
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