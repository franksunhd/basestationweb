<!--  -->
<template>
  <div class="orderDetail">
    <div class="baseInfo">
      <div class="status">{{statusNameShow}}</div>
      <div class="items" >
        <div class="keys">
          <span class="key">就诊人</span>
          <span class="key">联系人</span>
          <span class="key">期望就诊医院</span>
          <span class="key">期望就诊科室</span>
          <span class="key">期望就诊时间</span>
          <span class="key" v-show="basearrow=='up'">病情描述</span>
        </div>
        <div class="vals">
          <span class="val">{{baseInfo.seeDoctorManName}}</span>
          <span class="val">{{baseInfo.linkman}}</span>
          <span class="val">{{baseInfo.applyHospitalName}}</span>
          <span class="val">{{baseInfo.applyDepartmentName}}</span>
          <div class="val flexb">
            <span class="txt">{{baseInfo.applySeeTime}}</span>
            <div class="opt" v-show="basearrow=='down'" @click="changeArrow('up');">
              <img :src="img_base_url+'/baseHos/arrowd@2x.png'" alt="" class="arrow">
            </div>
          </div>
          <div class="val up" v-show="basearrow=='up'">
            <span class="txt">{{baseInfo.remark}}</span>
            <span class="txt">
              <div class="opt right"  @click="changeArrow('down');" >
                <img :src="img_base_url+'/baseHos/arrowup@2x.png'" alt="" class="arrow ">
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="processInfo">
      <div class="ptitle">
        <span class="line"></span>
        <span class="txt">流程信息</span>
      </div>
      <div class="itemwrap" >
        <div class="pitem " 
          v-for="(oritem,tindex) in ordCycleList"  
          :key="'or'+tindex"
        >
          <span class="pstatus " 
          :class="{'org':tindex==0}"
          ></span>
          <div class="info "
          :class="{'first':tindex==0,'last':tindex==(ordCycleList.length-1)}"
          >
            <span class="txt ">
              {{oritem.statusNameShow}}
              <!-- {{oritem.statusName+""+oritem.statusCd}} -->
            </span>
            <div class="pcardWrap" v-if="oritem.statusCd=='4'&& oritem.ordCycleInfo">
              <div class="pcard"  >
                <div class="citem">
                  <span class="pkey">就诊医院</span>
                  <span class="pval">{{oritem.ordCycleInfo.hospitalName}}</span>
                </div>
                <div class="citem">
                  <span class="pkey">就诊科室</span>
                  <span class="pval">{{oritem.ordCycleInfo.hospitalDepartmentName}}</span>
                </div>
                <div class="citem">
                  <span class="pkey">就诊时间</span>
                  <span class="pval">{{oritem.ordCycleInfo.hospitalTime}}</span>
                </div>
                <div class="citem">
                  <span class="pkey">就诊医生</span>
                  <span class="pval">{{oritem.ordCycleInfo.doctorName}}</span>
                </div>
              </div>
            </div>
            <div class="time" v-if="oritem.createTime">
              {{oritem.createTime}}
            </div>
          </div>
        </div>
        <!-- <div class="pitem" >
          <div class="pstatus"></div>
          <div class="info last">
            <div class="txt">已下单</div>
            <div class="time">{{ordCycleInfo.appointmentTime}}</div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted,
