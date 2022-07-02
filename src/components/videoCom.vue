<!--  -->
<template>
<div>
<video-player
  class="video-player vjs-custom-skin varea"
  ref="videoPlayerVUE"
  name="videoPlayerVUE"
  id="video"
  :playsinline="true"
  :options="playerOptions"
  @play="onPlayerPlay($event)"
  @pause="onPlayerPause($event)"
  @ready = "playerReadied"
></video-player>
  <!-- :globalOptions="globalSetting" 
 @ended="onPlayerEnded($event)"
  @waiting="onPlayerWaiting($event)"
  @timeupdate="onPlayerTimeupdate($event)"
  @statechanged="playerStateChanged($event)"
  @canplaythrough="onPlayerCanplaythrough($event)" -->
</div>
</template>
        
<script lang='ts'>
import { 
  reactive,toRefs,onBeforeMount,onMounted,
  getCurrentInstance,
} from 'vue'
import {  onBeforeRouteLeave } from 'vue-router';

import {videoPlayer} from 'vue-video-player/src'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  name: 'videoCom',
  props:['video','cover'],
  components: {
    videoPlayer
  },
  setup(props) {
    // @ts-ignore
    const { proxy } = getCurrentInstance();

    const data = reactive({
      playTime:'',
      current:0,
      playerOptions: {
          // playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
          autoplay: false, // 如果为true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 是否视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
              {
                type: "video/mp4", // 类型
                src:props.video,
                // proxy.img_base_url+"video/entryIntro.mp4" // url地址
              }
          ],
          poster: props.cover, // 封面地址
          notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
              timeDivider: true, // 当前时间和持续时间的分隔符
              durationDisplay: true, // 显示持续时间
              remainingTimeDisplay: false, // 是否显示剩余时间功能
              // fullscreenToggle: true // 是否显示全屏按钮
          },
      },
      globalSetting:{controls:true},
    })

    onBeforeMount(() => {
        console.log('2.组件挂载页面之前执行----onBeforeMount')
    })
    onMounted(() => {
        console.log('3.-组件挂载到页面之后执行-------onMounted')
    });
    
    onBeforeRouteLeave((to, from, next)=>{
        // proxy.$refs.videoPlayerVUE.player.pause()
    });
    // 播放回调
    const onPlayerPlay=(player)=> {
      console.log("player play!", player);
      // proxy.$refs.videoPlayer.paused === true ? proxy.$refs.videoPlayer.play() : proxy.$refs.videoPlayer.pause();
      proxy.$util.trackEventSCAndTD("health_click_zhudianluodiye",'点击驻点服务落地页',{button_name:"播放视频"})
    };

    // 暂停回调
    const onPlayerPause=(player)=> {
      console.log("player pause!", player);
    };

    // 视频播完回调
    const onPlayerEnded=($event)=> {
      console.log($event);
    };
    // DOM元素上的readyState更改导致播放停止
    const onPlayerWaiting=(player)=> {
        let time = localStorage.getItem("cacheTime")
        if(player.cache_.currentTime - Number(time) > 0.1){
            data.current = Number(time)
            proxy.playerReadied(player)
        }else{
            data.current = player.cache_.currentTime
        }
    };

    // 已开始播放回调
    const onPlayerPlaying=($event)=> {
      console.log("onPlayerPlaying",$event)
    };

    // 当播放器在当前播放位置下载数据时触发
    const onPlayerLoadeddata=($event)=> {
      console.log("onPlayerLoadeddata",$event)
    };

    // 当前播放位置发生变化时触发。
    const onPlayerTimeupdate=(player)=> {
        data.playTime = player.cache_.currentTime
        let playTime = player.cache_.currentTime
        setTimeout(function () {
            localStorage.setItem("cacheTime",playTime)
        },500)

        let time = localStorage.getItem("cacheTime")
        if(player.cache_.currentTime - Number(time) > 2){
            data.current = Number(time)
            proxy.playerReadied(player)
        }else{
            data.current = player.cache_.currentTime
        }
    };

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    const onPlayerCanplay=(player)=> {
      console.log("onPlayerCanplay",player)
    };

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    const onPlayerCanplaythrough=(player)=> {
      console.log("onPlayerCanplaythrough ",player)
    };

    //播放状态改变回调
    const playerStateChanged=(playerCurrentState)=> {
      console.log('playerStateChanged', playerCurrentState)
    };

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    const playerReadied=(player)=> {
      player.currentTime(data.current)
    }
    const refData = toRefs(data);
    return {
        ...refData,
        onPlayerPlay,onPlayerPause,onPlayerEnded,onPlayerWaiting,
        onPlayerTimeupdate,playerStateChanged,onPlayerCanplaythrough,
        playerReadied,
      
    }
  }
};
</script>
<style lang="less">
// .varea,
#vjs_video_3{
  // width: 333px;
  // height: 158px;
  // object-fit: cover;
  // overflow: hidden;
}
.varea:focus {
  // outline:none;
}
.vjs-control-bar{
  // height: 20px;
  // line-height: 20px;
  width: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  justify-content: space-around !important;;
}
    .vjs-custom-skin > .video-js .vjs-big-play-button {
        // background-color: rgba(0,0,0,0.45);
        font-size: 3.0em;
        /* border-radius: 50%; */
        height: 1.5em !important;
        line-height:1.5em !important;
        margin-top: -1em !important;
    }
    // /*这里用了第三方vue-video-player插件，但这个插件有bug，设置globalSetting:{controls:true}隐藏进度条不生效，故可设置插件样式进行隐藏vjs-progress-contro*/
    .vjs-progress-control {
      visibility:hidden;       // 隐藏进度条*/
    }
    .video-js .vjs-tech {
      // width: 333px;
      // height: 168px;
      // object-fit: cover;
    }
    .vjs-poster{
      // width: 333px;
      // height: 168px;
      // object-fit: cover;
    }

</style>
