<!-- 订单列表页面 -->
<template>
  <div class="orderList">
    <van-tabs 
      v-model:active="active"
      class="tab-wrap"
      
      animated
      swipeable
      type="card2"
      background="rgba(242,243,245,1)"
      >
      <!-- 滚动导航  scrollspy-->
      <van-tab title-class="tab-title" 
        v-for="(titem,tindex) in tabs"  
        :key="'o'+tindex"
        @click="changeActive(tindex)"
      >
        <template #title> 
          <div class="vant-title-wrap">
            <span class="vant-title-txt">{{titem.name}}</span>
            <span class="vant-title-line" v-show="tindex==active"></span>
          </div>
        </template>
        <div class="report-list-wrap" 
          :class="{'first':active=='0','last':active=='6'}" 
          v-if="active==tindex"
        >
          <listCom 
            ref='listCom'
            :orderTypes="titem.ids"
            :types="tabs"
            :active="'0'+active"
          ></listCom>
        </div>
      </van-tab>
    </van-tabs>
    
  </div>
</template>

<script lang='ts'>
import { ref,reactive,toRefs,getCurrentInstance,
  onBeforeMount,onMounted,onActivated,
  defineComponent,
  watch, 
} from 'vue';
import {useStore} from "vuex";
import { useRouter,useRoute } from 'vue-router';
import listCom from "@/components/listCom.vue";

interface DataProps {}
export default {
    name: 'orderList',
    components: {
      listCom,
    },
      setup() {
          console.log('1-开始创建orderList 组件-setup');
          


          const data = reactive({
            // title:"11",
            // 待分配医生	1【待处理】	期望就诊医院、期望就诊科室、期望就诊时间
            // 待医生问诊 2	服务中	期望就诊医院、期望就诊科室、期望就诊时间
            // 待问诊确认	3 服务中	期望就诊医院、期望就诊科室、期望就诊时间
            // 待预约号源	4 待出号	期望就诊医院、期望就诊科室、期望就诊时间

            // 陪诊中	5 待陪诊	就诊医院、就诊科室、就诊时间
            // 订单完成 7	已就诊	就诊医院、就诊科室、就诊时间
            // 订单取消	9 已取消	期望就诊医院、期望就诊科室、期望就诊时间
            // 订单爽约	55 已爽约	就诊医院、就诊科室、就诊时间
            tabs:[
              // {ids:["00"],name:"全部",stxt:false},
              {ids:["1","2","3","4","5","7","9","55"],name:"全部",stxt:false},
              {ids:["1"],name:"待处理",stxt:false},
              {ids:["2","3"],name:"服务中",stxt:false},{ids:["4"],name:"待出号",stxt:false},
              {ids:["5"],name:"待陪诊",stxt:true},{ids:["7"],name:"已就诊",stxt:true},
              {ids:["9"],name:"已取消",stxt:false},{ids:["55"],name:"已爽约",stxt:true},
            ],
            //已爽约 55 已取消 9 已就诊 7 灰色
            active:"",
            currtabName:'TCMTab',
          })

          const route = useRoute();
          // @ts-ignore
          const { proxy } = getCurrentInstance();
          const $store = useStore();
          onBeforeMount(() => {
            console.log('2.orderList组件挂载页面之前执行----onBeforeMount')
          })
          onMounted(() => {
            console.log('3.orderList组件挂载到页面之后执行-------onMounted')
            
          })
          onActivated(()=>{
            $store.commit('changeHeaderControl', {
              title: "订单",
              routeName:"orderList",
              navArrowColor:"#333",
            });
            //从首页进入的时候 需要查询全部接口数据
            // if(route.query.from=="entry"&&proxy.$refs.listCom){
            //   proxy.$refs.listCom.$emit('getDataList','');
            // }
            proxy.$util.trackEventSCAndTD("health_view_zhudianlist",'浏览驻点服务订单列表页',{page_name:"驻点服务订单列表页"})
            
            
          });
          const refData = toRefs(data);
          // const onClickTab = ({ title:string }) => {
            // Toast(title)
          //   console.log(title);
            
          // };
          
          
          const onClickTab = ({ title }) => {
            console.log("onClickTab==",title);
          };
          const beforeChange = (index) => {
            // 返回 false 表示阻止此次切换
            if (index === 1) {
              return false;
            }

            // 返回 Promise 来执行异步逻辑
            return new Promise((resolve) => {
              // 在 resolve 函数中返回 true 或 false
              resolve(index !== 3);
            });
          };
          watch(
            () => data.active,
            (newVal, oldVal) => {
              console.log("watch active=============",newVal,(proxy.tabs)[newVal].name);
              if(newVal){
                changeActive(newVal);
                proxy.$util.trackEventSCAndTD("health_click_zhudianlist",'点击驻点服务订单列表页',{button_name:(proxy.tabs)[newVal].name})
                // 		点击驻点服务订单列表页的按钮时	button_name	按钮名称	STRING	"全部
                //   待处理
                //   服务中
                //   待出号
                //   待就诊
                //   已就诊
                //   已取消
                //   已爽约
                //   订单卡片"
              }
            }
          )
          const changeActive=(index)=>{
            console.log("changeActive ==",index);
            data.active = index;
          };
          return {
              ...refData,
            changeActive,
            onClickTab,beforeChange,
          }

      }
  };
</script>
<style lang='less' scoped>
.orderList{
  background: rgba(242,243,245,1);
  background: rgba(242,243,245,1);
  height: 100%;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // padding-top:46px;
  box-sizing: border-box;
  .tab-wrap{
    height: 100%;
    padding-top:7px;
    box-sizing: border-box;
    opacity: 1;
    background: rgba(242,243,245,1);
    box-shadow: 0 4px 13px 0 rgba(0,0,0,0.04);
    .van-tabs__wrap{
      .vant-title-wrap{
        
        .vant-title-txt{
          color: rgba(102,102,102,1);
          font-size: 16px;
          font-weight: 500;
          font-family: "PingFang SC";
          text-align: left;
          line-height: 36px;
          height: 36px;
          opacity: 1;

        }
      }
      .van-tab--active{
        .vant-title-wrap{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .vant-title-txt{
            color: rgba(51,51,51,1);
            font-size: 18px;
            font-weight: bold;
            font-family: "PingFang SC";
            text-align: left;
            opacity: 1;
            line-height: 36px;
            height: 36px;
          }
          .vant-title-line{
            width: 16px;
            height: 4px;
            opacity: 1;
            background: rgba(238,120,0,1);
          }
        }
      }
      .van-tabs__line{
        width: 16px;
        height: 4px;
        opacity: 1;
        background: rgba(238,120,0,1);
        display: none;
      }
    }
    
    .van-tabs__content{
      // height: 100%;
      overflow-y: scroll;
      background:yellow;
      // flex: 1;
    }
  }
  .van-tabs__nav{
    width: 100%;
    height: 50px;
    opacity: 1;
    background: rgba(242,243,245,1);
    box-shadow: 0 4px 13px 0 rgba(0,0,0,0.04);
  }
  /deep/.van-tabs__content, /deep/.van-tab__panel {//
    height: 100%;
  }
  /deep/.van-swipe{
    overflow-y: scroll;
  }
  .report-list-wrap{
    width: 100%;
    height: 100%;
    background: rgba(242,243,245,1);
    padding-top:16px;
    // background: yellow;
  }
  /deep/.van-list {
    // min-height: calc(100vh - 45px);
    padding-bottom: 100px;
    box-sizing: border-box;
    // background: green;
  }
}
</style>