import {useState,type ReactNode} from 'react';
export default function DiagramViewport({children}:{children:ReactNode}){
 const [expanded,setExpanded]=useState(false);
 return <figure className="diagram-viewport"><figcaption><button aria-pressed={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'适应屏幕':'放大图示'}</button><span>{expanded?'可左右滚动查看细节；文字说明在图下方。':'手机上可放大图示查看标注。'}</span></figcaption><div className={expanded?'diagram-scroll expanded':'diagram-scroll'} tabIndex={0} role="region" aria-label="架构图，可横向滚动">{children}</div></figure>;
}
