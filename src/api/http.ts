// http.ts
import axios from 'axios'
import qs from "qs"
import store from "../store/index";
import { Toast } from 'vant'	//引入Toast


const showStatus = (status: number) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}，请检查网络或联系管理员！`
}
const baseURL:any = import.meta.env.VITE_APP_API_URL;//VITE_APP_IMG_URL
console.log("11111111111111111111111",baseURL);
const service = axios.create({
  // 联调
  // baseURL: process.env.NODE_ENV === 'production'||process.env.NODE_ENV === 'testing' ? "" : '/api',
  baseURL: baseURL,
  headers:{'Content-Type':'application/json;charset=utf-8'},
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  transformRequest: [(data: any) => {
    console.log("transformRequest==",data)
    data = JSON.stringify(data)
    return data
  }],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  transformResponse: [(data: string) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      
      return JSON.parse(data)
    }
    return data
  }]
  
})

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
// 请求拦截器
service.interceptors.request.use((config:any) => {
  //获取token，并将其添加至请求头中
  console.log("token===",store.state.token,"config==",config);
  if(store.state.token){
  }else{
    if (/medicaluat.mobile.taikang.com/.test(document.domain) || /medical.mobile.taikang.com/.test(document.domain)) {
      console.log('泰生活 app里面');
    } else {
      store.state.token = 
      // 13909515618 戴三专
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjBjNjFjNmE4OTAxYzI0NGEwNTg0ZjgiLCJ1YWNJZCI6IjYyMGM2MWM1MzcwYWY1NjYwZGViZWU3NiIsImV4cCI6MTY0NjIxNTg3Mn0.Hz-SqVF-IW7ehQzRmfY7ywDvjcvmU1QHR4YIEW224hw"
      //13141285508    抗压
      // "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MDM2MjFkMzkyZjM1MjdlMzFkY2Y5OGYiLCJ1YWNJZCI6IjYwMzYyMWQzMzcwYWY1MzJlODRkMWVhNCIsImV4cCI6MTY0NTQyMzk4OX0.9rhD2g2WCmSM20v3k0gJJT40C1LQNr5KRzQImqwNj_4"
      //18810404700   华思雨
      // "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MDczZGU5NmM3YzE2NTI3ZDA4M2EyMzciLCJ1YWNJZCI6IjYwNzNkZTk2MzcwYWY1MTA1ZjUxYTE2OSIsImV4cCI6MTY0NDk4MzkzMX0.SPNOjZrZC81ginLRSwOjnlaC0eWw4LXKZ_n3t_lwaUU"
      //15654689441    萧大冠
      // "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MjA0N2MxYmE4OTAxYzI0NGEwNTgxMzYiLCJ1YWNJZCI6IjYyMDQ3YzFiMzcwYWY1NjYwZGViZWFiNyIsImV4cCI6MTY0NTU5Nzc3NX0.ApqOGyz0uOAIipKFQn_83fBw0N5Esn6CdS38NC-NsrE"
    }
  }
  config.headers['token'] = store.state.token
  config.headers['Authorization'] = store.state.token
  config.headers['isICF'] = '2'
  config.headers['activityId'] = 'currency_im';
  config.headers['channel'] = '0000009';
  config.headers['subActivityId'] = 'currency_im'; 
  
  if(config.ContentType){
    config.headers['Content-Type'] = config.ContentType;
  }
  return config
}, (error: { data: { msg?: any } }) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '服务器异常，请联系管理员！'
  return Promise.resolve(error)
})

// 响应拦截器
service.interceptors.response.use((response: any) => {
  const status = response.status
  let msg = ''
  console.log("interceptors.response",response);
  console.log("url",response.config.url,"params",response.config.params,"data",response.config.data);
  console.log("response data",response.data);
  if (status < 200 || status >= 300) {
    // 处理http错误，抛到业务代码
    msg = showStatus(status)
    if (typeof response.data === 'string') {
      response.data = { msg }
    } else {
      response.data.msg = msg
    }
  }else{// 正常成功的数据 根据返回的code值来做不同的处理(和后端约定)
    let resData = response.data;
    console.log("resData ==",resData)
    switch (resData.code) {
      case 0:
      case '2000':
        return resData.data;
        break;
      case '99': // code: 99, msg: '长时间未登录，为了您的账户安全，请使用手机号登录', data: null}
      case '101041019': // 登陆失效
      case '101041021': // 无token，未登陆
          console.log('登录已过期，请重新登录');
          return Promise.reject(resData);
          // if( util.isInApp() ){ // 泰生活App中
          //     util.todoDiffDeviceFn(
          //         function(){
          //             // 调取app登录页面
          //             .NativeFunction(JSON.stringify({
          //                 'command': 'loginService',
          //                 'callback': 'loginServiceBack'
          //             }));
          //         },
          //         function(){
          //             .webkit.messageHandlers.NativeFunction.postMessage(JSON.stringify({
          //                 'command': 'loginService',
          //                 'callback': 'loginServiceBack'
          //             }))
          //         }
          //     );

          //     window.loginServiceBack =  function (logindata) {
          //         var reslogin = JSON.parse(logindata);

          //         // console.log( 'loginServiceBack----', reslogin );
          //         if (reslogin.code == '0') {// 用户重新登录成功状态
          //             window.location.href = window.location.origin + '/healthaftercompensation/mainpage';
                      
          //         }else{  // 用户重新登录成功状态

          //         }
          //     };
          // }
          break;
      default:
        return Promise.reject(resData);
        break;
    }
  }
  return response
}, (error: { message: string; data: { msg?: any } }) => {
  if (axios.isCancel(error)) {
    console.log('repeated request: ' + error.message)
  } else {
    // handle error code
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
    // ElMessage.error(error.data.msg)
  }
  return Promise.reject(error)
})

// 接口响应通过格式
export interface HttpResponse {
  status: number
  statusText: string
  code:number
  data: {
    code: number
    desc: string
    [key: string]: any
  }
}
function upLoaderImg (file:any) {	//file为 你读取成功的回调文件信息
	//new 一个FormData格式的参数
	let params = new FormData()
	params.append('file', file)
	let config = {
        headers: { //添加请求头
          	'Content-Type': 'multipart/form-data'
        }
  	}
	return new Promise((resolve, reject) => {
		//把 uploadUrl 换成自己的 上传路径
		axios.post('uploadUrl', params, config).then((res: any) => {
	        if (res && res.data && res.data.status === 1) {				//如果为真 resolve出去
	        	resolve(res.data)
	        } else {
	        	//否则 Toast 提示
	        	Toast.fail(res.data && (res.data.msg))
	        	reject(res.data)
	        }
        }).catch((err: any) => {
          	Toast.fail('系统异常')
          	reject(err)
    	});
	})
}
export  {service,upLoaderImg};