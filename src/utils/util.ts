/* eslint-disable */
import store from '../store/index'

declare const window: Window &  { 
    location: any, 
    ServiceJSBridge:any,
    webkit:any,
    jsobj:any,
    webviewDidFinishLoading:any,
    loginServiceBack:any,
    loginBack:any,
    JWTBack:any,
    TDAPP:any,
};
declare const  ServiceJSBridge:any;
let util = <any>{};

// 跳转实名认证
util.realName = function () {
  if (util.isInApp()) {
      // 泰生活APP中
      util.todoDiffDeviceFn(
          // 安卓
          function () {
              window.jsobj.NativeFunction(
                  JSON.stringify({
                      "command": "startRealName",
                  })
              );
          },
          // ios
          function () {
              window.webkit.messageHandlers.NativeFunction.postMessage(
                  JSON.stringify({
                      "command": "startRealName",
                  })
              );
          }
      );
  }
}
util.loginServe = function () {
  console.log("使用 手机登录页面=== loginServe");
  if (!util.isiOS()) {
      console.log("使用安卓手机");
      window.jsobj.NativeFunction(JSON.stringify({
          'command': 'loginService',
          'callback': 'loginServiceBack'
      }))
      window.loginServiceBack = function (logindata) {
          console.log('loginServiceBack返回数据')
          console.log(logindata)
          var reslogin = JSON.parse(logindata)
          console.log('判断去登录的返回状态')
          console.log(reslogin)
          if (reslogin.code == '1') {// 安卓用户去登录失败状态
              store.commit('changeToken', reslogin.token);
              console.log('安卓去登录失败状态')
          } else if (reslogin.code == '0') {// 安卓用户去登录成功状态
              store.commit('changeToken', reslogin.token);
              console.log('安卓去登录成功状态')
          }
      }
  } else {
      console.log("使用ios手机");
      window.webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({
          'command': 'loginService',
          'callback': 'loginBack'
      }))
      return new Promise((resolve) => {// 
          window.loginBack = function (reciveStr) {
              console.log('点按钮去登录loginBack返回参数如下')
              var reciveObj = JSON.parse(reciveStr)
              console.log(reciveObj);   ///这里岔开了，去调用了_t.getUserProductRightList({"refresh":true});
              if (reciveObj.code == '0') { // ios登录成功然后去调获取token信息的方法   这里异步了
                  window.webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({
                      'command': 'userJWTService',
                      'callback': 'JWTBack'
                  }))
                  window.JWTBack = function (jwtdata) {
                      var resjwt = JSON.parse(jwtdata)
                      console.log("登录成功====>", resjwt)
                      if (resjwt.token !== '') {
                          resjwt['isLogin'] = '1'
                          store.commit('changeToken', resjwt.token);
                          resolve(resjwt.token);
                          console.log('ios去登录成功后的loginObj如下')
                          console.log('登录成功回来刷新页面')
                          // this.$router.go(0)  //根据具体情况使用
                      }
                  }
              } else if (reciveObj.code == '-1') {
              console.log('ios去登录后失败的loginObj如下',reciveObj);
              }
          }
      })
  }
};