onActivated,
getCurrentInstance,
} from 'vue'
import {useStore} from "vuex";
import { useRouter,useRoute,onBeforeRouteLeave } from 'vue-router';
import { log } from 'console';
interface DataProps {}
export default {
    name: 'orderDetail',
      setup() {
          console.log('1-开始创建组件-setup')
          // @ts-ignore
          const { proxy } = getCurrentInstance();
          
          const router = useRouter();
          const route = useRoute();
          const $store = useStore();

          const data = reactive({
            baseInfo:{
              "status":'',
              "statusName":'',
              "seeDoctorManName":"",
              "linkman":"",
              "applyHospitalName":"",
              "applyDepartmentName":"",
              "applySeeTime":"",
              "remark":"",
            },
            baseInfo00:{
              "status":'订单状态code',
              "statusName":'订单状态',
              "seeDoctorManName":"康旭宁",
              "linkman":"康旭宁2",
              "applyHospitalName":"北京协和医院",
              "applyDepartmentName":"皮肤科",
              "applySeeTime":"2019-06-16",
              "remark":"以前某时间因为某某症状，做了某某检查，发现某某问题，要做手术，近来症状有XX变化，用了XX治疗，后来又出现了XX情况，现在情况XXXX，希望了解手术方面的情况。",
            },
            statusNameShow:"",
            ordCycleInfo:{
              appointmentTime:"",// 下单时间
              hospitalName:"",
              hospitalDepartmentName:"",
              hospitalTime:"",
              doctorName:"",
              createTime:"",
            },
            ordCycleList:[
              {
              statusName:"",
              statusNameShow:"",
              statusCd:"",
              createTime:"",
              ordCycleInfo:{}
            }
            ],
            basearrow:"down",
            tabs:[
              {ids:["1","2","3","4","5","7","9","55"],name:"全部",stxt:false},
              {ids:["1"],name:"待处理",stxt:false},
              {ids:["2","3"],name:"服务中",stxt:false},{ids:["4"],name:"待出号",stxt:false},
              {ids:["5"],name:"待陪诊",stxt:true},{ids:["7"],name:"已就诊",stxt:true},
              {ids:["9"],name:"已取消",stxt:false},{ids:["55"],name:"已爽约",stxt:true},
            ],
            processInfo:{
            }
          })
          const refData = toRefs(data);
          onBeforeMount(() => {
            console.log('2.组件挂载页面之前执行----onBeforeMount');
          })
          onMounted(() => {
          })
          onActivated(()=>{
            init();
          });
          
          onBeforeRouteLeave((to, from, next)=>{
            clearData();
            next();
          });
          let changeArrow=(s)=>{
            console.log("changeArrow==",s);
            data.basearrow=s;
          };
          const init=()=>{
            $store.commit('changeHeaderControl', {
              title: "",
              routeName:"orderDetail",
              navArrowColor:"#333",
            });
            proxy.$util.trackEventSCAndTD("health_view_zhudiandetail",'浏览驻点服务订单详情页',{page_name:"驻点服务订单详情页"})
            // 浏览驻点服务订单详情页	health_view_zhudiandetail	浏览驻点服务订单详情页	page_name	页面名称	STRING	驻点服务订单详情页
            getOrdCycleInfoFunc();
            getGreenApplicationInfoFunc();
          }
          const clearData=()=>{
            data.baseInfo={
              "status":'',
              "statusName":'',
              "seeDoctorManName":"",
              "linkman":"",
              "applyHospitalName":"",
              "applyDepartmentName":"",
              "applySeeTime":"",
              "remark":"",
            }
            data.ordCycleList=[];
          }
          const  getGreenApplicationInfoFunc = async ()=>{
            $store.commit('setLoadingwrapShowFlag', true);
            console.log("路由参数获取",route.query);
            data.baseInfo={
              "status":'',
              "statusName":'',
              "seeDoctorManName":"",
              "linkman":"",
              "applyHospitalName":"",
              "applyDepartmentName":"",
              "applySeeTime":"",
              "remark":"",
            }
            try{
              const res = await proxy.$api.getGreenApplicationInfo({"serveCode":route.query.serveCode})
              console.log("getGreenApplicationInfo res==>",res);
              $store.commit('setLoadingwrapShowFlag', false);
              if ( res ) { 
                data.baseInfo ={
                  "status":res.status,//||'5'||'订单状态code',
                  "statusName":res.statusName,//||'待处理'||'订单状态code',
                  "seeDoctorManName":res.seeDoctorManName,
                  "linkman":res.linkman,
                  "applyHospitalName":res.applyHospitalName,
                  "applyDepartmentName":res.applyDepartmentName,
                  "applySeeTime":res.applySeeTime,//||"期望就诊时间",
                  // "remarks":res.seeDoctorManName||"病情描述sss",
                  "remark":res.remark,//||"病情描述详细详细",
                }
                dealStatus(res.status);
                console.log("订单基本信息==",data.baseInfo);
              }  
            }catch(err){
              console.log("getGreenApplicationInfo err==>",err);
              $store.commit('setLoadingwrapShowFlag', false);
            }
          };
          const dealStatus = async (code)=>{
            for(var i in data.tabs){
              let ctype
                = {
                ids: [""] as Array<String>,
                name: '' as string,
                stxt:false as Boolean
              }
              // @ts-ignore
              ctype = (data.tabs)[i];
              console.log("data.tabs==",ctype,ctype.ids);
              if((ctype.ids).indexOf(code)!=-1 ){
                data.statusNameShow = ctype.name
              }
            }
          }
          const  getOrdCycleInfoFunc = async ()=>{
            $store.commit('setLoadingwrapShowFlag', true);
            data.ordCycleList=[];
            console.log("路由参数获取",route.query);
            try{
              const res = await proxy.$api.getOrdCycleInfo({"serveCode":route.query.serveCode})
              console.log("getOrdCycleInfo res==>",res);
              $store.commit('setLoadingwrapShowFlag', false);
              if ( res ) {
                dealCycleData(res);
              }
              
            }catch(err){
              console.log("getOrdCycleInfo err==>",err);
              $store.commit('setLoadingwrapShowFlag', false);
            }
          };
          const dealCycleData = async (res)=>{
            let appInfoArr:Array<object> = [];
            // if(typeof res == 'object'){
            //   appInfoArr.push (res);
            //   // appInfoArr.push (res);
            // }else{
              
            // }
            appInfoArr=res;
            let jlen = appInfoArr.length;
            let ordCycleListShow:any=[];
            for(let j= 0;j<jlen; j++){
              let aaInfo:any = (appInfoArr)[j]
              let ordCycleList = aaInfo.ordCycleList||[];
              let appointmentInfo = aaInfo.appointmentInfo?aaInfo.appointmentInfo[0]:{
                createTime:""
              };
              let len = ordCycleList.length;
              
              for(let i= 0;i<len; i++){//statusName
                let citem = ordCycleList[i];
                let showItem:any={
                  statusName:citem.statusName?citem.statusName:"",
                  statusNameShow:"",
                  statusCd:citem.statusCd,
                  createTime:"",
                };
                let len2 = ordCycleListShow.length
                // console.log("ordCycleList  ==>",citem); statusCd
                //  9 已取消
                //  5 ==> 待就诊 7==> 已就诊
                //  4 ==>  【没有5】待出号  【含5】 "已出号" 卡片信息  节点是5才会有预约信息
                //  1,2,3== 一个节点 订单待处理  【含4】订单已处理
                // 默认节点  2,3,4,5,7  or  2,3,4,7 
                console.log(citem.statusCd);
                switch(citem.statusCd){
                  case '7':
                    showItem.statusNameShow = "已就诊";
                    ordCycleListShow.push(showItem);
                    break;
                  case '5':
                    showItem.statusNameShow = "待就诊";
                    if(len2==0||ordCycleListShow[len2-1].statusCd!=="7"){
                      ordCycleListShow.push(showItem);
                    }
                    break;
                  case '4':
                    showItem.statusNameShow = "待出号";
                    // 【没有5】待出号  【含5】 "已出号" 卡片信息  节点是5才会有预约信息
                    // if(len2>1||ordCycleListShow[len2-1].statusCd=="5"||ordCycleListShow[len2-1].statusCd=="7"){
                    if(appointmentInfo?.hospitalTime){
                      let hdatestr = appointmentInfo?.hospitalTime?proxy.$util.dateFtt("yyyy-MM-dd hh:mm",new Date(parseInt(appointmentInfo?.hospitalTime)) ):"";
                      let ordCycleInfo= {
                        hospitalName:appointmentInfo.hospitalName,
                        hospitalDepartmentName:appointmentInfo.hospitalDepartmentName,
                        hospitalTime:hdatestr,
                        doctorName:appointmentInfo.doctorName,
                      }
                      showItem.statusNameShow = "已出号";
                      showItem.ordCycleInfo = ordCycleInfo;
                    }
                    console.log("showItem 4 44444==",showItem);
                    ordCycleListShow.push(showItem);
                    break;
                  case '2':
                  case '3':
                  case '1':
                    
                  case '1':
                    if(citem.beforeStatusCd=="7"){
                      // ordCycleListShow.pop();
                      let createTimeStr = citem?.createTime?proxy.$util.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(parseInt(citem.createTime)) ):"";
                      showItem.statusNameShow = "已下单";
                      showItem.createTime = createTimeStr;
                      ordCycleListShow.push(showItem);
                    }else{
                      // 1,2,3== 一个节点 订单待处理  【含4】订单已处理
                      showItem.statusNameShow = "订单待处理";
                      // 1,2,3== 一个节点 订单待处理  【含4】 订单已处理
                      if(len2>1&&ordCycleListShow[len2-1].statusCd=="4"){
                        showItem.statusNameShow = "订单已处理";
                      }
                      let datestr0 = citem?.createTime?proxy.$util.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(parseInt(citem.createTime)) ):"";
                      showItem.createTime = datestr0;
                      if(len2==0||ordCycleListShow[len2-1].statusCd=="4"){
                        ordCycleListShow.push(showItem);
                      }
                      break;
                      }
                    break;
                  
                  case '9':
                    showItem.statusNameShow = "已取消";
                    ordCycleListShow.push(showItem);
                    break;
                  default:
                    console.log("不符合状态的订单不做处理");
                    
                }
                console.log("ordCycleListShow==>",ordCycleListShow);
              }
              if(j==jlen-1||len==0){
                if(len==0){//接口没有任何数据  需要额外加一个待处理节点
                  ordCycleListShow.push({
                    statusName:"",
                    statusNameShow:"订单待处理",
                    statusCd:"0",
                    createTime:"",
                    ordCycleInfo:{}
                  })
                }
                ordCycleListShow.push({
                  statusName:"",
                  statusNameShow:"已下单",
                  statusCd:"0",
                  createTime:aaInfo.commitTime||"",
                  ordCycleInfo:{}
                })
              }
            }
            data.ordCycleList=ordCycleListShow;
          }
          return {
              ...refData,
              changeArrow,
          }

      }
  };
