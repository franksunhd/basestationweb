<!--  -->
<template>
  <div id="home" 
  >
  <!-- :class="{'opacity':headerControl.routeName=='hosDetail'||headerControl.routeName=='orderDetail'}" -->
    <!-- 111 -->
    <!-- 开启顶部安全区适配 -->
    <!-- <van-nav-bar safe-area-inset-top /> -->
    <!-- <router-view></router-view> -->
    <!-- <keep-alive> -->
    <div class="headerNav">
      <webNav 
      :page="page"
      :hosInfo="hosInfo"
      @handleHosPop="handleHosPop"
      ></webNav>
    </div>
    <div class="main"
    :class="{'mtop':headerControl.routeName=='hosDetail'||headerControl.routeName=='orderDetail'}">
      <router-view v-slot="{ Component}">
        <transition >
          <keep-alive> 
            <component 
              :is="Component"
              />
          </keep-alive>
          <!--:name="route.meta.transition||'fade'" mode="out-in" <component v-else :is="Component" /> -->
        </transition>
      </router-view>
      <!-- 
          <keep-alive v-if="route.meta.keepAlive" >
        -->
      <!-- <router-view v-if="!$route.meta.keepAlive" v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view> -->
    </div>
    <!-- 开启底部安全区适配 -->
    <!-- <van-number-keyboard safe-area-inset-bottom /> -->
    <van-empty
      v-show="false"
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="描述文字"
    />
  </div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted,
getCurrentInstance,
computed,
} from 'vue'
import { useRouter,useRoute } from 'vue-router';
import {useStore} from "vuex";
import webNav from "@/components/webNav.vue";

interface DataProps {}
export default {
  name: 'home',
  components: {
    webNav,
  },
  setup() {
    console.log('1-开始创建组件-setup');
    // @ts-ignore
    const { proxy } = getCurrentInstance();

    const route = useRoute();
    const $store = useStore();
    const headerControl:any = computed(() => $store.state.headerControl);

    const data: DataProps = reactive({
      mtop:true,
      page:"hosDetail",
      hosInfo:{},
    })
    
    onBeforeMount(() => {
        console.log('2.组件挂载页面之前执行----onBeforeMount')
    })
    onMounted(() => {
        console.log('3.-组件挂载到页面之后执行-------onMounted')
    })
    const refData = toRefs(data);
    const handleHosPop=()=>{
      console.log("home  显示 医院pop");
      $store.commit('changeHosPopShow', true);
    }
    return {
        ...refData,headerControl,
        handleHosPop
    }

  },
  computed:{
    includedComponents(){
      return this.$route.meta.keepAlive
    }
  }
};
</script>
<style lang='less' scoped>
#home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display:-webkit-box;-webkit-box-orient:vertical;height:100%;
  -webkit-overflow-scrolling: touch;//滑动不卡顿
  // background: rgba(0,0,0,0);
  // display: flex;
  // flex-direction: column;
  .headerNav{
    height: 46px;
    background-color: rgba(0,0,0,0);
    z-index: 99;
  }
  .main{
    flex: 1;
    height: 100%;
    overflow: hidden;
    z-index: 9;
  }
  .mtop{
    margin-top: -46px;
  }
  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .loading1 {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 200;
      background: #fff;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      .loadingImg1 {
          width: 140px;
          height: 110px;
          margin-top: -80px;
          img {
              width: 100%;
          }
      }
      p {
          margin-top: 10px;
          font-size: 14px;
          color: #4c5979;
          letter-spacing: 0.17px;
          font-family: PingFangSC-Regular;
      }
      .renew {
          text-align: center;
          margin-top: 10px;
          width: 110px;
          height: 35px;
          border: 1px solid #517df7;
          border-radius: 4px;
          color: #517df7;
          font-size: 15px;
          line-height: 35px;
          text-decoration: none;
      }
  }
  .loadingwrap{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .tkloadingImg{
          width: 120px;
          height: 120px;
      }
  }
  .header {
    height: 44px;
    box-sizing: border-box;
    border-bottom: 1px solid #f4f6fc;
    background: #fff;
    width: 100%;
    position: relative;
    .leftBack {
        position: absolute;
        left: 18px;
        top: 0;
        width: 24px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        .back {
            width: 12px;
            height: 20px;
            img {
                width: 100%;
                display: block;
            }
        }
    }
    .rightClick {
        position: absolute;
        right: 18px;
        width: 70px;
        height: 43px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #1f2845;
        letter-spacing: 0;
        text-align: right;
        // background: red;
    }
    .headTitle {
        width: 100%;
        height: 44px;
        position: absolute;
        left: 0;
        top: 0;
        color: #1f2845;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
    }
  }
  .headerBor {
    background: #282a2b;
    border-bottom: 1px solid #282a2b;
    .headTitle {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #ffffff;
    }
    .rightClick {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
    }
  }
  .headerBorder {
    border-bottom: 1px solid #282a2b;
  }
  .headerGor {
    background: #282a2b;
    .headTitle {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #ffffff;
    }
    .rightClick {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
    }
  }

  .main-wrap {
    width: 100%;
    box-sizing: border-box;
    bottom: 0;
    -webkit-box-flex:1;
    overflow-y:auto;
    -webkit-overflow-scrolling:touch;
    position:relative;
    overflow-x: hidden;
  }
  .top0{
    top:0;
  }
  .child-view {
      width: 100%;
      min-height: 100%;
      box-sizing: border-box;
      transition: all 0.3s ease;
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
      -webkit-overflow-scrolling: touch;
      
  }
  .rightin-enter,
  .leftin-leave-active {
      opacity: 0;
      transform: translate3d(50% 0, 0);
      -webkit-transform: translate3d(50%, 0, 0);
      -moz-transform: translate3d(50%, 0, 0);
  }

  .leftin-enter,
  .rightin-leave-active {
      opacity: 0;
      transform: translate3d(-50% 0, 0);
      -webkit-transform: translate3d(-50%, 0, 0);
      -moz-transform: translate3d(-50%, 0, 0);
  }
}
#home.opacity{
  background: rgba(0,0,0,0);
}
</style>