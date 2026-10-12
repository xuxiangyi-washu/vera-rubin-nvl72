import {useEffect} from 'react';
import {topology} from '../data';
import {useExplorer} from '../stores/useExplorer';
import {parseExploration,serializeExploration} from '../utils/exploration-url.mjs';
export function useExplorationUrl(){useEffect(()=>{
 let restoring=false,pending=false,alive=true;
 const restore=()=>{restoring=true;useExplorer.getState().update({...parseExploration(location.hash,topology.entities),researchOpen:false,sidebarOpen:false});restoring=false};
 restore();history.replaceState(null,'',location.pathname+location.search+serializeExploration(useExplorer.getState()));
 const unsubscribe=useExplorer.subscribe((state,previous)=>{
  if(restoring||state.inferencePlaying)return;
  if(serializeExploration(state)===serializeExploration(previous)||pending)return;
  pending=true;queueMicrotask(()=>{pending=false;if(!alive||restoring)return;const next=serializeExploration(useExplorer.getState());if(next!==location.hash)history.pushState(null,'',location.pathname+location.search+next)});
 });
 window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
 return()=>{alive=false;unsubscribe();window.removeEventListener('popstate',restore);window.removeEventListener('hashchange',restore)};
},[])}
export function currentViewUrl(){const url=new URL(location.href);url.searchParams.delete('qa');url.searchParams.delete('qa_init');url.hash=serializeExploration(useExplorer.getState());return url.href}
