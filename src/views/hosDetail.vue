<!-- 医院介绍页面 -->
<template>
  <div class="hosDetail">
    <div class="header" v-show="true">
      <van-swipe 
        :loop="true" 
        :show-indicators="true"
        :autoplay="3000" 
        lazy-render
      >
        <van-swipe-item v-for="(img,i) in detailInfo.hImgs" :key="'p'+i" >
          <div class="picItem">
            <img :src="img_base_url+'/baseHos/'+img"  alt="" class="picImg">
          </div>
        </van-swipe-item>
        <template #indicator="{ active }">
          <div class="custom-indicator">
            <span class="dot" 
              :class="{'active':i==active}"
              v-for="(img,i) in detailInfo.hImgs" :key="'d1'+i"
            >
            </span>
          </div>
        </template>
      </van-swipe>
    </div>
    <div class="body">
      <div class="desc">
        <span class="title">{{detailInfo.name}}</span>
        <div class="ul">
          <div class="li" v-for="(f,i) in detailInfo.features" :key="'f'+i">
            <van-icon name="checked" color="#FF7700" size="17"  />
            <span class="ss">{{f.name}} </span>
          </div>
          <!-- <div class="li">
            <van-icon name="checked" color="#FF7700"  size="17"/>
            <span class="ss">省市医保</span>
          </div> -->
        </div>
        <p class="txt "
        :class="{'simple':txtStatus == 'simple'}"
        >
          {{detailInfo.moretxt}}
        </p>
        <p class="moreInfo" @click="showSorMore('more')" v-show="txtStatus == 'simple'">
          展开医院简介
          <van-icon name="arrow-down" />
        </p>
        <p class="moreInfo" @click="showSorMore('simple')" v-show="txtStatus == 'more'">
          收起医院简介
          <van-icon name="arrow-up" />
        </p>
        <div class="addList" v-if="detailInfo&&detailInfo.addList&&(detailInfo.addList).length>1">
          <van-swipe 
            :loop="false" 
            :show-indicators="true"
            lazy-render
          >
            <van-swipe-item v-for="(add ,i)  in detailInfo.addList" :key="'add'+i" >
              <div class="addrwrap"  >
                <div class="addtitle">{{add.addrtxt1}}</div>
                <div class="addDesc">{{add.addrtxt2}}</div>
              </div>
            </van-swipe-item>
            <template #indicator="{ active }">
              <div class="custom-indicator">
                <span class="dot" 
                  :class="{'active':i==active}"
                  v-for="(add,i) in detailInfo.addList" :key="'add1'+i"
                >
                </span>
              </div>
            </template>
          </van-swipe>
        </div>
        <div class="addrwrap"  v-if="detailInfo&&detailInfo.addList&&(detailInfo.addList).length==1">
          <div class="addtitle">{{(detailInfo.addList)[0].addrtxt1}}</div>
          <div class="addDesc">{{(detailInfo.addList)[0].addrtxt2}}</div>
        </div>
      </div>
      <div class="depwrap" v-show="detailInfo.dList">
        <div class="title">
          <span class="line"></span>
          <span class="txt">特色科室</span>
        </div>
        <div class="deptlist">
          <div class="depitem" v-for="(dept ,i)  in detailInfo.dList" :key="'d'+i">

            <img :src="img_base_url+'/baseHos/'+dept.depIcon"  alt="" class="depIcon">
            <span class="deptxt">{{dept.name}}</span>
          </div>
        </div>
      </div>
      <div class="imgInfo" v-show="detailInfo.imgInfo">
        医院图片来源：{{detailInfo.imgInfo}}
      </div>
    </div>
    <div class="pop" >
        <!-- closeable -->
      <van-popup
        v-model:show="hosPopShow"
        round
        position="bottom"
        :style="{ height: '472px' }"
      >
        <div class="popheader">
          <span class="title">驻场就医医院</span>
          <span class="close"
            @click="closeHosPop()"
          >
            <van-icon name="cross"  />
          </span>
        </div>
        <div class="popbody">
          <div class="addKind" 
            v-for="(hlist ,i)  in hosList" :key="'hlist'+i"  
            
          >
            <div class="addtxt">{{hlist.name}}</div>
            <div class="hlist">
              <div class="hitem"  
              v-for="(hitem ,j)  in hlist.harr" 
              :key="'hitem'+j" 
              @click="toHosDetail(hitem)"
              >
                <span class="txt">{{hitem.name}}</span>
                <span class="rarrow" ></span>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <!-- teleport="body" -->

    </div>
  </div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted,
onActivated,
getCurrentInstance,computed,
onUnmounted,
} from 'vue'

