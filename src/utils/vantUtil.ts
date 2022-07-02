

/**
 * vant 按需引入组件 
 */
// import { 
//   Button,Icon,Col, Row,Empty,Tab, Tabs,
//   Toast,Dialog,
// } from 'vant';
// const vantUtil=(app:any)=>{
//   app.use(
//     Button,Icon,Col, Row,Empty,Tab, Tabs,
//     Toast,Dialog,ConfigProvider,
//   );
// }

/**
 * 导入所有组件（不推荐）
 */
import Vant from 'vant';
import 'vant/lib/index.css';
const vantUtil=(app:any)=>{
  app.use(Vant);

}

export default vantUtil;