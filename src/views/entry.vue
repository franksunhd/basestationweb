<!-- 驻点服务落地页  -->
<template>
  <div class="entry" ref="entry">
    <div class="bgwrap" :style="{backgroundImage: 'url('+img_base_url + 'baseHos/img1.png)'}">
      <div class="video">
        <!-- <video 
          :src="img_base_url+'/video/entryIntro.mp4'"
          controls="controls"
          class="varea"
        ></video> -->
        <!-- 封面图片
           <video    webkit-playsinline="true"  x5-playsinline=""  playsinline=""  webkit-playsinline=""> -->
           
        <video ref="videoPlayer" controls 
          :src="img_base_url+'video/entryIntro.mp4'"
          :poster="img_base_url+'video/entryIntroBg.png'" 
          x5-playsinline=""  playsinline=""  webkit-playsinline="" 
          controlslist="nodownload  noremoteplayback "
          :disablePictureInPicture="true"
          @play="toPlay"
          @timeupdate="updateTime" 
          @pause = "toPause"
          contextmenu="return false"
          :class="['varea']"
          >
        </video>
        <!-- <videoCom  :class="['varea']"
          :video="playerOptions.video"
          :cover="playerOptions.cover"
        >
        </videoCom> -->
        <!-- 
          style="width: 100%; height: 100%; object-fit: fill"
          porel,fullwidth,mal,fla,mat, :poster=posterUrl -->
        <!-- <div class="controlButs">
          <li @click="toPlay">播放/暂停</li>
          <li @click="toForward">前进</li>
          <li @click="toBack">倒退</li>
          <li @click="addVoice">增加音量</li>
          <li @click="decrease">减小音量</li>
        </div> -->
      </div>
      <div class="btnWrap">
      </div>
    </div>
    <div class="middle">
      <div class="hosList">
        <div class="hositem" 
          v-for="(item,index) in hosList"
          @click="toHosDetail(item)"
          :key="index"
        >
          <img :src="img_base_url+'baseHos/hosicon.png'" alt="" class="hosicon">
          <span class="txt">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="qrcode">
        <img :src="img_base_url+'baseHos/qrImg.png' " alt="" class="qrImg">
        <div class="txt">
          扫描二维码了解更多
        </div>
        <img :src="img_base_url+'baseHos/checkBtnImg.png'" 
           @click="clickApplytList()"
          alt="" class="checkBtn">
        <!-- <img :src="img_base_url+'baseHos/tklogo.png'" alt="" 
          class="tklogo"
        > -->
          <!-- @click="toListFunc()" -->
      </div>
    </div>
    <div class="content"  v-show="false">
       【申请查询】按钮，固定在页面底部
        点击【申请查询】，跳转【申请列表页面】；
        ① 跳转前校验客户是否已登录泰生活，若未登录，则跳转泰生活登录页，登录成功后返回落地页；
        ② 若已登录，再校验客户是否已实名认证，若未认证，则跳转泰生活实名认证页面，认证成功后返回落地页；
        ③ 已登录已实名的客户，可跳转【申请列表页面】

        点击 医院服务 ，跳转【医院介绍页】
    </div>
  </div>
</template>

<script lang='ts'>
import { 
  ref,reactive,toRefs,getCurrentInstance,
  onBeforeMount,onMounted,defineComponent, onActivated, 
} from 'vue';
import {useStore} from "vuex";
import { useRouter,useRoute, onBeforeRouteLeave } from 'vue-router';

import { Dialog } from 'vant';
import videoCom from "@/components/videoCom.vue";
import axios from "axios"
import '../mock/baseData.ts'

