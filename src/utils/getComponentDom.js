import { createVNode, render } from 'vue';


/**
 * 得到某个组件渲染的跟dom
 * @param {component} comp 组件实例
 * @param {Object} props 组件传参
 */
export default function (comp, props) {
  
 //创建文档碎片   
  const  frag =  document.createDocumentFragment();

  const vNode = createVNode(comp, props);

  render(vNode, frag);

  return vNode.el;
}
