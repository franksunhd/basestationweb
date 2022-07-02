<!--  -->
<template>
  <div>
    <input type="text" v-model="course" @keydown.enter="addCourse" />
    <button v-on:click="add">新增课程</button>
  </div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted} from 'vue'
import { ref } from "vue";
import { addCourse } from "../api/course";
import { useRouter } from "vue-router";
interface DataProps {}
export default {
    name: '',
      setup() {
          console.log('1-开始创建组件-setup')
          const data: DataProps = reactive({

          })
          const course = ref("")
          const router = useRouter();
          const add = () => {
            addCourse(course.value);
            router.push({ path: "/courseList", query: { action: "success" } });
          };
          
          onBeforeMount(() => {
              console.log('2.组件挂载页面之前执行----onBeforeMount')
          })
          onMounted(() => {
              console.log('3.-组件挂载到页面之后执行-------onMounted')
          })
          const refData = toRefs(data);
          return {
              ...refData,
               course, add ,
          }

      }
  };
</script>
<style lang='scss' scoped>
</style>