interface DataProps {
  activtity:'',
  toRealName:false,
  ifRealName:false,
  ifLogin:false,
}
export default {
  name: '',
  components: {
    // videoCom,
  },
  setup(props, cxt) {
    console.log('1-开始创建组件-setup')

    
    // @ts-ignore
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const $store = useStore();
    const data  = reactive({
      activtity:'',
      toRealName:false,
      ifRealName:false,
      ifLogin:false,
      hosList:[
        {"code":"hosHztj","name":"华中科技大学同济医学院附属同济医院"},
        {"code":"hosTktj","name":"泰康同济(武汉)医院"},
        {"code":"hosNjxlgl","name":"南京大学医学院附属鼓楼医院"},
        {"code":"hosTkxlgl","name":"泰康仙林鼓楼医院"},
        // {"code":"01","name":"上海交通大学医学院附属瑞金医院"},
        {"code":"hosFdhs","name":"复旦大学附属华山医院"},
      ],
      currentTime:"0",
      playerOptions:{
        "video":"",
        "cover":""
      }
    })
    

    onBeforeMount(() => {
      console.log('2.组件挂载页面之前执行----onBeforeMount');
      data.playerOptions.cover  = proxy.img_base_url+'video/entryIntroBg.png';
      data.playerOptions.video = proxy.img_base_url+'video/entryIntro.mp4';
      // sessionStorage.removeItem('entryScrollH');
    })
    onMounted(() => {
      console.log('3.-组件挂载到页面之后执行-------onMounted',proxy.img_base_url);
      (<any>window).onResume =  ()=>{
        console.log("onResumeFunc  toRealName 实名认证返回=====",data.toRealName);
        $store.commit('setLoadingwrapShowFlag', false);
        // if(data.toRealName){// 实名认证返回
        //   tPatientInfoFunc();
        // }
      };
      proxy.$refs.videoPlayer['controlslist'] = 'nodownload noremoteplayback'; // 隐藏下载按钮
      proxy.$refs.videoPlayer['disablePictureInPicture'] = true; //disablePictureInPicture的属性改为true
    })
    // created->mounted->activated
    onActivated(()=>{
      $store.commit('changeHeaderControl', {
        navArrowColor:"#333",
        title: "医院驻点",
        routeName:"entry",
      });
      if(sessionStorage.getItem('entryScrollH')){
        proxy.$refs.entry.scrollTop=sessionStorage.getItem('entryScrollH')
      }
      proxy.$util.trackEventSCAndTD("health_view_zhudianluodiye",'浏览驻点服务落地页',{page_name:"驻点服务落地页"})
      // 浏览驻点服务落地页	health_view_zhudianluodiye	浏览驻点服务落地页	page_name	页面名称	STRING	驻点服务落地页
      mockData();
    });
    onBeforeRouteLeave((to, from, next)=>{
      sessionStorage.setItem('entryScrollH',proxy.$refs.entry.scrollTop);
      // 设置下一个路由的 meta
      console.log("to",to);
      if(to.name== "orderList"){
        to.meta.keepAlive = false; // C 跳转到 A 时让 A 不缓存，即刷新
      }
      next();
    });
    const mockData=()=>{
      //页面调用
      axios.get(`/api/getUsers`).then(res => {
        console.log('getUsers', res)
      }).catch(err => {
        console.log(err)
      })
    }
    function clickApplytList(){//跳转列表
      ifLoginParams();
    }
    function toHosDetail(i){//跳转医院介绍
      console.log("toHosDetail==",i.name,i,);
      proxy.$util.trackEventSCAndTD("health_click_zhudianluodiye",'点击驻点服务落地页',{button_name:"医院",hospital_name:i.name})
      // 点击驻点服务落地页	health_click_zhudianluodiye	点击驻点服务落地页的按钮时	button_name	按钮名称	STRING	"播放视频 医院 服务进度查询"
      // 	hospital_name	医院名称	STRING	"华中科技大学同济医学院附属同济医院
      //   泰康同济（武汉）医院
      //   南京大学医学院附属鼓楼医院
      //   泰康仙林鼓楼医院
      //   复旦大学附属华山医院"
      router.push({
        path: "/hosDetail",
        query: {
          code: i.code,
          name:i.name,
        }
      })
    }
    
        
    const ifLoginParams=()=>{//判断是否登录实名
      console.log("标记是否登录",$store.state.token);
      if(!$store.state.token){
        data.ifLogin = false;
        notLoginFunc();
      }else{// 已登录,判断是否实名认证
        data.ifLogin = true;
        tPatientInfoFunc();
      }
      $store.commit('setLoadingwrapShowFlag', false);
    }
    const notLoginFunc=()=>{
      Dialog.confirm({
        message: '您还未登录，是否现在登录？',
        confirmButtonText:'立即登录',
        cancelButtonText:'稍后登录',
        confirmButtonColor:'#EE7800',
        cancelButtonColor:'#333333',
      }).then(() => {
        console.log("确认，拉起登录页");
        if (/medicaluat.mobile.taikang.com/.test(document.domain) || /medical.mobile.taikang.com/.test(document.domain)) {
          console.log('泰生活 app里面');
          proxy.$util.loginServe();
        } else {//开发模拟登录
          // $store.commit('changeToken', "");
          $store.commit('setLoadingwrapShowFlag', false);
          let token = 
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjBjNjFjNmE4OTAxYzI0NGEwNTg0ZjgiLCJ1YWNJZCI6IjYyMGM2MWM1MzcwYWY1NjYwZGViZWU3NiIsImV4cCI6MTY0NjIxNTg3Mn0.Hz-SqVF-IW7ehQzRmfY7ywDvjcvmU1QHR4YIEW224hw"
            // "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjBjNjFjNmE4OTAxYzI0NGEwNTg0ZjgiLCJ1YWNJZCI6IjYyMGM2MWM1MzcwYWY1NjYwZGViZWU3NiIsImV4cCI6MTY0NTYwODkzM30.8cfV7cMBmewCqRVV0o1WB6ZxedpzCvbKnY7WBn1vKuA"
            // "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjA0N2MxYmE4OTAxYzI0NGEwNTgxMzYiLCJ1YWNJZCI6IjYyMDQ3YzFiMzcwYWY1NjYwZGViZWFiNyIsImV4cCI6MTY0NTU5Nzc3NX0.ApqOGyz0uOAIipKFQn_83fBw0N5Esn6CdS38NC-NsrE"
          $store.commit('changeToken', token);
          tPatientInfoFunc();
        }
      }).catch(()=>{
        console.log("稍后，关闭弹窗")
      });
    }
    const  verifyRealUser = async (code)=>{
      $store.commit('setLoadingwrapShowFlag', true);
      data.toRealName=false;
      if(code){
        console.log("verifyRealUser 注册失败，需要实名",code);
        toRealName();
      }
      try{
        const resCode = await proxy.$api.verifyUser({})
        // 认证成功(0-未实名;1-身份证实名;2-非身份证实名)
        console.log("verifyUser res",resCode);
        $store.commit('setLoadingwrapShowFlag', false);
        if ( resCode  == "0") {
          toRealName();
        } else if (resCode  == "1"||resCode  == "2") {
          data.ifRealName = true;
          console.log("用户已实名认证。。。进行操作步骤",data.activtity);
          toListFunc();
          // else if(data.activtity == 'toCheck'){
          //   proxy.checkDeviceInfo();
          // }
        }
      }catch(err){
        console.log("verifyUser err",err);
        if(err.code=="99"){
          notLoginFunc();
        }else if(err.code=="101041016"){//msg: '本地系统无此用户'}
          // rCurrencyFunc(code);
        }
      }
    };
    const  toRealName = ()=>{
      data.ifRealName = false;
      Dialog.confirm({
        message: '实名后享受全部服务',
        confirmButtonText:'去实名',
        cancelButtonText:'取消',  
        confirmButtonColor:'#EE7800',
        cancelButtonColor:'#333333',
      }).then(() => {
        console.log("确认，跳转实名");
        data.ifLogin = true;
        data.toRealName = true;
        proxy.$util.realName();
      }).catch(()=>{
        console.log("稍后，关闭弹窗")
      });
    }
    const  rCurrencyFunc = async (code)=>{
      $store.commit('setLoadingwrapShowFlag', true);
      try{
        const res = await proxy.$api.rCurrency();
        console.log("rCurrency res==>",res);
        $store.commit('setLoadingwrapShowFlag', false);
        tPatientInfoFunc();
      }catch(err){
        console.log("rCurrency err==>",err);
        $store.commit('setLoadingwrapShowFlag', false);
        // 300001 注册时返回此码，代表用户未实名
        if(err.code =="300001"){//去实名
          verifyRealUser(err.code);
        }
      }
    };
    const  tPatientInfoFunc = async ()=>{
      $store.commit('setLoadingwrapShowFlag', true);
      try{
        const res = await proxy.$api.tPatientInfo();
        console.log("tPatientInfo res==>",res);
        $store.commit('setLoadingwrapShowFlag', false);
        verifyRealUser("");
      }catch(err){
        console.log("tPatientInfo err",err);
        if(err.code=="101041016"){//msg: '本地系统无此用户'}
          rCurrencyFunc("");
        }
      }
    };
    
    const toListFunc=()=>{//跳转列表
      proxy.$util.trackEventSCAndTD("health_click_zhudianluodiye",'点击驻点服务落地页',{button_name:"服务进度查询"})
      $store.commit('setLoadingwrapShowFlag', false);
      router.push({
        path: "/orderList",
        query: {
          from: "entry",
        }
      });
    };
    const updateTime=(e)=>{
      console.log("updateTime ==");
      // data.currentTime = e.target.currentTime
    };
    const toPlay=()=>{
      console.log("开始播放==");
      proxy.$util.trackEventSCAndTD("health_click_zhudianluodiye",'点击驻点服务落地页',{button_name:"播放视频"})
      proxy.$refs.videoPlayer.play();
    };
    const toPause=()=>{
      console.log("暂停播放==");
      proxy.$refs.videoPlayer.pause();
    };
    const toForward=()=>{
      var time = 10; //单位秒，每次增减10秒
      proxy.$refs.videoPlayer.volume !== proxy.$refs.videoPlayer.duration ? proxy.$refs.videoPlayer.currentTime += time : 1;
    };

    const toBack=()=>{
      var time = 10;
      console.log('后退')
      proxy.$refs.videoPlayer.currentTime !== 0 ?  proxy.$refs.videoPlayer.currentTime -= time : 1;
    };
    const addVoice=()=>{
      var vol = 0.1;
      console.log('增加音量')
      proxy.$refs.videoPlayer.volume !== 1 ? proxy.$refs.videoPlayer.volume += vol : 1;
    };
    const decrease=()=>{
      var vol = 0.1;
      console.log('减小音量')
      proxy.$refs.videoPlayer.volume !== 0 ? proxy.$refs.videoPlayer.volume -= vol : 1;
    };
    const refData = toRefs(data);

    const getSrc=(path)=>{
      let base = proxy.img_base_url;
      console.log(base+"+++++++++++++++++");
      return new URL(base+path,import.meta.url).href;
    };
    
    return {
      ...refData,
      clickApplytList,
      toHosDetail,
      updateTime,toPlay,toPause,toForward,toBack,addVoice,decrease,
      getSrc,

    }
  },

}
</script>
<style lang='scss' scoped>
  .entry{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    // background:red;
    // padding-top:46px;
    box-sizing: border-box;
    padding-bottom: 30px;
    .bgwrap{
      width: 375px;
      height: 895px;
      overflow: hidden;
      // background-image:url("@assets/imgs/img1.png")
      ;
      background-repeat: no-repeat
      ; 
      background-size: 375px 897px
      ; 
      background-position: 0 0
      ;  
      padding:0 21px 0 21px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: space-between;
      align-items: center;
      .video{
        // display: none;
        position:relative;
        // margin:0 10px 0 10px;
        top:413px;
        width: auto;
        height: 168px;
        // background: #000000;
        // opacity: 0.34;
        // margin-bottom: 947px;//634 313
        // background:rgba(0, 0, 0, 1);
        // background: red;;
        border:none;
        padding:0;
        overflow: hidden;

        .varea{
          width: 100%;
          height: 100%;
          // object-fit: cover;
        }
        .varea:focus {
          outline:none;
        }
      }
      //进度条
      video::-webkit-media-controls-timeline {
        // display: none;
      }
      //所有控件
      video::-webkit-media-controls-enclosure{
        // display: none;
      }
      .btnWrap{
        position:relative;
        text-align: center;
        bottom:119px;
      }
    }
    .middle{
      width: 375px;
      height: 827px;
      background-image:url("@assets/imgs/img22.png");
      background-repeat: no-repeat; 
      background-size: 375px 827px; 
      background-position: 0 0;
      margin-top: -2px;
      .hosList{
        position:relative;
        top:634px;// 1119 -(897-413)
        width: 100%;
        height: 168px;
        padding-left: 42px;;
        box-sizing: border-box;
        .hositem{
          height: 22px;
          display: flex;
          align-items: center;
          // background: lightgreen;
          .hosicon{
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }
          .txt{
            height: 22px;
            font-size: 12px;
            font-family: FZZZHONGJW--GB1-0, FZZZHONGJW--GB1;
            font-weight: normal;
            // color: #072358;
            color: #fff;
            line-height: 22px;
            text-decoration:underline;
          }
        }
      }
    }
    .footer{
      width: 100%;
      height: 800px;
      background-image:url("@assets/imgs/img3.png");
      background-repeat: no-repeat; 
      background-size: 375px 800px; 
      background-position: 0 0;
      margin-top: -2px;
      .qrcode{
        position:relative;
        top:478px;
        width: 100%;
        height: 322px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        // background: yellow;
        .qrImg{
          width: 103px;
          height: 103px;
        }
        .txt{
          height: 30px;
          font-size: 12px;
          font-family: FZZDHJW--GB1-0, FZZDHJW--GB1;
          font-weight: normal;
          color: #081F54;
          line-height: 30px;
          margin-bottom: 15px;
        }
        .checkBtn{
          width: 325px;
          height: 52px;
          margin-bottom: 29px;
        }
        .tklogo{
          width: 127px;
          height: 49px;
        }
      }
    }
    
    .content{
    position:absolute;
    top:0;
    text-align: center;
    
      
    }
  }
</style>