import {useStore} from "vuex";
import { useRouter,useRoute,onBeforeRouteLeave } from 'vue-router';
import {HosData} from "@utils/data"
interface DataProps {}
export default {
    name: 'hosDetail',
      setup(props,context) {
          console.log('1-开始创建组件-setup');
          // @ts-ignore
          const { proxy } = getCurrentInstance();
          
          const router = useRouter();
          const route = useRoute();
          const $store = useStore();
          const hosPopShow:any = computed(() => $store.state.hosPopShow);
          console.log("hos hosPopShow ==",hosPopShow);
          // const vueEvent = getCurrentInstance()?.appContext.config.globalProperties.vueEvent

          const data = reactive({
            videoInner:false,
            txtStatus:"simple",// more
            htxt:"",
            hosCode:"",
            hosList:[
              {
                code:"h01",name:"湖北 武汉",
                harr:[
                  {"code":"hosHztj","name":"华中科技大学同济医学院附属同济医院"},
                  {"code":"hosTktj","name":"泰康同济(武汉)医院"},
                ]
              },
              {
                code:"h02",name:"江苏 南京",
                harr:[
                  {"code":"hosNjxlgl","name":"南京大学医学院附属鼓楼医院"},
                  {"code":"hosTkxlgl","name":"泰康仙林鼓楼医院"},
                ]
              },
              {
                code:"h03",name:"湖北 武汉",
                harr:[
                  {"code":"hosFdhs","name":"复旦大学附属华山医院"},
                ]
              }
            ],
            // {"code":"01","name":"上海交通大学医学院附属瑞金医院"},
            detailInfo:{},
            detailInfo00:{
              hImgs:[
                'hbg.jpg',
                'hbg1.jpg',
                'hbg2.jpg',
                'hbg3.jpg',
              ],
              "name":"泰康同济（武汉）医院",
              "features":[
                {"name":"三级综合"},
                {"name":"省市医保"},
              ],
              stxt:
              "泰康同济武汉医院是世界500强企业泰康保险集团全资投资、与华中科技大学同济医学院附属同济医院合作管理，按照三级甲等标准新建的高品质综合医院，…"
              ,
              moretxt:
              "泰康同济（武汉）医院是世界500强企业泰康保险集团全资投资、与华中科技大学同济医学院附属同济医院合作管理，按照三级甲等标准新建的高品质综合医院。医院以提供高品质医疗服务和全流程照护为特色，为患者及客户朋友提供多层次的医疗保健服务，全面提升就医体验，给患者及客户朋友充分的人文关怀和隐私照顾。"
              // "moretxtmoretxtmoretxt泰康同济武汉医院是世界500强企业泰康保险集团全资投资、与华中科技大学同济医学院附属同济医院合作管理，按照三级甲等标准新建的高品质综合医院，…"
              ,
              "addrtxt1":"四新北路322号",
              "addrtxt2":"湖北省武汉市汉阳区四新北路与连通港路交汇处",
              dList:[
                {
                  id:"01",
                  depIcon:"d01.png",
                  name:"普外科",
                },
                {
                  id:"02",
                  depIcon:"d02.png",
                  name:"眼科",
                },
                {
                  id:"03",
                  depIcon:"d03.png",
                  name:"骨科",
                },
                {
                  id:"04",
                  depIcon:"d04.png",
                  name:"皮肤科",
                },
                {
                  id:"05",
                  depIcon:"d05.png",
                  name:"口腔科",
                },
                {
                  id:"06",
                  depIcon:"d06.png",
                  name:"肿瘤科",
                },
                {
                  id:"07",
                  depIcon:"d07.png",
                  name:"康管中心",
                },
              ],
              imgInfo:"www.huashan.org.cn",
            },
            
          })
          onBeforeMount(() => {
            console.log('2.组件挂载页面之前执行----onBeforeMount')
          })
          onMounted(() => {
            console.log('3.-组件挂载到页面之后执行-------onMounted')
            // vueEvent.on('handleHosPop', (val: any) => {
            //   console.log("handleHosPop ====");
            //   showHosPop();
            // })
          })
         
          onUnmounted(() => {
            // vueEvent.off('handleHosPop')
          });
          onActivated(()=>{
            console.log('3.-组件挂载到页面之后执行-------onActivated')
            $store.commit('changeHeaderControl', {
              title: "",
              routeName:"hosDetail",
              navArrowColor:"#fff",
            });
            proxy.$util.trackEventSCAndTD("health_view_zhudianyiyuan",'浏览驻点服务医院详情页',{hospital_name:route.query.name})
            // 	health_view_zhudianyiyuan	浏览驻点服务医院详情页	hospital_name	医院名称	STRING	"华中科技大学同济医学院附属同济医院
            initData();
          });
          onBeforeRouteLeave((to, from, next)=>{
            clearData();
            next();
          });
          const refData = toRefs(data);
          const initData= ()=>{
            console.log("路由参数获取",route.query);
            let hcode:string = <string> route.query.code;
            $store.commit('changeHosInfo', 
              {
                "code":hcode,
                "name":route.query.name
              }
            );
           
            data.hosCode = hcode;
            data.detailInfo = HosData[hcode];
            console.log("配置的医院信息==",data.detailInfo);
            //发送
          };
          const clearData=()=>{
            data.hosCode = "";
            data.detailInfo = {};
          }
          const getSrc= (name:string)=>{
            name?name:name="vip_ic_yiliaos@2x.png"
            const path = `../src/assets/imgs/${name}`;
            return path;
              // return new URL(`../assets/imgs/${name}`, import.meta.url).href;
          };
          const getHSrc= (name:string)=>{
            console.log("getHSrc name",name);
            name?name:name="hbg.jpg"
            const path = `../src/assets/imgs/${name}`;
            return path;
          };
          const showSorMore= (s)=>{
            // txtStatus:"simple",// 
            data.txtStatus = s;
            // data.htxt = data.moretxt;
          }
          const showHosPop= ()=>{
            $store.commit('changeHosPopShow', true);
          }
          const closeHosPop= ()=>{
            $store.commit('changeHosPopShow', false);
          }
          
          function toHosDetail(i){//跳转医院介绍
            console.log("toHosDetail==",i.name,i,);
            // if(i.code==data.hosCode){
            //   console.log("同一个医院不切换===");
            // }else{
              data.detailInfo = HosData[i.code];
            // }
            $store.commit('changeHosPopShow', false);
            $store.commit('changeHosInfo', 
              {
                "code":i.code,
                "name":i.name
              }
            );
          }
          return {
              ...refData,hosPopShow,
              getSrc,getHSrc,showSorMore,
              toHosDetail,closeHosPop,

          }

      }
  };
