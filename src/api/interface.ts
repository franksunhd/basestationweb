import axios from "./api";
import store from "@store/index";


// interface Window {
//     test: string;
//     setCookie:any ;

// }

// 添加cookie
(<any>window).setCookie = function (name:any, value:any) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000); // cookie 30天后过期时间
    value ? "" : value = "";
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
};

// 获取cookie
(<any>window).getCookie = function (name:any) {
    var regExp = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    var result = document.cookie.match(regExp);
    if (result) {
        return result[2];
    }
    return "";
};

(<any>window).getUuid = function () {
    console.log("--生存uuid--");
    let timeStamp = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }) + "-" + timeStamp;
};

// 增加用户信息 不在main.js中写，是因为import先行引入，然后再执行代码
function pushUserInfo() {
  console.log("pushUserInfo 00000000000000000000000000");
    let ps = getParameter() || {channel:"",token:"",activityId:"",subActivityId:"",depCd:""};
    let openid = "";
    // let token = store.state.token;
    let pluginVueStore = {
        channel: "", // 渠道
        activityId: "", // 活动id
        subActivityId: "", // 子活动id
        activeChannel:"",
        depCd:"",

    };
    
    // 用户强制刷新浏览器 渠道和活动id的取值顺序 url > sessionStorage > 默认
    if ((<any>window).sessionStorage.getItem("individualImStore")) {
        let sessionStore = JSON.parse((<any>window).sessionStorage.getItem("individualImStore"));
        pluginVueStore.channel = sessionStore.serviceChannel || sessionStore.activeChannel;
        pluginVueStore.activityId = sessionStore.activityId;
        pluginVueStore.subActivityId = sessionStore.subActivityId;
        pluginVueStore.depCd = sessionStore.depCd;
        setTimeout(function () {
            sessionStorage.removeItem("individualImStore");
        }, 500);
    }
    
    // ?channel=0000003&activityId=volunteer_medical&subActivityId=volunteer_medical_tlife
    let source = ps["source"];
    store.commit("changeSource", source);
    // 【 source	入口来源	STRING	"1-- 泰生活首页banner 2--泰生活健康页banner 3--特色服务专区"】

    let channel = ps["channel"] || pluginVueStore.activeChannel || "currency_im"; // 接到的channel参数
    let activityId = ps["activityId"] || pluginVueStore.activityId || "currency_im"; // 接到的 subActivityId 参数
    let subActivityId = ps["subActivityId"] || pluginVueStore.subActivityId || "currency_im"; // 接到的 subActivityId 参数
    let depCd = ps["depCd"] || pluginVueStore.depCd || ""; // 接到的 depCd 参数  测试 中医科depCd: '12',depName: '中医科'
    // let userInfo:object = !!userInfostr ? JSON.parse(userInfostr) : {};
    if ((<any>window).getCookie("openid")) {
        openid = (<any>window).getCookie("openid");
    } else {
        openid = (<any>window).getUuid();
        (<any>window).setCookie("openid", openid);
    }
    store.commit("changeOpenid", openid);
    // store.commit("changeToken", token);
    store.commit("changeServiceChannel", channel);
    store.commit("changeActiveChannel", channel);
    store.commit("changeSubActivityId", subActivityId);
    store.commit("changeDepCd", depCd);
    console.log("科室00000000000000000",store.state.depCd);
    store.commit("changeActivityId", activityId);
}

// 获取url参数
function getParameter() {
    let query = "";
    if (decodeURIComponent((<any>window).location.href).indexOf("?") !== -1) {
        query = decodeURIComponent((<any>window).location.href).split("?")[1];
        let query2 = query.split("&");
        let iLen = query2.length;
        let obj = {channel:"",token:"",activityId:"",subActivityId:"",depCd:""};
        for (let i = 0; i < iLen; i++) {
          let curr:string[] = query2[i].split("=");
          switch(curr[0]){
            case 'token':
              obj[curr[0]] = curr[1];
          }
        }
        return obj;
    }
}
console.log("pushUserInfo 1111111111111111");
// 把用户信息写入vuex
pushUserInfo();

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 * http://tklife.mobile.taikang.com/mobilenet/analysis-report/swagger-ui.html#/
 */
import vConsole from "vconsole";

let domain = document.domain;

let tkLifeBase = "https://medicaluat.mobile.taikang.com/"; // 接口前缀域名
let tkLifeImgPath = "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId="; // 图片前缀

console.log("domain:", domain);
switch (true) {
    // 本地调试
    case /medicaluat.mobile.taikang.com|localhost/.test(domain):
        tkLifeBase = "https://medicaluat.mobile.taikang.com/"; // 接口前缀域名
        tkLifeImgPath = "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId="; // 图片前缀
        // new vConsole();
        break;
    // 生产环境
    case /medical.mobile.taikang.com/.test(domain):
        tkLifeBase = "https://medical.mobile.taikang.com/"; // 接口前缀域名
        tkLifeImgPath = " http://tkih.mobile.taikang.com/cloudhospital/storage/file/get?fileId="; // 图片前缀
        break;
    default:
        break;
}

