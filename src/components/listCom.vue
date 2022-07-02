<!-- 订单列表组件 -->
<template>
  <div class="listCom">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefreshList()"
      v-show="!errorPage"
      class="vant-pull-list"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
       
        class="vant-clearfix van-list"
      >
        <div class="recordBoxWrap"
          v-for="(fItem, index) in recordList"
          :key="index"
          @click="checkDetailsList(fItem)"
        >
         <!-- //已爽约 55 已取消 9 已就诊 7 灰色 -->
          <div
            class="recordBox"
            :class="{'grey':fItem.status=='7'||fItem.status=='9'||fItem.status=='55'}"
          >
            <div class="status">
              {{fItem.statusNameShow}}
            </div>
            <!-- 期望就诊医院、期望就诊科室、期望就诊时间 -->
            <div class="title"
            :class="{'greytxt':fItem.status=='9'}"
            >{{fItem.applyHospitalName}}</div>
            <div class="desc"
            :class="{'greytxt':fItem.status=='9'}"
            >
            <!-- //  applyHospitalName applyDepartmentName applySeeTime   期望 -->
          <!-- // 就诊 seeDepartmentName  seeDoctorManName seeHospitalName seeTime -->
              <span>{{fItem.orderDesc}}就诊科室:</span>
              <span>{{fItem.orderDesc?fItem.applyDepartmentName:fItem.seeDepartmentName}}</span>
            </div>
            <div class="desc "
            :class="{'greytxt':fItem.status=='9'}"
            >
              <span>{{fItem.orderDesc}}就诊时间:</span>
              <span>{{fItem.orderDesc?fItem.applySeeTime:fItem.seeTime}}</span>
            </div>
          </div>
        </div>
    </van-list>
    </van-pull-refresh>
    <div class="error" v-show="errorPage">
      <img :src="img_base_url+'/baseHos/error.png'" />
      <div class="text"> 暂无数据</div>
    </div>
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
import { log } from 'node:console';
interface DataProps {}
export default {
  name: 'listCom',
  props: {
    orderTypeInfo: {
      type: Object,
      required: false,
    },
    orderTypes:{
      type: Array,
      required: true,
    },
    types:{
      type: Array,
      required: true,
    },
    active:{
      type: String,
      required: true,
    },
  },
  setup(props,context) {
      // @ts-ignore
      const { proxy } = getCurrentInstance();
      
      const router = useRouter();
      const $store = useStore();

      const data = reactive({
        recordList:[
          { "status":"","statusName":"",
            "applyHospitalName":"","applyDepartmentName":"",
            "applyTime":""
          },
        ],
        recordList00: [
            { "status":"00","statusName":"待处理",
              "applyHospitalName":"华中科大学同济医院附属同济医…","applyDepartmentName":"眼科",
              "applyTime":"2019-06-16"
            },
            { "status":"00","statusName":"待处理",
              "applyHospitalName":"华中科大学同济医院附属同济医…","applyDepartmentName":"眼科",
              "applyTime":"2019-06-16"
            },
            { "status":"00","statusName":"待处理",
              "applyHospitalName":"华中科大学同济医院附属同济医…","applyDepartmentName":"眼科",
              "applyTime":"2019-06-16"
            },
            { "status":"00","statusName":"待处理",
              "applyHospitalName":"华中科大学同济医院附属同济医…","applyDepartmentName":"眼科",
              "applyTime":"2019-06-16"
            },
            { "status":"00","statusName":"待处理",
              "applyHospitalName":"华中科大学同济医院附属同济医…","applyDepartmentName":"眼科",
              "applyTime":"2019-06-16"
            }
        ],
        isLoading: true,
        loading: false, //是否上拉加载
        finished: true, //是否还有数据
        refreshing: false, //是否下拉刷新
        
        pnum: 0, // 当前页码
        psize: 10000, // 分页大小
        finishedText: "",
        errorPage: false, //是否有镜子的测评记录
      })
      onBeforeMount(() => {
      })
      onMounted(() => {
        console.log("props.orderTypes==",props.types);
        getDataList();
      })
      onActivated(()=>{
        //从首页进入的时候 需要查询全部接口数据
        console.log("onActivated listCom组件");
        getDataList();
      });
      watch(
        () => props.active,
        (newVal, oldVal) => {
          console.log("watch listCom组件",newVal);
          if(newVal){
            getDataList();
          }
        }
      )
      const refData = toRefs(data);
      //下拉刷新
      const onRefreshList=(i)=> {
        console.log("onRefreshList==",i);
        data.pnum = 0;
        data.finished = false; //是否还有数据
        data.finishedText = "";
        data.refreshing = true;
        // 将 loading 设置为 true，表示处于加载状态
        data.loading = true;
        getDataList();

      };
      
      const onLoadList=()=> {//上拉加载
        setTimeout(() => {
          console.log('onLoad 是否下拉刷新---',data.refreshing);
          if (data.refreshing) {
            data.recordList = [];
            data.refreshing = false;
          }else{
            data.pnum++;
          }
          getDataList();
        }, 1000);
      };
      const  getDataList = async ()=>{
        data.recordList = [];
        data.refreshing = false;
        $store.commit('setLoadingwrapShowFlag', true);
        try{
          const res = await proxy.$api.getChannelOrderListByCustomerAndOrder({})
          // 认证成功(0-未实名;1-身份证实名;2-非身份证实名)
          console.log("getDataList res",res);
          $store.commit('setLoadingwrapShowFlag', false);
          if ( res &&(res instanceof Array)) {
            let len = res.length;
            if(len <1&&(data.recordList.length)<0){//
              console.log('这是最后一页了---');
              data.finished = true; //没有更多了
              data.finishedText = "没有更多了";
            }else{
              dealData(res);
            }
          }  
        }catch(err){
          console.log("getChannelOrderListByCustomerAndOrder err",err,data.recordList,(data.recordList).length);
          if(err.code=="40000"){
            // if(data.recordList==[]||((data.recordList).length)<1){
              console.log("空列表的展示");
              data.errorPage = true;
            // }
          } 
        }
      };
      const dealData=(res)=> {
        let len = res.length;
        for(let n=0;n<len;n++){
          // statusName status  serveCode
          //  applyHospitalName applyDepartmentName applySeeTime   期望
          // 就诊 seeDepartmentName  seeDoctorManName seeHospitalName seeTime
          let item = res[n];
          if((props.orderTypes).indexOf(item.status)!=-1){
            for(var i in props.types){
              let ctype
                = {
                ids: ["00"] as Array<String>,
                name: '' as String,
                stxt:false as Boolean
              }
              
              // @ts-ignore
              ctype = (props.types)[i];
              if((ctype.ids).indexOf(item.status)!=-1 ){
                item.statusNameShow = ctype.name
              }
              if(["5","7","55"].indexOf(item.status)!=-1){
                item.orderDesc = ""

              }else{
                item.orderDesc = "期望"
              }
            }
            data.recordList.push(item);
          }
        }
        if((data.recordList).length<1){
          data.errorPage = true;
        }else 
        if(len <data.psize){//
          console.log('这是最后一页了---');
          data.finished = true; 
          data.finishedText = "没有更多了";
        }
      };
      //查看详情
      const checkDetailsList=(value)=> {
        router.push({
          path: "/orderDetail",
          query: {
            id: value.id,
            serveCode:value.serveCode,
          },
        });
      };
      return {
        ...refData,
        onRefreshList,checkDetailsList,
        onLoadList,
        
      }

  },
  
};
</script>
<style lang='scss' scoped>
.listCom {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #f2f3f5;
  overflow: hidden;
  .van-pull-refresh{
    height: 100%;
    overflow-y: scroll;
  }
  .van-list{
    padding:0 16px 0 16px;
    .recordBoxWrap{
      border-radius: 10px;
      opacity: 1;
      // border: 2px solid rgba(1, 1, 1, 1);
      background: linear-gradient(37.7deg, rgba(255,255,255,0.99) 28.000000000000004%, rgba(255,255,255,0.76) 100%);
      text-align: left;
      margin-bottom: 12px;
      // background:green;
    }
    .recordBox{
      border-radius: 10px;
      background:url("@assets/imgs/boxBgOrg@2x.png") no-repeat right top;
      background-size: 100px 48px;
      padding:7px 0 19px 24px;
      backdrop-filter: blur(28px);
      color: rgba(51,51,51,1);
      .status{
        height: 11px;
        opacity: 1;
        color: rgba(255,255,255,1);
        font-size: 11px;
        font-weight: bold;
        font-family: "PingFang SC";
        text-align: left;
        line-height: 11px;
        margin-bottom:6px;
        text-align: right;
        margin-right: 16px;
      }
      .title{
        // margin-top:14px;
        height: 17px;
        opacity: 1;
        font-size: 17px;
        font-weight: 500;
        font-family: "PingFang SC";
        text-align: left;
        line-height: 17px;
        margin-bottom: 10px;
      }
      .desc{
        height: 24px;
        opacity: 1;
        font-size: 14px;
        font-weight: 400;
        font-family: "PingFang SC";
        text-align: left;
        line-height: 24px;
      }
      .greytxt{
        color: rgba(188,188,188,1);
      }
    }
    .recordBox.grey{
      border-radius: 10px;
      background:url("@assets/imgs/boxBgGrey@2x.png") no-repeat right top;
      background-size: 100px 48px;
      padding:7px 0 19px 24px;
      backdrop-filter: blur(28px);
      .status{
        // text-align: left;
        line-height: 11px;
      }
    }
  }
   .error {
    text-align: center;
    img {
      width: 170px;
      height: 170px;
      margin-top: 78px;
    }
    .text {
      margin-top: 20px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
    }
  }
}
</style>