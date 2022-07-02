<!--  -->
<template>
  <div>
    <p>
      <button @click="$router.push('/course/add')">新增</button>
    </p>
    
    <li
      v-for="c in courses"
      :key="c.id"
      :class="{ active: selectedCourse === c }"
      @click="showDetail(c)">
      >
      {{ c.name }}
      
    </li>
    <message v-if="showMsg" @close="showMsg = false">
      <template v-slot:title> 恭喜 </template>
      <template v-slot:default> 新增课程成功！ </template>
    </message>
  </div>
</template>

<script lang='ts'>
import { ref,reactive,toRefs,onBeforeMount,onMounted} from 'vue'
import { useRouter } from "vue-router";
import { getCourses,courses } from "../api/course"
interface DataProps {}
export default {
    name: '',
    data() {
      return {
        selectedCourse: "",
        showMsg:false,
      };
    },
    beforeRouteEnter(to, from, next) {// message显示控制从App.vue中移过来
      // 如果从add⻚⾯过来，且操作成功则显示弹窗
      // if (from.path === '/course/add' && to.query.action === "success") {
      //   next(vm => vm.showMsg.value = true)
      // }
      next();
    },
    setup() {
      console.log('1-开始创建组件-setup')
      const router = useRouter();
      const selectedCourse = ref(null);
      const showDetail = (c:any) => {
        selectedCourse.value = c;
        router.push({ name: "courseDetail", params: { id: c.id } });
      };
      const showMsg = ref(false);

      return { courses, 
        showDetail,
        showMsg
      };
        const data: DataProps = reactive({

        })
        onBeforeMount(() => {
            console.log('2.组件挂载页面之前执行----onBeforeMount')
        })
        onMounted(() => {
            console.log('3.-组件挂载到页面之后执行-------onMounted')
        })
        const refData = toRefs(data);
        return {
            ...refData,
        }

    }
  };
</script>
<style lang='scss' scoped>
</style>