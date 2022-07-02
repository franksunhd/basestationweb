import  {service,upLoaderImg} from './http'
import { HttpResponse } from './@types'
import qs from "qs"
/**
 * @interface loginParams -登录参数
 * @property {string} username -用户名
 * @property {string} password -用户密码
 */
interface LoginParams {
  verifyCode: string
  mobile: string
  deviceId: string
  deviceType: string
}
// 转化form的方法
function getFrom(data: any) {
  let form = new FormData();
  let keys = Object.keys(data);
 
  keys.forEach(key => {
      if (data[key] instanceof Array) {
          (data[key]).map((item:any) => {
              form.append(key, item);
          });
      } else {
          form.append(key, data[key]);
      }
  });
  
  // form.append('channelId', '0000026')
  // form.append('file', data)
  // console.log('getFrom=======', form.get('file'), form)
  return form;
}
//封装User类型的接口方法
export default class UserService {
  // mobilenet/analysis-report/currency-im/t-patient-info
  // mobilenet/analysis-report/login/register/currency
  // 获取用户基本信息
  static async tPatientInfo(params: object): Promise<HttpResponse> {
    return service({
        url: `currency-im/t-patient-info`,
        method: "get",
        params
    });
  };
  // 通用注册（无激活操作）
  static async rCurrency(data: object): Promise<HttpResponse> {
    return service({
        url: `login/register/currency?source=TLife`,
        method: 'post',
        responseType: 'json',
        data: {
          ...data
        },
    });
  };
  
  // 泰生活用户实名认证
  static async verifyUser(params: object): Promise<HttpResponse> {
    return service({
        url: `user/verifyUser`,
        // url: `/bu-health/tcm/verifyUser`,
        method: "get",
        params
    });
  };

  // 驻点服务--根据客户信息和订单信息查询订单列表
  static async getChannelOrderListByCustomerAndOrder(): Promise<HttpResponse> {
    return service('order/getChannelOrderListByCustomerAndOrder', {
      method: 'get',
      responseType: 'json',
      
    })
  };
  // 驻点服务--查询订单申请信息
  static async getGreenApplicationInfo(data: any): Promise<HttpResponse> {
    return service('order/getGreenApplicationInfo', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
        ,"manageOrgCode":"ylzyfzb"
      },
    })
  };
  // 驻点服务--获取订单流程信息
  static async getOrdCycleInfo(params: any): Promise<HttpResponse> {
    return service('order/tLife/getOrdCycleInfo', {
      method: 'get',
      responseType: 'json', 
      params: {
        ...params
      },
    })
  };


  /**
   * @description 查询User的信息
   * @param {number} teamId - 所要查询的团队ID
   * @return {HttpResponse} result
   */
  static async login(data: LoginParams): Promise<HttpResponse> {
    return service('/users/login/', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }

  static async resgister(params: LoginParams): Promise<HttpResponse> {
    return service('/api/user/resgister', {
      method: 'get',
      responseType: 'json',
      params: {
        ...params
      },
    })
  }



  static async inquiryLogin(): Promise<HttpResponse> {//用户登录春雨医生
    return service('/bu-health/inquiry/login', {
      method: 'post',
      responseType: 'json',
    })
  }
  static async inquiry(data: object): Promise<HttpResponse> {//创建问题
    return service('/bu-health/inquiry', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }
  static async inquiryMine(params: object): Promise<HttpResponse> {//查询我的提问历史
    return service('/bu-health/inquiry/mine', {
      method: 'get',
      responseType: 'json',
      params: {
        ...params
      },
    })
  }
  static async inquiryDetail(params: object): Promise<HttpResponse> {//问诊详情接口
    return service('/bu-health/inquiry/detail', {//0 刷新最新回复 1问诊详情所有内容
      method: 'get',
      responseType: 'json',
      params: {
        ...params
      },
    })
  }

  static async inquiryDoctor(params: string): Promise<HttpResponse> {//查询医生详情
    // /bu-health/inquiry/doctor/{doctorId}  ?? 没有医生id
    return service('/bu-health/inquiry/doctor/'+params, {
      method: 'post',
      responseType: 'json',
    })
  }
  static async inquiryViewed(data: object): Promise<HttpResponse> {//问题已查看接口
    //  "problemId": 0
    return service('/bu-health/inquiry/viewed', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }
  static async inquiryExtension(data: object): Promise<HttpResponse> {//追问
    return service('/bu-health/inquiry/extension', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }
  static async inquiryAssess(data: object): Promise<HttpResponse> {//评价问题接口
    return service('/bu-health/inquiry/assess', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }
  static async inquiryLinkmans(): Promise<HttpResponse> {//查询联系人列表
    return service('/develop/bu-health/inquiry/linkman/getLinkmans', {
      method: 'get',
      responseType: 'json',
    })
  }

  static async inquiryAddLinkman(data: object): Promise<HttpResponse> {//添加查询联系人saveLinkman
    return service('/develop/bu-health/inquiry/linkman/saveLinkman', {
      method: 'post',
      responseType: 'json',
      data: {
        ...data
      },
    })
  }

  // static async inquiryUploadImg(data: any): Promise<HttpResponse> {
  //   console.log('data===========>',data)
  //   return upLoaderImg('/bu-health/files/2401',{
  //     method: 'postFform',
  //     ContentType:'multipart/form-data;',
  //     responseType: 'json',
  //     data: {
  //       ...data
  //     },
  //   })
  // }
}