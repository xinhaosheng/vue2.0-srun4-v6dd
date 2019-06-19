import Vue from 'vue'
import CryptoJS from 'crypto-js'

const vue = Vue.prototype;

export default class index {

    /**
     * 基于 Axios 的 POST 请求封装
     * @url             请求地址
     * @para            请求参数    {Object}
     * @status.success  成功回调
     * @status.error    失败回调
     */
    static post(url, para, func = {
        success() {
        },
        error() {
        }
    }, notice) {

        // url 拼接
        url = `${vue.config.reqUrl}:${vue.config.reqPort}${url}`;

        // 发起请求
        Vue.prototype.axios.post(url, para)
            .then(
                res => {
                    // 200 成功
                    // 400 失败
                    // 500 token无效

                    if (func.error === undefined) func.error = () => {
                    };

                    // 根据 code 执行对应 func
                    if (res.data.code === 200) {
                        // 操作成功
                        func.success(res.data);

                        if (notice === 'notice') {
                            vue.$notify({
                                title: '成功',
                                message: res.data.message,
                                type: 'success'
                            });
                        }

                    } else {
                        // 操作失败
                        func.error(res.data);
                        vue.$notify.error({
                            title: '错误',
                            message: res.data.message
                        });
                    }
                },
                res => {
                    console.error(res);
                }
            )
    }

    /**
     * 基于 Axios 的 GET 请求封装
     * @url     请求url
     * @para    请求参数
     * @func    成功回调方法,默认为空
     */
    static get(url, para, func = () => {
    }) {

        // 如果使用默认参数,防止参数顺序混乱
        if (typeof para === "function") {
            func = para;
            para = '';
        }

        // url 拼接
        url = `${vue.config.reqUrl}:${vue.config.reqPort}${url}`;

        // 发起请求
        Vue.prototype.axios.get(url, {
            params: para
        })
            .then(
                res => {
                    func(res.data);
                },
                res => {
                    console.error(res);
                }
            )
    }

