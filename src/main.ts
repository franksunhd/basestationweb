import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
// import '@babel/polyfill';
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

// 导入router和store
import router from './router/index'
import store from './store/index'
import '@utils/sensorsdataTool';
import util from "@utils/util";
app.config.globalProperties.$util = util

import 'amfe-flexible/index.js'
import '@assets/common.css'
import vantUtil from '@utils/vantUtil'
vantUtil(app);

import {preventReClick} from '@utils/preventReClick' //防多次点击，重复提交
// 引入公用的接口调用
import interfaceAPI from "@api/interface";
import UserService from '@api/user'

app.config.globalProperties.$api = UserService;
app.config.globalProperties.$interfaceAPI = interfaceAPI;
import Vconsole from 'vconsole'

// 上传图片两个路径
// app.config.globalProperties.img_base_url = <string>import.meta.env.VITE_APP_IMG_URL;
console.log(import.meta.env.VITE_APP_IMG_URL=="https://medicaluat.mobile.taikang.com/tlifeimg/baseStationWeb/");
if(import.meta.env.VITE_BUILD_ENV!= 'production'){
  if(import.meta.env.VITE_BUILD_ENV== 'beta'){
    let vConsole:any = new Vconsole();
    app.use(vConsole)
  }
  app.config.globalProperties.img_base_url = "https://medicaluat.mobile.taikang.com/tlifeimg/baseStationWeb/";
}else{
  app.config.globalProperties.img_base_url = "https://medical.mobile.taikang.com/tlifeimg/baseStationWeb/";
}


const initFn = async () => {
  app.use(store).use(router).mount('#app');
}
if (util.isInApp()) {// 泰生活App中
  store.commit("setShowNav", true);// app中显示自定义导航
  util.todoDiffDeviceFn(
      function () {
          // 调用原生安卓方法获取token信息
          (<any>window).jsobj.NativeFunction(JSON.stringify({
              "command": "loginInfo",
              "callback": "infoBack"
          }));
      },
      function () {
          util.iosReadyFn(function () {
            (<any>window).webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({
                  "command": "userJWTService",
                  "callback": "infoBack"
              }));
          });
      }
  );
  (<any>window).infoBack = (data:any) => {
    console.log("infoBack----app返回登录信息----，也可证明ios加载js完毕", data)
    if (typeof data === "string") {
      let resData = JSON.parse(data)
      if (!!resData.token) {
        store.commit("changeToken", resData.token)
      }
    } else {
      if (data.token) {
        store.commit("changeToken", data.token)
      }
    }
    initFn()
  };
} else {// 非泰生活app
  console.log("=====",process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {// 开发环境显示自定义导航
    store.commit("setShowNav", true);
  }
  initFn();
}

