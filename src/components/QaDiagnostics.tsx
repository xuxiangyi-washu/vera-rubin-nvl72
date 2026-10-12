import {useEffect,useRef,useState} from 'react';
import {useRenderer} from '../stores/useRenderer';
import {useExplorer} from '../stores/useExplorer';
export default function QaDiagnostics(){
 const [message,setMessage]=useState('本地验收工具，不进入生产页面');
 const [visibilityResult,setVisibilityResult]=useState('尚未检查后台暂停');
 const renderer=useRenderer(),hiddenCursor=useRef<string|null>(null),hiddenAt=useRef(0);
 useEffect(()=>{
  const report=()=>{const data={kind:'nvl72-qa',width:window.innerWidth,visible:!document.hidden,canvasSize:document.querySelector('canvas')?.getBoundingClientRect().toJSON(),scrollWidth:document.documentElement.scrollWidth,canvasCount:document.querySelectorAll('canvas').length,status:useRenderer.getState().status,error:document.documentElement.dataset.qaRenderError??'',focus:document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent?.slice(0,60)||''};window.parent.postMessage(data,location.origin)};
  const observer=new ResizeObserver(report);observer.observe(document.documentElement);document.addEventListener('focusin',report);document.addEventListener('visibilitychange',report);report();
  return()=>{observer.disconnect();document.removeEventListener('focusin',report);document.removeEventListener('visibilitychange',report)};
 },[renderer.status]);
 useEffect(()=>{
  const check=()=>{const s=useExplorer.getState(),cursor=[s.inferenceStep,s.inferenceRound,s.inferenceToken].join('/');if(document.hidden){hiddenCursor.current=cursor;hiddenAt.current=performance.now()}else if(hiddenCursor.current){setVisibilityResult(`后台${Math.round(performance.now()-hiddenAt.current)}ms，教学游标${hiddenCursor.current===cursor?'未前进':'已改变'}（${hiddenCursor.current} → ${cursor}）`);hiddenCursor.current=null}};
  document.addEventListener('visibilitychange',check);return()=>document.removeEventListener('visibilitychange',check);
 },[]);
 return <aside className="qa-diagnostics"><strong>本地验收</strong><button onClick={()=>{const canvas=document.querySelector('canvas');const gl=canvas?.getContext('webgl2');const extension=gl?.getExtension('WEBGL_lose_context');if(extension){extension.loseContext();setMessage('已触发WEBGL_lose_context扩展')}else{canvas?.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));setMessage('使用合成上下文丢失事件；未验证驱动级事件')}}}>模拟上下文丢失</button><button onClick={()=>{window.dispatchEvent(new Event('qa-reset-context'));setMessage('已解除初始化失败注入，可重试三维')}}>解除故障注入</button><output>{message} · {window.innerWidth}px · {renderer.status} · {visibilityResult}</output></aside>;
}
