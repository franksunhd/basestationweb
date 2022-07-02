<!--  -->
<template>
  <div>
    <h3>{{ course.name }}</h3>
    <p>id: {{ $route.params.id }}</p>
    <p>price: {{ course.price }}</p>
  </div>
</template>

<script lang='ts'>
import { reactive,toRefs,onBeforeMount,onMounted,watch} from 'vue'
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getCourseById } from "@/api/course";
interface DataProps {}
export default {
    name: '',
    setup() {
        console.log('1-开始创建组件-setup')
        const course = ref({name: "", price: "" });
        const route = useRoute();
        console.log(route.params.id);
        let rid = route.params.id ;
        getCourseById(rid).then(ret => {
          console.log(ret);
          // course.value = ret;
        });
        


        const data: DataProps = reactive({

        })
        onBeforeMount(() => {
            console.log('2.组件挂载页面之前执行----onBeforeMount')
        })
        onMounted(() => {
            console.log('3.-组件挂载到页面之后执行-------onMounted')
        })
        const refData = toRefs(data);
        watch(
          () => route.params,
          () => {
          getCourseById(route.params.id).then(ret => {
            // course.value = ret;
          });
          },
          {
            immediate:true,
            deep:true,
          }
        );
        return {
            ...refData,
            course,
        }

    },
    
  };
</script>
<style lang='scss' scoped>
</style>