// 获取用户基本信息 
export const getUserBase = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/user/t-patient-info`,
        method: "get",
        params
    });
};
// 获取用户权益信息(暂时用不到)
export const loginTUserInfo = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/login/tUserInfo`,
        method: "get",
        params
    });
};

// 获取健康档案(暂时用不到)
export const getHealthRecords = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/user/healthRecord`,
        method: "get",
        params
    });
};

// 通用散客(暂时用不到)
export const regSimple = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/login/register/simple`,
        method: "post",
        params
    });
};

// 获取泰生活用户信息(暂时用不到)
export const getTUserInfo = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/login/tUserInfo`,
        method: "get",
        params
    });
};

// 获取微信ticket(暂时用不到)
export const getWxTicket = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/wsp/ticket`,
        method: "get",
        params
    });
};

// 获取图形验证码(暂时用不到)
export const getImgVerify = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/imageVerifyCode/getVerifyCode`,
        method: "get",
        params
    });
};

// 获取订单列表 @todo sunsy01
export const getOrderList = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/currency-im/list`,
        method: "get",
        params
    });
};

// 获取订单详情 @todo sunsy01
export const getOrderDetail = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/detail`,
        method: "get",
        params
    });
};

// 获取咨询小结 @todo sunsy01
export const getConsultSum = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/summary`,
        method: "get",
        params
    });
};

// 获取医生详情 @todo sunsy01
export const getDoctorInfo = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/info`,
        method: "get",
        params
    });
};

// 获取短信验证码(暂时用不到)
export const getSmsCode = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/login/sms`,
        method: "post",
        data
    });
};

// 通用注册（无领卡激活） @todo by sunsy01
export const postSignUp = (data: { source: any; }) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/login/register/currency?source=${data.source}`,
        method: "post",
        data
    });
};

// 获取IM签名 @todo by sunsy01
export const imSign = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/imSign`,
        method: "get",
        params
    });
};

// 获取进行中订单 @todo by sunsy01
export const getOrderIngV2 = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/getOrderIngV2`,
        method: "get",
        params
    });
};

// 开单(兼容无卡开单和有卡开单) @todo by sunsy01
export const submitReservation = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/startNewConsult`,
        method: "post",
        data
    });
};

// 获取订单详情 @todo sunsy01
export const orderChat = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/chat`,
        method: "get",
        params
    });
};

// 提交更新信息时间(20210324 不调用 B端对应接口废弃) @todo sunsy01
export const updateSendMsgTime = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/updateSendMsgTime`,
        method: "post",
        data
    });
};

// 处方-处方笺生成处方订单 (暂时用不到)
export const healthTold = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/pre/healthTold`,
        method: "get",
        params
    });
};

// 处方-订单详情查询 (暂时用不到)
export const orderDetail = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/pre/orderDetail`,
        method: "get",
        params
    });
};

// 点击提交进行评价 @todo sunsy01
export const submitEvaluation = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/submitEvaluation`,
        method: "post",
        data
    });
};

// 弹窗中nps评价 (暂时用不到)
export const submitQuestionEvaluation = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/submitQuestionEvaluation`,
        method: "post",
        data
    });
};

// 用户端自主结束订单 @todo sunsuy01
export const customEndConsult = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/endConsult`,
        method: "post",
        data
    });
};

// 获取科室 (暂时用不到)
export const getDepartmentByTypeCd = (params: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/getDepartmentByTypeCd`,
        method: "get",
        params
    });
};

// 授权健康档案 (暂时用不到)
export const updateHealthAuthorizeStatus = (data: any) => {
    return axios({
        url: `${tkLifeBase}bu-health/newreport/updateHealthAuthorizeStatu`,
        method: "post",
        data
    });
};

// 上传图片 @todo sunsy01
export const uploadImage = (data: any) => {
    return axios({
        url: `${tkLifeBase}mobilenet/analysis-report/order/uploadImage`,
        method: "post",
        data: getFrom(data)
    });
};

// 转化form的方法
export function getFrom(data: any) {
    let form = new FormData();
    let keys = Object.keys(data);
    keys.forEach(key => {
        if (data[key] instanceof Array) {
            (data[key]).map((item:any) => {
                form.append(key, item);
            });
        } else {
            form.append(key, data[key]);
        }
    });
    return form;
}
const interfaceAPI = 
 {
    tkLifeImgPath,
    getImgVerify,
    getDoctorInfo,
    getOrderList,
    getOrderDetail,
    getConsultSum,
    getWxTicket,
    getUserBase,
    loginTUserInfo,
    getHealthRecords,
    regSimple,
    getTUserInfo,
    getSmsCode,
    postSignUp,
    imSign,
    getOrderIngV2,
    orderChat,
    updateSendMsgTime,
    healthTold,
    orderDetail,
    submitReservation,
    submitEvaluation,
    submitQuestionEvaluation,
    customEndConsult,
    getDepartmentByTypeCd,
    uploadImage,
    updateHealthAuthorizeStatus
};
export default interfaceAPI;