util.inputPattern = function(val: string){
    let result = val.replace(/[^\w\u4E00-\u9FA5，。\- / ~；：？！、@‘’ ……“”～…\\(\\)（）%\\!\\?,\\.:-\\'\\"+]/g, '');
    if(result.length > 200){
        result = result.slice(0, 200);
    }
    return result;
}
util.isType = function () {
    var isAndroid
    var u = navigator.userAgent,
        app = navigator.appVersion
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    return isAndroid
}
util.isiOS = function () {
    var isiOS
    var u = navigator.userAgent
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    return isiOS
},
util.iosOrAndroid = function () {
    var isAndroid;
    var isIOS;
    var u = navigator.userAgent;
    console.warn("u===",u)
    isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    isIOS = !!u.match(/\(i[^]+( U)? CPU.+Mac OS X/);
    if (isAndroid) {
        return false;
    }
    return true;
},
util.searchUrl = function () {
    if ((<any>window).location.search) {
        var str = decodeURIComponent((<any>window).location.search.split('?')[1])
        var arr = str.split('&')
        var num = arr.length
        var newJson = {}
        for (var i = 0; i < num; i++) {
            var newArr = arr[i].split('=')
            newJson[newArr[0]] = newArr[1]
        }
        return newJson
    } else {
        return {}
    }
}
util.getType = function (obj: any) {
    // tostring会返回对应不同的标签的构造函数
    var toString = Object.prototype.toString
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    if (obj instanceof Element) {
        return 'element'
    }
    return map[toString.call(obj)]
}

// 更改状态栏颜色
util.XXXXsetBar = function (font: string) {
    if (font == 'white') {
        // 安卓状态栏为黑底白字
        ServiceJSBridge.invoke(
            "changeStatusBar",
            {statusBarColor: "#282A2B", statusTextColor: false, isSetTheme: true},
            function () {
            }
        );
        // ios状态栏黑底白字
        ServiceJSBridge.invoke(
            "changeViewBackgroundColor",
            {backgroundColor: "#282A2B"},
            function () {
            }
        );
        ServiceJSBridge.invoke(
            "changeStatusBarAppearance",
            {textColor: "white"},
            function () {
            }
        );
    } else {
        // 安卓状态栏为白底黑字
        ServiceJSBridge.invoke(
            'changeStatusBar',
            {statusBarColor: '#ffffff', statusTextColor: true, isSetTheme: true},
            function () {
            }
        )
        // ios状态栏白底黑字
        ServiceJSBridge.invoke(
            'changeViewBackgroundColor',
            {backgroundColor: '#ffffff'},
            function () {
            }
        )
        ServiceJSBridge.invoke(
            'changeStatusBarAppearance',
            {textColor: 'black'},
            function () {
            }
        )
    }
}

util.deepClone = function (data: any) {
    var type = util.getType(data)
    var obj:any;
    if (type === 'array') {
        obj = []
    } else if (type === 'object') {
        obj = {}
    } else {
        // 不再具有下一层次
        return data
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(util.deepClone(data[i]))
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = util.deepClone(data[key])
        }
    }
    return obj
}
util.dateFtt = function (fmt: string, date: { getMonth: () => number; getDate: () => any; getHours: () => any; getMinutes: () => any; getSeconds: () => any; getMilliseconds: () => any; getFullYear: () => string; }) {
  if(!fmt){
    return console.error("未传入时间字符串");
  }
  var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        console.log("k",k,fmt);
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
  }
  return fmt
}

util.crtTimeFtt = function (value:string){
var crtTime = new Date(value);
return util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime);//直接调用公共JS里面的时间类处理的办法  
}

// 计算时间
util.countTime = function (fmt: string, ms: number) { // 毫秒
    var o = {
        'd+': Math.floor(ms / 1000 / 60 / 60 / 24), // 日
        'h+': Math.floor(ms / 1000 / 60 / 60 % 24), // 小时
        'm+': Math.floor(ms / 1000 / 60 % 60), // 分
        's+': Math.floor(ms / 1000 % 60), // 秒
    }
    let date=new Date();
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}
util.changeDateFormat = function (data: string) {
    let temp = data.split('-')
    let formatTime = `${temp[0]}年${temp[1]}月${temp[2]}日`
    return formatTime
}

