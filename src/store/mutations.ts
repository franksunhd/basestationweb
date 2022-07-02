export default {
  //修改来源
  changeSource(state:any,  source: any) {
    state.source = source
  },
  // loading 设置
  setLoadingwrapShowFlag(state:any,  loadingwrapShowFlag: any) {
    state.loadingwrapShowFlag = loadingwrapShowFlag
  },
  changePageCount(state:any, pageCount: any) {
      state.pageCount += pageCount;
      console.info("页面的变化 ==== ", state.pageCount);
  },
  // title设置
  setTitle(state: any, title: any) {
      state.title = title;
  },
  // 是否显示导航
  setShowNav(state: any, bool: any) {
      state.showNav = bool;
  },
  // 阻拦安卓返回键
  stopAndroidBack(state: any, bool: any) {
      console.log("安卓物理返回键触发在弹窗上了吗", bool);
      state.isStopAndroidBack = bool;
  },
  // 更改openid
  changeOpenid(state: any, openid: any) {
      state.openid = openid;
  },
  // 更改token
  changeToken(state: any, token: any) {
      state.token = token;
  },
  // 更改接口请求的渠道
  changeServiceChannel(state: any, channel: any) {
      state.serviceChannel = channel;
  },
  // 更改活动id
  changeActivityId(state:any, activityId: any) {
      state.activityId = activityId;
  },
  // 更改子活动id
  changeSubActivityId(state: any, subActivityId: any) {
      state.subActivityId = subActivityId;
  },
  // 更改科室cd
  changeDepCd(state: any, depCd: any) {
    state.depCd = depCd;
  },
  // 更改用户信息
  changeUserInfo(state: any, userInfo: any) {
      state.userInfo = userInfo;
  },
  changeAgreeStatus(state: any, bool: any) {
      state.agreeStatus = bool;
  },
  // 导航栏控制
  changeHeaderControl(state: any, headerControl: any) {
      state.headerControl = headerControl;
  },
  // 医院弹窗控制
  changeHosPopShow(state: any, hosPopShow: any) {
    state.hosPopShow = hosPopShow;
  },
  // 搜索医院导航显示的医院信息
  changeHosInfo(state: any, hosInfo: any) {
    state.hosInfo = hosInfo;
  },
  changeAppId(state:any, payload: { key: string | number; value: any; }) {
      state.appInfo[payload.key] = payload.value;
  },
  // 获取小结Id
  changeOrderId(state: any, orderId: any) {
      state.orderId = orderId;
  },
  // 改变IM页面中大图
  changeImgUrl(state: any, isBigUrl: any) {
      state.isBigUrl = isBigUrl;
  },
  goCloseImg(state: any, docloseImg: any) {
      state.docloseImg = docloseImg;
  },
  // 结束咨询提示
  changeTip(state: any, endTip: any) {
      state.endTip = endTip;
  },
  // IM页面弹窗
  changeToast(state: any, isToast: any) {
      state.isToast = isToast;
  },
  // 关闭弹窗
  closeToast(state: any, doCloseToast: any) {
      state.docloseToast = doCloseToast;
  },
  // 添加 病历提交flag控制
  fileIds(state: any, fileIds: any) {
      state.fileIds = fileIds;
  },
  // 添加 病历提交flag控制
  RecordText(state: any, RecordText: any) {
      state.RecordText = RecordText;
  },
  // 结束按钮
  changeShowEnd(state: any, isShow: any) {
      state.showEnd = isShow;
  },
  // 活动渠道
  changeActiveChannel(state: any, activeChannel: any) {
      state.activeChannel = activeChannel;
  },
  // ios健康设置头部区域
  setNavStyle(state: any, navStyle: any) {
      state.navStyle = navStyle;
  },
  // 是否同意知情同意书
  setIsICF(state: any, isICF: any) {
      state.isICF = isICF;
  },
    
};
