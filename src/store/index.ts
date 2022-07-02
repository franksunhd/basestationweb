import { createStore } from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";




                
                
                
                
const state = {
  source:"",
  loadingwrapShowFlag: false,
  pageCount: 0, // 记录页面的数量，用于返回键返回
  title: "",
  showNav: "", // 是否展示自定义导航
  openid: "", // 微信设备
  token: "", // 泰生活App token
  serviceChannel: "", // 接口请求的渠道
  activityId: "", // 活动id
  subActivityId: "",// 子活动id
  depCd: '', // 科室cd
  userInfo: "", // 用户信息
  isBack: false,
  navStyle: "margin-top:0px;",
  backCount: 0, // 安卓点击物理返回键的次数，用于监听在某些页面物理返回键触发弹窗等
  isStopAndroidBack: false, // 是否阻拦安卓返回键返回上一页
  agreeStatus: false, // 协议书同意状态
  url: {},
  headerControl: {
      // isHide: true,
      navArrowColor:"#333",
      title: "",
      // backShow: false,
      // headerBor: false,
      // headerGor: false,
      // rightTitle: "",
      // headerBorder: false,
      // rightShow: false,
      routeName:"",
  },
  hosPopShow:false,
  hosInfo:{
    name:"",
    code:"",
  },
  rightShow: false,
  isConnected: true,
  routerIndex: 0,
  // 订单图片选择
  caseImgList: [],
  fileIds: [],
  textareaText: "",
  //小结Id
  orderId: "",
  appInfo: {
      userSign: "",
      appId: "",
      userId: "", // 泰生活的用户id
      tshUserId: "", // 泰生活的用户id
      imGroupId: "",
      orderId: "",
      patientId: "" // 互联网返回的患者id
  },
  // IM页面展示大图标识
  isBigUrl: false,
  docloseImg: false,
  // IM页面保存图片弹窗
  isToast: false,
  docloseToast: false,
  // 结束咨询提示
  endTip: false,
  height: 0,
  alive: [],//["ConsultReview", "ConsultHistory", "Consulting"],
  showEnd: false, // 结束咨询按钮
  activeChannel: "defaultChannel",
  isICF: "", // 是否同意知情同意书
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
