let server_url="";
let env  = import.meta.env.VITE_BUILD_ENV
if (env !== "production") {
    server_url = "https://domtest.taikanglife.com/sa?project=bybo"
} else if (process.env.VUE_APP_MODE == "production"){
    server_url = "https://dom.taikanglife.com/sa?project=bybo"
}
var sensors = window['sensorsDataAnalytic201505'];
console.log('埋点啊------',sensors);
sensors.init({
    server_url: server_url,
    heatmap:{scroll_notice_map:"not_collect"},
    is_track_single_page:true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
    use_client_time:true,
    send_type:'beacon',
    show_log:false
});
sensors.registerPage({
    business_id: 'health',
    business_name: '健康'
});
sensors.quick('autoTrack'); //用于采集 $pageview 事件。

// // 获取userid和uacid并且作为登录神策id
// util.getUserInfoAndLoginSa = function () {
//   let url = process.env.VUE_APP_API_URL + "/bu-health/miniapp/getUserInfo";
//   if (process.env.NODE_ENV === "development") {
//       url = "/api/bu-health/miniapp/getUserInfo";
//   } else {
//       url = process.env.VUE_APP_API_URL + "/bu-health/miniapp/getUserInfo";
//   }
//   axios.get(url, {
//       params: {
//           miniAppid: process.env.VUE_APP_APPID
//       }
//   }).then(res => {
//       if (res.data.code === 0) {
//           let data = res.data.data;
//           store.commit("changeUacUserInfo", data);
//           let sensores;
//           sensores = window["sensorsDataAnalytic201505"];
//           sensores.login(data.uacId); // 登录神策
//           sensores.setProfile({userId: data.userId}); // 设置用户属性
//       }
//   });
// };


// 神策&TD埋点
const trackEventSCAndTD = function (id, eventName, params = {}) {
  // 增加埋点的userId 和 uacId
  // if (!!store.state.uacUserInfo) {
  //     params.uacId = store.state.uacUserInfo.uacId;
  //     params.userId = store.state.uacUserInfo.userId;
  // }
  // 增加埋点的来源
  if (!!store.state.sourcePageFrom) {
      params.origin_attribute = store.state.sourcePageFrom;
  }
  console.warn("--埋点参数--", id, params);
  let tdevent = new Promise((resolve, reject) => {
      if (window.TDAPP) {
        TDAPP.onEvent.apply(null, id, eventName, params);
        TDAPP.send();
      }
      resolve(true);
  });
  let sensores;
  sensores = window["sensorsDataAnalytic201505"];
  sensores.track(id, params);
  return tdevent;
};
