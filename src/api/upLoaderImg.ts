//upLoaderImg.js
import axios from 'axios'		//引入axios
import { Toast } from 'vant'	//引入Toast
import store from "../store/index";
import { HttpResponse } from './@types'

function upLoaderImg (file: any) {	//file为 你读取成功的回调文件信息
	//new 一个FormData格式的参数
	let params = new FormData()
	params.append('file', file)
	let baseURL =  process.env.NODE_ENV === 'production'||process.env.NODE_ENV === 'testing' ? "/tklife/test" : '/api';
	let config = {
        headers: { //添加请求头
          	'Content-Type': 'multipart/form-data',
            'Authorization':"",
        }
  	}

  let token = store.state.token
  ||"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjE5MzJhYWRhNGEzZjk3MDZjYjgxMjgiLCJ1YWNJZCI6IjVmMTkzMmFhNmFmMDM3NTBjNmU0OGZkYyIsImV4cCI6MTY0MzAwMzExNH0.lzcU5YuUDtIltEQzF5AyVpn5RcPu7CeRAU7gT8iPsc0"
	;
	if(token){
		store.state.token=token;
		config.headers['Authorization'] = token;
	}
  // static async inquiryAssess(data: object): Promise<HttpResponse> {//评价问题接口

	return new Promise((resolve, reject): HttpResponse=> {
		//把 uploadUrl 换成自己的 上传路径
		return axios.post(baseURL + '/bu-health/files/2401', params, config).then((res: HttpResponse) => {
			console.log('/bu-health/files/2401 ==res  ', res);
			if (res.data?.code == 0) { //如果为真 resolve出去
				resolve(res.data);
			} else {	//否则 Toast 提示
				Toast.fail(res.data && (res.data.msg));
				reject(res.data);
			}
		}).catch((err: any) => {
			Toast.fail('系统异常');
			reject(err);
		});
	})
}
export default upLoaderImg

