import axios from "axios";   // 引入 axios
import config from "./config"; // 倒入默认配置
import store from "../store/index";
import {Notify} from "vant";

export default (options: any)=> {
    return new Promise((resolve, reject) => {
        console.log("---axios options--", options);
        const instance = axios.create({
            baseURL: config.baseURL,
            headers: options.headers ? options.headers : config.headers,
            timeout: 10000, // 超时
            transformResponse: [function (data: any) {
            }]
        });
        
        instance.interceptors.request.use(
          function request(config: any) {
          // (config:any) => {
            // 活动渠道--首次进入项目的时候就要带上
            if (!!store.state.serviceChannel) {
                config.headers.channel = store.state.serviceChannel;
            }
            // 活动id--首次进入项目的时候就要带上
            if (!!store.state.activityId) {
                config.headers.activityId = store.state.activityId;
            }
            // 子活动id--首次进入项目的时候就要带上
            if (!!store.state.subActivityId) {
                config.headers.subActivityId = store.state.subActivityId;
            }
            // token--首次进入项目的时候就要带上
            config.headers["token"] = `${store.state.token}` || "";
            console.log("这里是请求的token信息", store.state.token);
            // 设置isICF
            if (store.state.isICF) {
                config.headers.isICF = store.state.isICF;
            } else {
                config.headers.isICF = 2; // 2：表示同意知情同意书
            }
            return config;
            
        }, (error: { code: string; message: string | string[]; response: any; }) => {
            console.log("request:", error);
            // 判断请求超时
            if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
                console.log("根据你设置的 timeout 判断请求超时了，你可以在这里加入超时的处理方案");
                // return service.request(originalRequest); //例如再重复请求一次
            }
            // 需要重定向到错误页面
            const errorInfo = error.response;
            console.log(errorInfo);
            if (errorInfo) {
                const errorStatus = errorInfo.status; // 404 500 403 ... 等
            }
            return Promise.reject(error);  //在调用的那边可以拿到(catch)你想返回的错误信息
        });
        
        instance.interceptors.response.use(
          (response: any) => {
            let data;
            // IE9 时 response.data 是 undefined， 因此需要使用 response.request.responseText(Stringify后的字符串)
            // console.log('这里是请求的回调=====', response);
            if (response.data === undefined) {
                data = JSON.parse(response.request.responseText);
            } else {
                data = response.data;
            }
            
            let tc = response.headers.tc;
            if (tc) {
                (<any>window).setCookie("tc", tc);
            } else {
                (<any>window).getCookie("tc");
            }
            
            // 根据返回的code值来做不同的处理(和后端约定)
            console.log("data.code", data.code);
            switch (data.code) {
                case 0:
                case "2000":
                    return data.data;
                    break;
                case "101041019": // 登陆失效
                case "101041021": // 无token，未登陆
                    console.log("登录已过期，请重新登录");
                    Notify({
                        message: "登录已过期，请重新登录",
                        duration: 3000
                    });
                    break;
                default:
                    return Promise.reject(data);
                    break;
            }
        }, (err: { response: { status: any; config: { url: any; }; }; message: string; }) => {
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        err.message = "请求错误";
                        break;
                    case 401:
                        err.message = "未授权，请登录";
                        break;
                    case 403:
                        err.message = "拒绝访问";
                        break;
                    case 404:
                        err.message = `请求地址错误：${err.response.config.url}`;
                        break;
                    case 408:
                        err.message = "请求超时";
                        break;
                    case 500:
                        err.message = "服务器内部错误";
                        break;
                    case 501:
                        err.message = "服务未实现";
                        break;
                    case 502:
                        err.message = "网关错误";
                        break;
                    case 503:
                        err.message = "服务不可用";
                        break;
                    case 504:
                        err.message = "网关超时";
                        break;
                    case 505:
                        err.message = "HTTP版本不受支持";
                        break;
                    default:
                        err.message = "网络连接失败";
                        break;
                }
                // 提示
                Notify({
                    message: err.message,
                    duration: 1000
                });
            }
            
            return Promise.reject(err); //返回接口返回的错误信息
        });
        
        instance(options).then((res: unknown) => {
            resolve(res);
            console.warn("--Api res--", res);
            return false;
        }).catch((error: any) => {
            console.error("--Api err--", error);
            reject(error);
        });
    });
}

