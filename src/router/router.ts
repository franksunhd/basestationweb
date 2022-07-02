import { createRouter, 
  createWebHashHistory,
  RouteRecordRaw,
 } from 'vue-router'
import Vuex from '@views/vuex.vue'

// const CourseList = () => import('@views/courseList.vue')
import CourseList from '@views/courseList.vue'
import CourseDetail from '@views/courseDetail.vue'
import CourseAdd from '@views/courseAdd.vue'
import NotFound from '@views/notFound.vue'

const Home = () => import('@views/home.vue')
const Entry = () => import('@views/entry.vue')
const HosDetail = () => import('@views/hosDetail.vue')
const OrderList = () => import('@views/orderList.vue')
const OrderDetail = () => import('@views/orderDetail.vue')
// import Home from '@views/home.vue'
// import Entry from '@views/entry.vue'
// import HosDetail from '@views/hosDetail.vue'
// import OrderList from '@views/orderList.vue'
// import OrderDetail from '@views/orderDetail.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/entry",
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      { path: "/entry", 
        name: "entry", 
        component: Entry,
        meta: { 
          transition: 'slide-left',
          keepAlive:true,
        },
      },
      { path: "/hosDetail", 
        name: "hosDetail", 
        component: HosDetail,
        meta: { 
          transition: 'slide-left',
          keepAlive:true,
        }, 
      },
      { path: "/orderList", 
        name: "orderList", 
        component: OrderList,
        meta: { 
          title: '订单',
          transition: 'slide-left',
          keepAlive:true,
        },
      },
      { path: "/orderDetail", 
        name: "orderDetail", 
        component: OrderDetail,
        meta: { 
          title: '',
          transition: 'slide-left',
          keepAlive:false,
        }, 
      },
    ],
  },
  {
    path: "/courseList",
    component: CourseList,
    children: [
      { path: "/courseDetail/:id", 
        name: "courseDetail", 
        component: CourseDetail,
        beforeEnter: (to, from) => {

        },
        // beforeRouteEnter
        // beforeRouteUpdate
        // beforeRouteLeave
      },
      { path: "/course/add", 
        name: "courseAdd", 
        component: CourseAdd 
      },
    ],
  },
  { path: "/:pathMatch(.*)*", 
    component: NotFound 
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/vuex/:id',//动态路由
        name: 'Vuex',
        component: Vuex
      },
      {
        path: '/orderDetail/:id',//动态路由
        name: 'OrderDetail',
        component: OrderDetail
      },
      { path: "/about", 
        component: CourseAdd
      },
      // 下⾯配置会匹配所有path，匹配内容放⼊`$route.params.pathMatch`
      { path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: NotFound 
      },
      // 匹配所有以`/user-`开头path，匹配内容放⼊`$route.params.afterUser`
      // { 
      //   path: '/user-:afterUser(.*)', 
      //   component: UserGeneric 
      // },
      { path: "/course/:id", 
        component: CourseDetail, 
      }
    ]
  },
  {
    path: '/axios',
    name: 'Axios',
    component: () => import('@/views/axios.vue') // 懒加载组件
  },
]

export default routes