// 埋点
util.trackEventFunc1 = function (id: any, label: any, params: any) {
    return new Promise((resolve, reject) => {
        (<any>window).ServiceJSBridge.invoke(
            'trackEvent',
            {eventId: id, label: label},
            function (res: unknown) {
                resolve(res);
            }
        )
    })

}
// 埋点  eg:util.trackEventFunc(eventId, eventLabel,eventParams);
// TDAPP.onEvent("yqyz_fuwujieshao", "立即咨询", {"服务介绍页点击立即咨询按钮": ""});//phgl_zixun
// util.trackEventFunc("yqyz_fuwujieshao", "立即咨询","服务介绍页点击立即咨询按钮");
// util.trackEventFunc = function (id: any, label: any, params: any) {
//   return new Promise((resolve, reject) => {
//     console.log("(<any>window).TDAPP==",(<any>window).TDAPP);
//     if ((<any>window).TDAPP) {
//         (<any>window).TDAPP.onEvent.apply(null, arguments);
//         (<any>window).TDAPP.send();
//     }
//   })
// }
// 注册微信的信息
// util.configWx = function (isShowShare: any) {
//     $api.getWxSign({
//         url: encodeURIComponent((<any>window).$signLink)
//     })
//         .then((res: any) => {
//             // console.log("home中的回调", res);

//             util.configWXList(res);

//             // util.addShare({
//             //   title: "测试用例"
//             // });
//             // 是否展示分享
//             util.hideAllMenuItems();

//             if (isShowShare) {
//                 util.showMenuItems();
//             }

//             // util.addShare();
//         })
//         .catch((err: any) => {
//             console.log("configWx--home中的错误", err);
//         });

// }

// util.configWXList = function (data: { timestamp: any; noncestr: any; signature: any; }) {
//     let wxApiList = [
//         "checkJsApi",
//         "updateAppMessageShareData",
//         "updateTimelineShareData",
//         "onMenuShareTimeline",
//         "onMenuShareAppMessage",
//         "hideMenuItems",
//         "showMenuItems",
//         "hideAllNonBaseMenuItem",
//         "showAllNonBaseMenuItem",
//         "translateVoice",
//         "startRecord",
//         "stopRecord",
//         "onRecordEnd",
//         "playVoice",
//         "pauseVoice",
//         "stopVoice",
//         "uploadVoice",
//         "downloadVoice",
//         "chooseImage",
//         "previewImage",
//         "uploadImage",
//         "downloadImage",
//         "getLocalImgData",
//         "getNetworkType",
//         "openLocation",
//         "getLocation",
//         "hideOptionMenu",
//         "showOptionMenu",
//         "close(<any>window)",
//         "scanQRCode",
//         "chooseWXPay",
//         "openProductSpecificView",
//         "addCard",
//         "chooseCard",
//         "openCard"
//     ] // 微信内部接口

//     let config = {
//         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         appId: $api.officialAppId, // 必填，公众号的唯一标识
//         timestamp: data.timestamp, // 必填，生成签名的时间戳
//         nonceStr: data.noncestr, // 必填，生成签名的随机串 注意大小写
//         signature: data.signature, // 必填，签名
//         jsApiList: wxApiList // 必填，需要使用的JS接口列表
//     };

//     // console.log( '$wx.config----', config );

