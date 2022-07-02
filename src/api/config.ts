let config = {
    methods: 'post',
    baseURL: '', //基础URL前缀
    headers: { //请求头信息
        'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {}, //参数
    timeout: 10000, //设置超时时间
    withCredentials: false, //携带凭证
    responseType: 'JSON'
}

let domain = document.domain ; 
switch(domain){
    case '127.0.0.1':
    // case '127.0.0.1'||'10.136.193.45':
        config.baseURL = '';
        break;
    case '':
        config.baseURL = '';
        break;
    default : 
        break;
}



export default config