    /* Check */
    /*static Check(obj) {
        let shakeTimer,         // 闪烁计时器
            el = obj.el,        // 校验作用域
            lang = obj.lang;

        let language = {
            Chinese: {
                and: "与",
                notEmpty: "不能为空",
                dnsError: "DNS 格式有误",
                macError: "Mac 格式有误",
                ipError: "IP 格式有误",
                ipv6Error: "IPv6 格式有误",
                numError: "格式有误，请输入非0的正整数",
                needOne: "至少需填写一项"
            },
            English: {
                and: " and ",
                notEmpty: " can't be empty",
                dnsError: "Incorrect DNS format",
                macError: "Incorrect Mac format",
                ipError: "Incorrect IPv4 format",
                ipv6Error: "Incorrect IPv6 format",
                numError: "Incorrect format, please enter a positive integer other than 0.",
                needOne: " at least one entry is required."
            }
        };

        switch (lang) {
            case undefined:
            case "zh-CN":
                lang = language.Chinese;
                break;
            case "en-US":
                lang = language.English;
                break;
        }

        // 正则规则
        const patternIpv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            patternIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
            patternMac = /^([a-fA-F0-9]{2}:){5}([a-fA-F0-9]{2})$/,
            patternNum = /^[1-9]\d*$/,
            patterBoolIpv4 = /^(=|>|<|>=|<=)((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            patterBoolIpv6 = /^(=|>|<|>=|<=)\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

        // Class load 方法
        (function () {
            // 键盘按下移除 shake 效果
            $(document).on("keydown", "input", function () {
                $(this).removeClass("shake");
            })
        })();

        // 校验方法
        this.checkBlank = function () {
            let inputNum = $(el + " input").length,     // 作用域内 input 框数量
                publicItemStatus = {message: ''},       // publicItemStatus
                status = true,                          // 校验状态
                msg;                                    // 校验结果信息

            // 依次校验
            for (let i = 0; i < inputNum; i++) {
                let element = $(el + " input:eq(" + i + ")"),   // 当前校验 input 元素
                    val = element.val().replace(/\s+/g, ""),    // 当前 input value值 (去除空格)
                    type = element.attr("strRule"),             // 当前 input 校验规则
                    publicItem = element.attr("publicItem");    // 当前 input 是否为 「至少需要填写一项」 项目

                // 非空校验
                if (val === '') {
                    // 跳过验证 (非必填项)
                    if (type === "pass" || type === "passMac") {
                        continue;
                    }
                    // 截取 placeholder
                    msg = element.attr("placeholder");
                    msg = msg.replace(/请输入/g, '').replace(/Input /g, '');
                    // 判断是否只需填写一项
                    if (publicItem) {
                        if (publicItemStatus.status) {
                            continue;
                        }
                        publicItemStatus.status = false;
                        publicItemStatus.message += msg + lang.and;
                        continue;
                    } else {
                        msg += lang.notEmpty;
                        this.shake(element);
                    }
                    // 兼容分页写法
                    if (element.attr("group") === "userRule") {
                        let page = $("[group='userRule']").index(element) / 4;
                        $(".userRule .target li:eq(" + page + ")").mouseover();
                    } else if (element.attr("group") === "locDomain") {
                        let page = $("[group='locDomain']").index(element) / 3;
                        $(".locDomain .target li:eq(" + page + ")").mouseover();
                    }
                    return {
                        status: false,
                        msg: msg
                    }
                } else {
                    // 判断是否只需填写一项
                    if (publicItem) {
                        publicItemStatus.status = true;
                    }
                    switch (type) {
                        case "dns":
                            if (!patternIpv4.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.dnsError
                                };
                            }
                            break;
                        case "ip":
                            if (!patternIpv4.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.ipError
                                };
                            }
                            break;
                        case "ipv6":
                            if (!patternIpv6.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.ipv6Error
                                };
                            }
                            break;
                        case "ipv4|ipv6":
                            if (!patterBoolIpv4.test(val) && !patterBoolIpv6.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.ipError
                                };
                            }
                            break;
                        case "mac":
                        case "passMac":
                            if (!patternMac.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.macError
                                };
                            }
                            break;
                        case "num":
                            if (!patternNum.test(val)) {
                                this.shake(element);
                                return {
                                    status: false,
                                    msg: lang.numError
                                };
                            }
                            break;
                    }
                }
            }

            // 判断两项之间至少输入一项
            if (!publicItemStatus.status && publicItemStatus.status !== undefined) {
                let tempLength = publicItemStatus.message.length - 1;
                msg = publicItemStatus.message.substring(0, tempLength) + "至少需填写一项";
                return {
                    status: false,
                    msg: msg
                };
            } else {
                // 通过校验
                return {
                    status: true
                }
            }
        };

        // 闪烁
        this.shake = function (element) {
            // 如果正在闪烁
            if (!this.shakeTimer) {
                clearInterval(shakeTimer);
            }
            element.removeClass("shake");
            element.focus();
            let num = 0;
            shakeTimer = setInterval(function () {
                element.toggleClass("shake");
                num++;
                if (num > 6) {
                    // 还原
                    clearInterval(shakeTimer);
                    shakeTimer = true;
                    num = 0;
                }
            }, 80);
        }
    }*/

    /* 缓存赋值 */
    static cloneCache(obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    /* 时间加 0 方法 */
    static timeAdd0(str) {
        if (str < 10) {
            str = "0" + str;
        }
        return str;
    };

    /* AES加密 */
    static encrypt(str, key, iv) {
        //密钥16位
        key = CryptoJS.enc.Utf8.parse(key);
        //加密向量16位
        iv = CryptoJS.enc.Utf8.parse(iv);
        let encrypted = CryptoJS.AES.encrypt(str, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return encrypted.toString()
    }

    /* AES解密 */
    static decrypt(str, key, iv) {
        //密钥16位
        key = CryptoJS.enc.Utf8.parse(key);
        //加密向量16位
        iv = CryptoJS.enc.Utf8.parse(iv);
        let decrypted = CryptoJS.AES.decrypt(str, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return decrypted.toString(CryptoJS.enc.Utf8)
    }

    /* 对象替换 Key
     * ex:
     *     let data = replaceKey(res.data.data, 'Ip', 'value');
     * */
    static replaceKey(obj, oldKey, newKey) {
        let arr = [],
            data = obj,
            keys = Object.keys(data[0]);

        for (let val of data) {
            let temp = {};
            for (let key of keys) {
                key === oldKey ? temp[newKey] = val[key] : temp[key] = val[key]
            }
            arr.push(temp)
        }
        return arr
    }
}
