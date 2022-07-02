<!-- web导航替代app的导航 -->
<template>
<div class="webNav"
:class="{'opacity':headerControl.routeName=='hosDetail'||headerControl.routeName=='orderDetail'}"
>
  <!-- <span class="back" @click="backFn"></span>
  <span class="headTitle" >{{title||'坎坎坷坷'}}</span> -->
  <van-nav-bar 
    title="" 
    left-text="" 
    left-arrow
    :fixed="true"
    :border="false"
    :safe-area-inset-top="true"
    @click-left="onClickLeft"
  >
    <!-- v-show="headerControl.routeName!=='entry'" -->
    <template #left>
      <div class="leftNav">
        <van-icon name="arrow-left" :color="headerControl.navArrowColor||'#333333'" 
          v-show="headerControl.routeName!=='entry00'"
        />
        <div class="txt"
          v-show="headerControl.routeName=='entry00'"
        >
          关闭
        </div>
      </div>
    </template>
    <template #title>
        {{headerControl.title}}
      <!-- title right left  yy?   -->
      <div class="titleArea" >
        <div class="select" 
          v-show="headerControl.routeName=='hosDetail'"
          @click="selectChange()"
        >
          <span class="txt">{{hosInfo.name}}</span>
          <span class="icon"
          ></span>
        </div>
      </div>
    </template>
  </van-nav-bar>
</div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted,
getCurrentInstance,
onUnmounted,computed,
} from 'vue'
import {useStore} from "vuex";
import { useRouter,useRoute } from 'vue-router';
interface DataProps {}
export default {
    name: 'webNav',
    props: {
      backPage: {
        type: Function,
        default: null
      },
      page:{
        type:String,
        required: true,
      },
      
    },
    setup(props, { emit }) {
        console.log('1-开始创建组件-setup')
        // @ts-ignore
        const { proxy } = getCurrentInstance();
        proxy.$util.toggleNavAction( false );
        // const vueEvent = getCurrentInstance()?.appContext.config.globalProperties.vueEvent
        // const vueEvent = getCurrentInstance()?.appContext.config.globalProperties.vueEvent
        
        const router = useRouter();
        const route = useRoute();
        const $store = useStore();
        const headerControl:any = computed(() => $store.state.headerControl);
        const hosInfo:any = computed(() => $store.state.hosInfo);
        

        const data = reactive({
          currentNo:0,
          navArrowColor:'#fff',
          // hosInfo:{
          //   "code":"hosHztj",
          //   "name":"华中科技大学同济医学院附属同济医院"
          // },
        })
        const refData = toRefs(data);
        
        
        onBeforeMount(() => {
          console.log('2.组件挂载页面之前执行----onBeforeMount')
        })
        
        onMounted(() => {
          console.log('3.-组件挂载到页面之后执行-------onMounted')
          // vueEvent.on('handleCurrentHos', (val: any) => {
          //   console.log("handleCurrentHos====",val);
          //   data.hosInfo = val;
          // })
        })
        onUnmounted(() => {
          // vueEvent.off('handleCurrentHos')
        })
        // const backFn=()=>{ // closePageAction
        //   console.log('props==>',props.backPage);//输出的值是 undefined
        //   if (props.backPage) {
        //     // this.$emit('backPage');
        //     console.log("执行home的back方法")
        //   }
        // }
        
        // (<any>window).goback = backFn();

        const onClickLeft = () => {
          let h = $store.state.headerControl;
          console.log("点击返回键headerControl==",h,h.routeName);
          if (/entry/.test(h.routeName)) {// || params["deletePage"]
            proxy.$util.sendToAppFn({
              command: "closePageAction",
            });
          } else {
            console.warn("--路由后退--");
            // _this.$router.back();
            history.back();
          }
        }
        const onClickRight = () => {
          console.log("llllll");
          
        }
        const selectChange= () => {
          console.log("lselectChangelllll");
          // emit('handleHosPop');
          $store.commit('changeHosPopShow', true);
          // if(headerControl.routeName=='hosDetail'){
          //   emit('handleHosPop')
          // }else{
          //   console.log("selectChange headerControl.routeName",headerControl.routeName);
          // }
        }
        return {
            ...refData,
          headerControl,hosInfo,
          onClickLeft,
          onClickRight,
          selectChange,
          
        }

    }
  };
</script>
<style lang="less" scoped>
.webNav{
  height: 46px;
  background-color:rgba(220,38,38,0);
  z-index: 99;
  .leftNav{
    .txt{
      font-size: 12px;
      font-family: FZZhengHeiS-DB-GB;
      font-weight: 400;
      // text-decoration: underline;
      color: #072358;
      line-height: 46px;
      height: 46px;
    }
  }
}
// <div class="titleArea">
//         <div class="select">
//           <span class="txt">华科大同济医…</span>
//           <span class="icon"
.titleArea{
  .select{
    width: 140px;
    height: 30px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    // filter: blur(9px);
    padding:4px 8px 4px 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .txt{
      width: 110px;
      height: 22px;
      font-size: 14px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 22px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .icon{
      width: 12px;
      height: 12px;
      background: url("@assets/imgs/arrowDfff.png") no-repeat;
      background-size: 12px 12px;
    }
  }
}
.webNav.opacity{
  .van-nav-bar{
    background-color: rgba(0,0,0,0) !important;
  }
  .van-nav-bar__content{
    background-color: rgba(0,0,0,0) !important;
  }
}
.webNav{
  .van-nav-bar{
    background-color: #fff !important;
  }
  .van-nav-bar__content{
    background-color: #fff !important;
  }
}
// .van-icon-arrow-left 
.van-nav-bar .van-icon{
  // color: red !important;
}
</style>
<style lang='scss' >
  // .van-button--primary {
  //   color: var(--van-button-primary-color);
  //   background-color: var(--van-button-primary-background-color);
  // }
  
  :root {
    // --van-white: #fff;
    // --van-blue: #1989fa;
    // --van-button-primary-color: var(--van-white);
    // --van-button-primary-background-color: var(--van-primary-color);
    // --van-background-color-light:#000;
    // --van-nav-bar-background-color:var(--van-background-color-light);
    // --van-nav-bar-background-color:rgba(220,38,38,0.2);
    //  --van-nav-bar-icon-color:#fff;
    // --van-nav-bar-z-index:99
    // .van-nav-bar .van-icon {
    // color: var(--van-nav-bar-icon-color)
    // --van-nav-bar-icon-color:red;
  }
</style>