import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const globalProperties = appContext.config.globalProperties
    return {
        globalProperties
    }
}

// 组件中使用

// 先引入文件
// import useCurrentInstance from "@/hooks/useCurrentInstance";
// 在setup 中使用处理
// const { globalProperties } = useCurrentInstance();