</script>
<style lang='scss' scoped>
.hosDetail{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  // margin-top: -46px;
  padding-bottom: 46px;
  box-sizing: border-box;
  .header{
    height: 252px;// 252  电量44 headnav 46 
    .picItem{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .picImg{
        width: 120px;
        height: 140px;
        width: 100%;
        height: 252px;
      }
      .pictxt{
        font-size: 14px;
        line-height: 14px;
        /* identical to box height, or 100% */
        color: #333333;
      }
    }
    .custom-indicator {
      position: absolute;
      right: 20px;
      bottom: 42px;
      // padding: 2px 5px;
      height: 5px;
      display: flex;
      justify-content: space-between;
      // background: yellow;
      // dot" :class="{'active'
      .dot{
        display: inline-block;
        width: 5px;
        height: 5px;
        opacity: 1;
        background: rgba(255,255,255,0.6);
        // background: red;
        margin-right:4px;
        border-radius: 2px;
      }
      .active{
        width: 12px;
        height: 5px;
        border-radius: 3px;
        opacity: 1;
        background: rgba(255,255,255,1);
        // background: red;

      }
    }
  }
  .body{
    opacity: 1;
    // border: 2px solid rgba(1, 1, 1, 1);
    // border: 2px solid #fff;
    // background: linear-gradient(198.8deg, rgba(238,244,250,1) 0%, rgba(255,255,255,1) 100%);
    backdrop-filter: blur(25px);

    background: linear-gradient(199deg, #EDF3FA 0%, #FFFFFF 100%);
    opacity: 1;
    border: 2px solid #FFFFFF;
    border-radius: 12px;
    padding:28px 0px 28px 0px;
    box-sizing: border-box;
    flex:1;
    // overflow-y: scroll;
    text-align: left;
    margin-top:-30px;
    .desc{
      padding:0px 20px 0px 20px;
      .title{
        height: 28px;
        font-weight: bold;
        font-size: 22px;
        line-height: 28px;
        /* identical to box height, or 100% */
        color: #333333;
        border-bottom:1px solid #FAFAFA;
      }
      .ul{
        // padding-top: 15px;
        display: flex;
        justify-content: center;
        // align-items: center;
        justify-content: flex-start;
        height: 44px;
        line-height: 44px;
        // margin-top: 14px;
        .li{
          // flex: 1 1;
          .ss{
            font-size: 13px;
            // line-height: 15px;
            /* identical to box height, or 100% */
            color: #939599;
            margin-right: 15px;
            margin-left: 5px;
          }
          
        }
      }
      .txt{
        font-size: 14px;
        line-height: 21px;
        /* or 150% */
        color: #333333;
        margin-top:6px;
        margin-bottom:10px;
        overflow:hidden;
        
      }
      .simple{
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
      }
      .moreInfo{
        font-size: 13px;
        /* identical to box height, or 100% */
        color: #929499;
        line-height: 13px;
      }
      .addList{
        .custom-indicator {
          height: 15px;
          display: flex;
          justify-content: center;
          padding-top: 10px;
          box-sizing: border-box;
          .dot{
            display: inline-block;
            width: 5px;
            height: 5px;
            opacity: 1;
            background: #EEEEEE;
            // background: red;
            margin-right:4px;
            border-radius: 2px;
          }
          .active{
            width: 12px;
            height: 5px;
            border-radius: 3px;
            opacity: 1;
            background: #FF7700;

          }
        }
      }
      .addrwrap{// 30
        // margin-top:25px;
        height: 75px;
        box-sizing: border-box;
        padding:7px 0 16px 12px;
        border-radius: 6px;
        opacity: 1;
        // border: 1px solid rgba(1, 1, 1, 1);
        background: rgba(255,255,255,0.94);
        box-shadow: 0 28px 33px 0 rgba(0,0,0,0.03);
        border: 2px solid #FFFFFF;
        // background: rgba(255,255,255,0.94),url("@assets/imgs/addrwrapBG.png") ;
        // background-repeat: repeat,no-repeat,;
        // background-size: contain;
        // background-position: 0 0px,116px 0;
        // no-repeat right top;
        background: url("@assets/imgs/addrwrapBG.png") right no-repeat;
        background-size:220px 75px ;
        // background-size: cover;
        
        width: 100%;
        
        .addtitle{
          height: 32px;
          opacity: 1;
          color: rgba(51,51,51,1);
          font-size: 16px;
          font-weight: bold;
          line-height: 32px;
        }
        .addDesc{
          height: 17px;
          opacity: 1;
          color: rgba(147,149,153,1);
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
        }
      }

    }
  
    .depwrap{
      padding-top:20px;
      // padding-bottom: 16px;
      border-bottom: 1px solid #FAFAFA;
      .title{
        font-weight: 500;
        font-size: 20px;
        line-height: 20px;
        /* identical to box height, or 100% */
        color: #333333;
        .line{
          width: 6px;
          height: 16px;
          border-radius: 2px;
          opacity: 1;
          background: rgba(238,120,0,1);
          margin-left: -2px;
          display: inline-block;
          margin-right: 20px;
        }
        .txt{
          opacity: 1;
          color: rgba(51,51,51,1);
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
        }
        
      }
      .deptlist{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-top: 24px;
        padding:0 14px 0 14px;
        box-sizing: border-box;
        .depitem{
          width: 68px;
          // height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
          .depIcon{
            width: 28px;//11 22  11
            height: 28px;
            // margin-bottom: 10px;
          }
          .deptxt{
            font-size: 14px;
            line-height: 30px;
            height: 30px;
            /* identical to box height, or 100% */
            text-align: center;
            color: #333333;
          }
        }
      }
    }
    .imgInfo{
      margin-top: 30px;;
      height: 12px;
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #C9C9C9;
      line-height: 12px;
      padding-left: 20px;
    }
    
    .envWrap{
      padding-top:30px;
      padding-bottom: 16px;
      .title{
        font-weight: 500;
        font-size: 20px;
        line-height: 20px;
        /* identical to box height, or 100% */
        color: #333333;
        
      }
      .piclist{
        width: 100%;
        height: 190px;
        margin-top: 20px;
        
      }
    }
  }
  // class="popheader">
  //         <span class="title">驻场就医医院</span>
  //       </div>
  //       <div class="popbody">
  //         <div class="addKind">
  //           <div class="addtxt">湖北 武汉</div>
  //           <div class="hlist">
  //             <div class="hitem">
  //               <span class="txt">华中科技大学同济医学院附属同济医院</span>
  //               <span class="rarrow
  .pop{
    .popheader{
      height: 38px;
      margin-top:10px;
      padding:0 20px 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      justify-content: flex-end;
      .title{
        height: 38px;
        font-size: 18px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 38px;
        flex: 1;
      }
      .close{
        width:38px;
        // float: right;
        // line-height: 38px;
        // vertical-align: middle;
      }
    }
    .popbody{
      margin-top: 17px;;
      padding:0 16px 0 16px;
      .addKind{
        margin-bottom: 19px;;
        .addtxt{
          height: 22px;
          font-size: 12px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #999999;
          line-height: 22px;
          text-align: left;
          margin-bottom: 3px;;
        }
        .hlist{
          width: 343px;
          background: #FAFAFA;
          border-radius: 6px 6px 6px 6px;
          opacity: 1;
          padding:0 15px 0 15px;
          box-sizing: border-box;
          .hitem{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .txt{
              width: 272px;
              height: 48px;
              font-size: 16px;
              font-family: PingFang SC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 48px;
              text-align:left;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
              margin-right: 20px;
            }
            .rarrow{
              width: 16px;
              height: 16px;
              border-radius: 10px 10px 10px 10px;
              background: url("@assets/imgs/rarrow.png") no-repeat;
              background-size: 16px 16px;
            }
          }
        }
      }
    }
  }

}
</style>