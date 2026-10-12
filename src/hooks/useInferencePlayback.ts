import {useEffect,useMemo} from 'react';
import {useExplorer} from '../stores/useExplorer';
import {usePageVisible} from './usePageVisible';
import {createPlaybackClock,moveInference} from '../utils/inference-state.mjs';
export function useInferencePlayback(){
 const {view,inferencePlaying,inferenceSpeed}=useExplorer();const visible=usePageVisible();
 const clock=useMemo(()=>createPlaybackClock(()=>{const s=useExplorer.getState();s.update(moveInference(s,1));if(useExplorer.getState().inferenceStep===8)clock.stop()}),[]);
 useEffect(()=>{clock.sync(visible&&view==='inference'&&inferencePlaying,1300/inferenceSpeed);return()=>clock.stop()},[visible,view,inferencePlaying,inferenceSpeed,clock]);
}
