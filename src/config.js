/*
 * @Author: xr@srun.com
 * @Date: 2019-04-01 09:52:15
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-01 09:55:52
 */

const config = {
    ENV: 'dev',                                                                // 开发环境 (dev / prod)
    reqUrl: `${location.protocol}//${location.hostname}`,                      // 请求地址
    reqPort: 9001,                                                             // 请求端口
    // api: {
    //     login: '/users/login',                                              // POST 登录
    //     logout: '/users/logout',                                            // GET  注销
    // },
    // aes: {
    //     key: '52756SRUN_HELPER',                                            // KEY
    //     iv: 'ZBWTUJ_GHRHUWQER'                                              // 向量
    // },
};

if (config.ENV === 'dev') {
    config.reqUrl = 'http://192.168.0.150';
    config.reqPort = 8080;

    console.info("[DD]: 当前为开发模式");
}

export default config;