//     $wx.config(config);
// }
util.shareSuccess = function (data: any) {
    console.log("$wx.ready shareSuccess 返回===", data);

    // util.addShare(); // 对于部分手机会形成死循环

    /*let shareInfo = {
        "action": data.action || "",
        "companyCode": data.companyCode,
        "linkCtime": Date.parse(new Date()) / 1000,
        "roles": JSON.stringify(data.roles),
        "userCode": data.userCode,
        "userName": data.userName,
    }
    console.info("logShare 入参==>", shareInfo);
    $api.logShare(shareInfo).then(res => {
        console.info("logShare 出参==>", res);
    }).catch(err => {
        console.log("logShare 的错误", err);
    })*/
};
// 增加微信分享
// util.addShare = function (obj: any) {
    // console.log('addShare-分享链接', $api.friendUrl);

    // $wx.ready(() => {
    //     // 注意'http://app-t.healthservice.mobile.taikang.com/reportdes/index.html?agInfo='链接后面的参数不能是id={}这种
    //     console.log('$wx.ready-分享链接', $api.friendUrl);

    //     var params = {
    //         title: '疫情期间不敢去医院怎么办',
    //         desc: '泰康医生集团免费义诊，抗击疫情北京加油！',
    //         link: util.getShareUrl(),
    //         imgUrl: $api.shareImgUrl || "",
    //     };

    //     if (/(Android)/i.test(navigator.userAgent)) {
    //         //分享给好友
    //         $wx.updateAppMessageShareData( Object.assign( params, {
    //             success: function (res) {
    //                 // obj.action = 'updateAppMessageShareData';
    //                 console.log("success--updateAppMessageShareData  代理人信息agentInfo :", obj, "  ,addShare  res :", res, 'params--', params);
    //                 util.shareSuccess(obj);
    //             }
    //         } ));
    //         //分享到朋友圈
    //         $wx.updateTimelineShareData( Object.assign( params, {
    //             success: function (res) {
    //                 // obj.action = 'updateTimelineShareData';
    //                 console.log("success--updateTimelineShareData  代理人信息agentInfo :", obj, "  ,addShare  res :", res, 'params--', params);
    //                 util.shareSuccess(obj);
    //             }
    //         } ));
    //     } else { // ios只有旧接口好用
    //         //分享给好友
    //         $wx.onMenuShareAppMessage( Object.assign( params, {
    //             success: res => {
    //                 // obj.action = 'onMenuShareAppMessage';
    //                 console.log("success--onMenuShareAppMessage  代理人信息agentInfo :", obj, "  ,addShare  res :", res, 'params--', params);
    //                 util.shareSuccess(obj);
    //             }
    //         } ));

    //         //分享到朋友圈
    //         $wx.onMenuShareTimeline( Object.assign( params, {
    //             success: function (res) {
    //                 // obj.action = 'onMenuShareTimeline';
    //                 console.log("success--onMenuShareTimeline  代理人信息agentInfo :", obj, "  ,addShare  res :", res, 'params--', params);
    //                 util.shareSuccess(obj);
    //             }
    //         } ));
    //     }
    // });

//     $wx.error( (err: any) => {
//         console.log( '$wx.error----', err )
//     } );
// }

// 隐藏功能窗口
// util.hideMenuItems = function () {
//     $wx.ready(() => {
//         $wx.hideMenuItems({
//             menuList: [
//                 "menuItem:share:qq",
//                 "menuItem:share:weiboApp",
//                 "menuItem:favorite",
//                 "menuItem:share:facebook",
//                 "menuItem:share:QZone",
//                 "menuItem:editTag",
//                 "menuItem:delete",
//                 "menuItem:copyUrl",
//                 "menuItem:originPage",
//                 "menuItem:readMode",
//                 // "menuItem:openWithQQBrowser",
//                 // "menuItem:openWithSafari",
//                 "menuItem:share:email",
//                 "menuItem:share:brand"
//             ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//         });
//     });
// }

// 隐藏功能窗口
// util.showMenuItems = function () {
//     $wx.ready(() => {
//         $wx.showMenuItems({
//             menuList: [
//                 "menuItem:share:appMessage",
//                 "menuItem:share:timeline",
//                 "menuItem:copyUrl"
//             ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//         });
//     });
// }

// 隐藏所有分享功能按钮
// util.hideAllMenuItems = function () {
//     $wx.ready(() => {
//         $wx.hideMenuItems({
//             menuList: [
//                 'menuItem:share:appMessage',
//                 'menuItem:share:timeline',
//                 "menuItem:share:qq",
//                 "menuItem:share:weiboApp",
//                 "menuItem:favorite",
//                 "menuItem:share:facebook",
//                 "menuItem:share:QZone",
//                 "menuItem:editTag",
//                 "menuItem:delete",
//                 "menuItem:copyUrl",
//                 "menuItem:originPage",
//                 "menuItem:readMode",
//                 // "menuItem:openWithQQBrowser",
//                 // "menuItem:openWithSafari",
//                 "menuItem:share:email",
//                 "menuItem:share:brand"
//             ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//         });
//     });
// }

