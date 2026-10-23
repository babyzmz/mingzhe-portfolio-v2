import {canonical} from './sync.mjs';
const copy=value=>structuredClone(value);
export function draftShape(item){
 if(!item||typeof item!=='object'||Array.isArray(item)||!['task','event','note'].includes(item.type))return false;
 if(!['title','body','id','category','priority','status','repeat','planDate','dueDate','startTime','endDate','endTime','remindAt'].every(k=>typeof item[k]==='string'))return false;
 if(!['todo','doing','done'].includes(item.status)||!['normal','high','low'].includes(item.priority)||!['none','daily','weekdays','weekly','monthly','custom'].includes(item.repeat))return false;
 if(!Array.isArray(item.subtasks)||item.subtasks.some(s=>!s||typeof s!=='object'||typeof s.text!=='string'||typeof s.done!=='boolean'))return false;
 return ['reminders','dailyReminderTimes','repeatWeekdays','completions'].every(k=>item[k]===undefined||Array.isArray(item[k]));
}
export const draftOwner=storage=>storage.getItem('shixu-account-owner')||'local';
export function editorSession(owner,original,existing=false){return Object.freeze({owner,key:existing?'item:'+original.id:'new',existing,baseline:copy(original)});}
export function checkEditorContext(session,owner,current){
 if(session.owner!==owner)throw Error('账户已切换，草稿仍保留在原账户，请重新打开编辑器。');
 if(session.existing&&canonical(current??null)!==canonical(session.baseline))throw Error('事项已在其他窗口更新或删除。草稿已保留，请关闭后重新打开核对。');
}
export function createDraftArchive(storage,prefix='shixu-editor-draft:'){
 const blocked=new Set();
 const path=(owner,key)=>prefix+encodeURIComponent(owner)+':'+encodeURIComponent(key);
 const read=(owner,key,savedIDs=[])=>{
  const keyPath=path(owner,key);try{
  const raw=storage.getItem(keyPath);if(raw===null)return null;
  if(raw.length>2000000)throw Error('草稿文件过大，原稿未改动。');
  let v;try{v=JSON.parse(raw)}catch{throw Error('草稿无法读取，原稿未改动。');}
  if(v?.version!==1||v.owner!==owner||v.key!==key||!draftShape(v.item)||!draftShape(v.baseline))throw Error('草稿内容不匹配，原稿未改动。');
  if(key==='new'&&savedIDs.includes(v.item.id))return null;
  return copy(v);
  }catch(error){blocked.add(keyPath);throw error;}
 };
 const clear=(owner,key)=>{storage.removeItem(path(owner,key));blocked.delete(path(owner,key));};
 const persist=(session,item)=>{
  if(blocked.has(path(session.owner,session.key)))throw Error('故障草稿尚未保留，未覆盖原文件。');
  if(canonical(item)===canonical(session.baseline)){clear(session.owner,session.key);return;}
  const raw=JSON.stringify({version:1,owner:session.owner,key:session.key,baseline:session.baseline,item,updatedAt:new Date().toISOString()});
  if(raw.length>2000000)throw Error('草稿过大，尚未保存。');
  storage.setItem(path(session.owner,session.key),raw);
 };
 const preserve=(owner,key)=>{const keyPath=path(owner,key),raw=storage.getItem(keyPath);if(raw!==null){storage.setItem(keyPath+':retained:'+Date.now()+':'+Math.random().toString(36).slice(2),raw);storage.removeItem(keyPath);blocked.delete(keyPath);}};
 return {read,persist,clear,preserve};
}
