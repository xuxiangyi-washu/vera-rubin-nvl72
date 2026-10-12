import {useRef} from 'react';
// 在对话框使背景inert之前记住触发元素，兼容Safari鼠标焦点行为。
export function useDialogOpener(open:boolean){
 const wasOpen=useRef(false),opener=useRef<HTMLElement|null>(null);
 if(open&&!wasOpen.current)opener.current=document.activeElement as HTMLElement;
 wasOpen.current=open;
 return opener.current;
}