util.dateFormat = function (value: string , format: string) {
    if (/-/.test(value)) {
        value = value.replace(/-/gi, '/');
    } else {
        value = ""+value;
    }

    const time = new Date(value);

    const obj = {
        'yy+': time.getFullYear(),
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),

        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
    };

    for (let name in obj) {
        let timeStr = obj[name];
        timeStr = timeStr < 10 ? '0' + timeStr : timeStr;

        format = format.replace(new RegExp(name), timeStr);
    }

    return format;

}

util.isInWeixin = function(){
    var ua = navigator.userAgent,toLowerCase,
        state = false;

    if( /micromessenger/gi.test( ua ) ){
        state = true;
    }

    return state;
};

util.isInApp = function () { // 判断当前页面是否在泰生活app中
    var state = false;
    var ua = navigator.userAgent.toLowerCase();
    if (/TSH-Android/i.test(ua) || (/(iPhone|iPad|iPod|iOS)/i.test(ua) && /TSH-iOS/i.test(ua))) {
    // if (/TSH-Android/i.test(ua) || (/(iPhone|iPad|iPod|iOS)/i.test(ua) )) {
        state = true;
    }
    console.log("state:",state);
    return state;
};

util.sendToAppFn = function (msgObj: any) {
    /*
      {
              'command': 'loginsService',
              'parameter': loginObj,
              'callback': 'loginBack'
       }
    */

    var ua = navigator.userAgent.toLowerCase();
    if (/TSH-Android/i.test(ua)) {
        (<any>window).jsobj.NativeFunction(JSON.stringify(
            msgObj
        ))
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua) ) {
    // } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua) && /TSH-iOS/i.test(ua)) {
        (<any>window).webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify(
            msgObj
        ))
    }
};

util.todoDiffDeviceFn = function (androidFn: () => void, iosFn: () => void) {//11
    /*
      {
              'command': 'loginsService',
              'parameter': loginObj,
              'callback': 'loginBack'
       }
    */

    var ua = navigator.userAgent.toLowerCase();
    if (/TSH-Android/i.test(ua)) {
        if (androidFn && typeof androidFn == 'function') {
            androidFn();
        }
    // } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua) && /TSH-iOS/i.test(ua)) {
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        if (iosFn && typeof iosFn == 'function') {
            iosFn();
        }
    }
};

util.iosReadyFn = function(fn: () => void){
    (<any>window).webviewDidFinishLoading = function () { // 用于ios通知页面交互通道已经创建完成
        if( fn && typeof fn == 'function' ){
            fn();
        }
    };
};

util.isIphoneX = function(){
    var ua = navigator.userAgent.toLowerCase();

    if( util.isInApp() && util.isiOS() ){
        if( screen.height == 812 && screen.width == 375 ){
            return true;
        }else{
            return false;
        }

    }
}

util.toggleNavAction = function (state:any) {
  let targetStr = '';
  targetStr = state ? 'showNavAction' : 'hideNavAction';
  console.log('toggleNavAction----000000000000000', targetStr);
  util.todoDiffDeviceFn(
    function () {
      window.jsobj.NativeFunction(JSON.stringify({// 隐藏原生安卓导航栏方法
        'command': targetStr
      }));
      window.jsobj.NativeFunction(JSON.stringify({
        'command': 'changeDisplayMode',
        'parameter': {
          type: 2 //1 全屏布局 2状态栏下布局 3默认 → 原生导航栏下布局
        },
      }));
    },
    function () {
      function hideIosNavFn() {
        window.webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({// 隐藏原生ios导航栏方法
          'command': targetStr
        }));
        window.webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({
          'command': 'changeDisplayMode',
          'parameter': {
            type: 2 //1 全屏布局 2状态栏下布局 3默认 → 原生导航栏下布局
          },
        }));
      }

      // 非首次加载
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.NativeFunction) {
        console.log('toggleNavAction-ios-非首次加载----', targetStr);
        hideIosNavFn();
      } else {
        util.iosReadyFn(function () {
          hideIosNavFn();
        });
      }
    }
  );
};

