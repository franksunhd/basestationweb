import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

const preventReClick = 
app.directive('preventReClick', {
  // beforeMount(el, binding, vnode, prevVnode) {},
  // mounted() {},
  // beforeUpdate() {},
  // updated() {},
  // beforeUnmount() {},
  // unmounted() {},
  beforeMount:  (el: any, binding: { value: any; }) =>{
      el.addEventListener('click', () => {
          if (!el.disabled) {
              el.disabled = true
              setTimeout(() => {
                  el.disabled = false
              }, binding.value || 2000)
          }
      })
    }
});

export { preventReClick }