</script>
<style lang='scss' scoped>
.orderDetail{
  width: 100%;
  height: 100%;
  opacity: 1;
  background: rgba(242,246,250,1);
  display: flex;
  flex-direction: column;
  padding-top: 46px;
  .baseInfo{
    // height: 238px;
    padding:0px 20px 30px 20px;
    box-sizing: border-box;
    text-align: left;
    vertical-align: middle;
    .status{
      // padding:22px;
      height: 54px;
      color: rgba(51,51,51,1);
      font-size: 24px;
      font-weight: bold;
      line-height: 54px;
      box-sizing: border-box;
    }
    .items{
      display: flex;
      .keys{
        margin-right: 22px;
        .key{
          margin-top:16px;
          height: 16px;
          line-height: 16px;
          font-size: 15px;
          font-weight: 400;
          color: rgba(136,136,136,1);
          display: block;
        }
      }
      .vals{
        flex: 1;
        .val{
          margin-top:16px;
          display: block;
          line-height: 16px;
          font-size: 15px;
          font-weight: 400;
          color: rgba(51,51,51,1);
          .txt{
            // height: 31px;
            line-height: 16px;
            font-size: 15px;
            font-weight: 400;
            color: rgba(51,51,51,1);
            
          }
          .opt{
            width: 48px;
            height: 24px;
            line-height: 24px;
            border-radius: 16px;
            opacity: 1;
            border: 0.5px solid #E4E6EB;
            box-sizing: border-box;
            background: rgba(255,255,255,1);
            text-align: center;
            vertical-align: middle;
            display: flex;
            align-items: center;
            justify-content: center;
            // float: right;
              // <img src="@assets/imgs/arrowd@2x.png" alt="" class="arrow">
            .arrow{
              width: 16px;
              height: 16px;
              // margin-top: 3px;;
              // background: lightblue;
            }
            
          }
          .right{
            // text-align: right;
            display: block;
          }
        }
        .flexb{
          display: flex;
          justify-content: space-between;
          align-items: center;
          // background: green;
          height: 16px;
          line-height: 16px;
        }
        .val.up{
          .txt{
            width: 100%;
            // background: yellow;
            display: block;
          }
          .opt{
            display: inline-block;
            float: right;
          }
        }
      }
    }
  }
  .processInfo{
    // flex: 1;
    overflow-y: scroll;
    width: 100%;
    border-radius: 10px;
    opacity: 1;
    background: rgba(255,255,255,1);
    box-shadow: 0 -4px 13px 0 rgba(0,0,0,0.03);
    padding:5px 20px 35px 0px;
    box-sizing: border-box;
    text-align: left;
    vertical-align: middle;
    padding-bottom: 60px;
    .ptitle{
      height: 56px;
      line-height: 56px;
      // display: inline;
      // margin-bottom: 15px;
      .line{
        width: 6px;
        height: 16px;
        border-radius: 3px ;
        opacity: 1;
        background: rgba(238,120,0,1);
        margin-right: 20px;
        margin-left: -2px;
        display: inline-block;
      }
      .txt{
        
        opacity: 1;
        color: rgba(51,51,51,1);
        font-size: 18px;
        font-weight: bold;
        
      }
    }
    .pitem{
      margin: 0px 23px 0 19px;
      // border-left: 1px dashed #E4E6EB;
      display: flex;
      align-items: baseline;
      .pstatusWrap{
        width:16px;
        height: 31px;
        margin-left: -8px;
        margin-right: 15px;
        top: -4px;
        position: relative;
        z-index: 9;
        display: inline-block;
        background: #FFFFFF;
        box-sizing: border-box;
      }
      .pstatus{
        width:16px;
        height: 16px;
        margin-left: -8px;
        background: #FFFFFF;
        margin-right: 15px;
        background: url("@assets/imgs/cgrey@2x.png") no-repeat;
        background-size: cover;
        z-index: 9;
        box-sizing: border-box;
      }
      
      .pstatus.grey{
        background: url("@assets/imgs/cgrey@2x.png") no-repeat;
        background-size: 16px 16px;
      }
      
      .pstatus.org{
        background: url("@assets/imgs/corg@2x.png") no-repeat;
        background-size: 16px 16px;
        // width:16px;
        // height: 16px;
        // margin-left: 0px;
        // z-index: 11;
        // display: inherit;
      }
      .pstatus.first{
        padding-top:15px;
        height: 31px;
        background-position: 0 0,0 15px;
      }
      .info{
        flex: 1;
        width: 100%;
        border-left: 1px dashed #E4E6EB;
        margin-left: -23px;
        padding-left:22px;
        box-sizing: border-box;
        .txt{
          height: 31px;
          opacity: 1;
          color: rgba(188,188,188,1);
          color: rgba(51,51,51,1);
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          line-height: 31px;
        }
        .pcardWrap{
          width: 100%;
          height: 132px;
          border-radius: 5px;
          opacity: 1;
          background: linear-gradient(121.5deg, rgba(242,245,252,1) 0%,
             rgba(240,243,252,1) 100%)
             ;
          background-size: 100%,100%,100px 100px;
          margin-bottom: 15px;
          padding:14px 0 14px 16px;
          box-sizing: border-box;
        }
        .pcard{
          width: 100%;
          height: 100%;
          border-radius: 5px;
          background:url("@assets/imgs/cardBG@2x.png") no-repeat right top;
          background-size: 100px 100px;
          .citem{
            height: 26px;
            opacity: 1;
            color: rgba(136,136,136,1);
            font-size: 14px;
            text-align: left;
            line-height: 26px;
            .pkey{
              margin-right: 16px;
            }
            .pval{
              color: rgba(51,51,51,1);
            }
          }
          .bgImg{
            width: 100px;;
            height: 100px;
            background:url("@assets/imgs/cardBG@2x.png");
            text-align: right;
          }
        }
        .pcard2::after{
          content: ""; // ::before and ::after both require content
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;;
          height: 100px;
          background-image:url("@assets/imgs/cardBG@2x.png");
          background:red;
        }
        .time{
          margin-top:6px;
          margin-bottom: 15px;
          height: 13px;
          color: rgba(153,153,153,1);
          font-size: 13px;
          text-align: left;
          line-height: 13px;
        }
        
      }
      .info.first{
        margin-top: -8px;
        padding-bottom: 8px;
        .txt{
          height: 16px;
          opacity: 1;
          color: rgba(188,188,188,1);
          color: rgba(51,51,51,1);
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          line-height: 16px;
        }

      }
      .info.last{
        border: none;
      }
      
    }
    .pitem.first{
      margin-top: 8px;
      .txt{
        height: 16px;
        line-height: 16px;
        // margin-bottom: 8px;
      }
    }
  }
}
</style>