// 清空cookie
util.clearCookie = function(){
    var myDate = new Date();
    var data = document.cookie;
    var dataArray = data.split("; ");
    for (var i = 0; i < dataArray.length; i++) {
        var varName = dataArray[i].split("=");
        document.cookie = varName[0] + "='';path=/;expires=" + myDate.toUTCString();
    }
};

// util.getShareUrl = function(){
//     return $api.friendUrl;
// };

//日期转化
util.formatStamp = function (datetime: string) {
    var date = new Date(parseInt(datetime));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    console.log('formatStamp  date ---',date);
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-" + month + "-" + sdate;//+" "+ hour +":"+ minute +":" + second;
    // 返回
    return result;
}
util.nativeFunction = function(str: any){
    // command: "startV2MiniProgram",//921  kyy  faceTime  ld
    //             parameter
    if (util.isiOS()) {
        (<any>window).webkit.messageHandlers.NativeFunction.postMessage(
          str
        );
    } else {
    (<any>window).jsobj.NativeFunction(// 是安卓手机
        str
    );
    }
}

/**
 * 
 * @param {*} obj  {"uri":that.$api.HomeAppId,"fragment":fragment}
 */
util.startV2MiniProgram = function(obj: { uri: any; fragment: string; }){
   
    let str = JSON.stringify({
        command: "startV2MiniProgram",
        parameter: {
          uri: obj.uri,
          fragment: encodeURI(obj.fragment)
        }
    });
    console.log("startV2MiniProgram str。。。。。。。。",str)
    if (util.isiOS()) {
        (<any>window).webkit.messageHandlers.NativeFunction.postMessage(
          str
        );
    } else {
    (<any>window).jsobj.NativeFunction(// 是安卓手机
        str
    );
    }
}

util.changeDisplayMode = function(type: any){
    // 服务	修改容器frame	 {type:"1"}
    //1 全屏布局 2状态栏下布局 3默认 → 原生导航栏下布局
    let str = JSON.stringify({
        command: "changeDisplayMode",
        parameter: {
        type: type||'3',
        }
    });
    console.log("changeDisplayMode str。。。。。。。。",str)
    if (util.isiOS()) {
        (<any>window).webkit.messageHandlers.NativeFunction.postMessage(
          str
        );
    } else {
    (<any>window).jsobj.NativeFunction(// 是安卓手机
        str
    );
    }
}

util.jsontoQuery = function(json: { [x: string]: string; }){
    var str="";
    var query="";
    for(var i in json){//i是对象的键值
        str+=i+"="+json[i]+"&";//json[i][j]是属性值
    }
    query=str.substring(0,str.length-1);
    return query;
}

// 神策埋点 &TD埋点
util.trackEventSCAndTD = function (id, eventName, params) {
  // 增加埋点的userId 和 uacId
  // 增加埋点的来源
  let param = JSON.parse(JSON.stringify(params))
  // 【 source	入口来源	STRING	"1-- 泰生活首页banner 2--泰生活健康页banner 3--特色服务专区"】
  switch(store.state.source){
    case "1":
      params.source="泰生活首页banner"
      break;
    case "2":
        params.source="泰生活健康页banner"
        break;
    case "3":
      params.source="特色服务专区"
      break;
  }
  console.info("--埋点参数--", id, params);
  // if (!!store.state.uacUserInfo) {
  //     param.uacId = store.state.uacUserInfo.uacId;
  //     param.userId = store.state.uacUserInfo.userId;
  // }
  let tdevent = new Promise((resolve, reject) => {
    if (window.TDAPP) {
      // TDAPP.onEvent.apply(null, arguments);
      // TDAPP.send();
    }
    resolve(true);
  });
  let sensores;
  sensores = window["sensorsDataAnalytic201505"];
  sensores.track(id, params);
  return tdevent;
};

export default util;
