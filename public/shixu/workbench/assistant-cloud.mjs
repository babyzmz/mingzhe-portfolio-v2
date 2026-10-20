import {prepareAction,renderAssistantText,activityForQuestion} from './assistant-actions.mjs?v=0.5.14-calendar-swipe';
export {prepareAction,renderAssistantText,activityForQuestion};
// Temporarily suspend the native-model preference without replaying draft/chat
// or changing account credentials/consent. A later user send follows normal
// cloud sign-in and consent gates. Denied storage still leaves memory usable.
export function migrateAssistantProvider(storage){
 let cloud=true;
 try{
  cloud=storage.getItem('shixu-ai-mode')!=='local';
  if(storage.getItem('shixu-apple-model')==='enabled'&&storage.getItem('shixu-apple-disabled-migration')!=='1'){
   cloud=true;storage.setItem('shixu-ai-mode','cloud');storage.setItem('shixu-apple-disabled-migration','1');
  }
 }catch{}
 return cloud;
}
const stable=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
export function normalizeRead(args){
 if(!args||typeof args!=='object'||Array.isArray(args))throw Error('读取条件无效');
 const text=key=>typeof args[key]==='string'?args[key].trim():'';
 const paging=(key,max,fallback=0)=>Math.max(0,Math.min(max,Math.floor(Number(args[key])||fallback)));
 const out={};if(text('id'))out.id=text('id');
 for(const key of ['from','to'])if(text(key))out[key]=text(key);
 if(out.id){out.offset=paging('offset',10000);out.bodyOffset=paging('bodyOffset',10000000);}
 else{
  for(const key of ['type','status'])if(text(key))out[key]=text(key);
  if(text('query'))out.query=text('query').split(/\s+/).join(' ').toLocaleLowerCase();
  out.offset=paging('offset',10000);out.limit=Math.max(1,paging('limit',20,20));
 }
 return out;
}
export function cloudContext(app,question,state=app.getState()){
 const now=new Date(),soon=Date.now()+14*86400000;
 const needsRecords=/待办|任务|日程|事件|便签|笔记|安排|计划|冲突|空闲|完成|记录|专注|提醒|事项|找|修改|删除|改|排|拆|分类|模板|截止|今天|明天|本周|todo/i.test(question);
 const candidates=(needsRecords?[...state.items]:[]).filter(i=>!/待办|任务/.test(question)||/便签|笔记/.test(question)||i.type!=='note').sort((a,b)=>{const score=i=>(question.includes(i.title)&&i.title?100:0)+(i.status!=='done'?10:0)+(Date.parse(i.planDate||i.dueDate||'')<=soon?5:0);return score(b)-score(a)});
 const records=[];for(const i of candidates.slice(0,60)){const record={id:i.id,type:i.type,title:i.title,bodyCharacters:i.body?.length||0,category:i.category,status:i.status,priority:i.priority,planDate:i.planDate,dueDate:i.dueDate,startTime:i.startTime,endDate:i.endDate,endTime:i.endTime,duration:i.duration,pointEvent:i.pointEvent,repeat:i.repeat,dailyTarget:i.dailyTarget,remindAt:i.remindAt,reminders:i.reminders,subtaskCount:i.subtasks?.length||0,totalCompletions:i.completions?.filter(e=>!e.voided).length||0};if(JSON.stringify(records).length+JSON.stringify(record).length>16000)break;records.push(record)}
 return {now:now.toLocaleString('sv-SE'),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,app:app.assistantState?.(),categories:state.categories.slice(0,30),templates:state.templates?.slice(0,20).map(t=>({id:t.id,name:t.name})),records,totalItems:state.items.length,includedItems:records.length,truncated:records.length<state.items.length,platform:window.Capacitor?.getPlatform?.()||'web'};
}
export function readRecords(app,args){
 const state=app.getState();if(!args||typeof args!=='object')throw Error('读取条件无效');
 if(args.id){
  const i=state.items.find(i=>i.id===args.id);if(!i)return{error:'事项不存在'};
  const matches=(i.completions||[]).filter(e=>{const date=new Date(e.at).toLocaleDateString('sv-SE');return(!args.from||date>=args.from)&&(!args.to||date<=args.to)}).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
  const offset=Math.max(0,Math.min(10000,Number(args.offset)||0)),bodyOffset=Math.max(0,Math.min(i.body.length,Number(args.bodyOffset)||0)),countsByDay={};
  for(const e of matches.filter(e=>!e.voided)){const d=new Date(e.at).toLocaleDateString('sv-SE');countsByDay[d]=(countsByDay[d]||0)+1;}
  return{record:{...i,body:i.body.slice(bodyOffset,bodyOffset+4000),sourceText:undefined,completions:matches.slice(offset,offset+20).map(e=>({...e,note:e.note.slice(0,200)}))},bodyOffset,totalBodyCharacters:i.body.length,bodyHasMore:bodyOffset+4000<i.body.length,completionOffset:offset,completionTotal:matches.length,completionHasMore:offset+20<matches.length,countsByDay};
 }
 let values=state.items.filter(i=>(!args.type||i.type===args.type)&&(!args.status||(args.status==='pending'?i.status!=='done':i.status===args.status))&&(!args.query||String(args.query).trim().split(/\s+/).every(q=>(i.title+' '+i.body).toLocaleLowerCase().includes(q.toLocaleLowerCase()))));
 if(args.from||args.to)values=values.filter(i=>{const dates=[i.planDate,i.dueDate,i.remindAt?.slice(0,10)].filter(Boolean);return dates.some(d=>(!args.from||d>=args.from)&&(!args.to||d<=args.to))||i.type==='event'&&i.planDate&&(i.endDate||i.planDate)>=(args.from||'0000')&&i.planDate<=(args.to||'9999')});
 const offset=Math.max(0,Math.min(10000,Number(args.offset)||0)),limit=Math.max(1,Math.min(20,Number(args.limit)||20));return {total:values.length,offset,hasMore:offset+limit<values.length,records:values.slice(offset,offset+limit).map(i=>({id:i.id,type:i.type,title:i.title,body:i.body.slice(0,300),category:i.category,status:i.status,planDate:i.planDate,dueDate:i.dueDate,startTime:i.startTime,endDate:i.endDate,endTime:i.endTime,remindAt:i.remindAt,dailyTarget:i.dailyTarget,totalCompletions:i.completions?.filter(e=>!e.voided).length||0}))};
}
export async function askCloud(question,app,messages,account,signal,onRead,transport){
 const history=[];let historySize=0;
 const eligible=messages.filter(m=>m.text&&!m.error);
 // Retrying an errored/stopped turn must not place the same unanswered user
 // prompt in both the background history and the current question.
 if(eligible.at(-1)?.role==='user'&&eligible.at(-1).text.trim()===question.trim())eligible.pop();
 for(const m of eligible.slice(-24).reverse()){
  const content=(m.text+(m.actions?.length?'\n应用回执：'+m.actions.map(p=>p.status+':'+(p.receipt||p.op.label)).join('；'):'')).slice(0,6500);
  if(historySize+content.length>48000)break;historySize+=content.length;history.unshift({role:m.role,content});
 }
 const initial=structuredClone(app.getState()),base=cloudContext(app,question,initial);base.pendingActions=messages.flatMap(m=>m.actions||[]).filter(p=>p.status==='pending').slice(-12).map(p=>{const action=JSON.parse(JSON.stringify(p.op));for(const fields of[action.item,action.patch])if(fields){delete fields.body;delete fields.subtasks;}return{proposalId:p.id,action}});
 for(const p of base.pendingActions){const i=initial.items.find(i=>i.id===p.action.id);if(i&&!base.records.some(r=>r.id===i.id))base.records.unshift({id:i.id,title:i.title,type:i.type,status:i.status,category:i.category,planDate:i.planDate,dueDate:i.dueDate,startTime:i.startTime,endDate:i.endDate,endTime:i.endTime,dailyTarget:i.dailyTarget});}
 while(JSON.stringify(base).length>32000&&base.records.length)base.records.pop();base.includedItems=base.records.length;base.truncated=base.records.length<base.totalItems;
 const seen=new Map(base.records.map(r=>[r.id,initial.items.find(i=>i.id===r.id)]));
 const readState=()=>({...initial,items:[...seen.values()].filter(Boolean)});
 // Keep every read result across rounds. The former replacement of context
 // discarded earlier reads, causing models to repeat the same tools forever.
 const readResults=[],cache=new Map(),resultKeys=new Set(),actions=new Map();let readSize=0,context={...base,allowReads:true,readRoundsRemaining:5},stopReason='',cloudContinuation;
 for(let round=0;round<6;round++){
  if(signal.aborted)throw signal.reason;
  const response=transport?await transport({question,context,history},signal):await fetch(account.endpoint+'/v2/assistant/chat',{method:'POST',headers:{Authorization:'Bearer '+account.session,'Content-Type':'application/json'},body:JSON.stringify({question,context,history,consent:true,...(cloudContinuation?{continuation:cloudContinuation}:{})}),signal,redirect:'error'});
  const reader=response.body.getReader();let length=0;const chunks=[];while(true){const{done,value}=await reader.read();if(done)break;length+=value.length;if(length>180000){await reader.cancel();throw Error('助手响应过大')}chunks.push(value)}const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}let data;try{data=JSON.parse(new TextDecoder().decode(bytes))}catch{throw Error('助手返回格式不正确')}
  signal.throwIfAborted();
  if(!response.ok){const error=Error(data.error||'助手服务暂时不可用');error.code=data.code;error.status=response.status;if(actions.size)return{text:'已准备以下部分候选，尚未执行。其余处理未完成：'+error.message,actions:[...actions.values()],reads:[],readState:readState()};throw error;}
  if(typeof data.text!=='string'||!Array.isArray(data.actions)||data.actions.length>16||data.reads&&(!Array.isArray(data.reads)||data.reads.length>8))throw Error('助手回复不完整');
  if(!transport)cloudContinuation=data.continuation;
  for(const action of data.actions){const{label,...identity}=action,key=stable(identity);if(!actions.has(key)&&actions.size<16)actions.set(key,action);}
  const finish=(incomplete=false,reason='')=>({...data,text:data.text+(incomplete?'\n\n'+(actions.size?'已保留以上待确认候选，尚未执行。':'')+'本次未能完成全部读取，已停止重复处理；请根据已有结果核对，或说明要补充的具体事项。':''),actions:[...actions.values()],reads:[],readState:readState(),...(incomplete?{incomplete:true,stopReason:reason}:{} )});
  if(!data.reads?.length)return finish();
  // allowReads is an enforced phase boundary, not merely a suggestion to a
  // provider. One final-answer opportunity follows stalled/budgeted reading.
  if(context.allowReads===false||round===5)return finish(true,stopReason||'read_round_limit');
  onRead?.();let fresh=0;
  for(const args of data.reads){
   const query=normalizeRead(args),key=stable(query);if(cache.has(key))continue;
   const snapshot=structuredClone(app.getState()),result=readRecords({getState:()=>snapshot},query),size=JSON.stringify(result).length;
   // A negative search is evidence about its actual filters. Preserve distinct
   // searches, but changing an empty page offset/limit is not new information.
   const {offset:emptyOffset,limit:emptyLimit,bodyOffset:emptyBodyOffset,...filters}=query;
   const resultKey=!result.record&&!result.records?.length?stable({negative:result.error||result.total||0,filters}):stable(result);
   cache.set(key,result);if(resultKeys.has(resultKey))continue;
   if(readSize+size>56000){base.readBudgetNotice='读取内容已接近本次预算，请使用已有结果回答并准备全部明确的操作；未覆盖内容要说明，不要继续重复读取。';break;}
   resultKeys.add(resultKey);readSize+=size;fresh++;readResults.push({query,result});
   for(const r of result.record?[result.record]:result.records||[]){const current=snapshot.items.find(i=>i.id===r.id);if(current&&!seen.has(r.id))seen.set(r.id,current);}
  }
  stopReason=base.readBudgetNotice?'read_size_limit':fresh===0?'read_no_progress':round>=4?'read_round_limit':'';
  context={...base,readResults,generatedActions:[...actions.values()].map(a=>({action:a.action,id:a.id,label:a.label,title:a.item?.title,planDate:a.item?.planDate,startTime:a.item?.startTime})),allowReads:!stopReason,readRoundsRemaining:stopReason?0:Math.max(0,4-round),readProgress:{round:round+1,newResults:fresh,totalResults:readResults.length,phase:stopReason?'final-answer':'reading'}};
  if(stopReason)context.readBudgetNotice=base.readBudgetNotice||'读取没有新增信息或已到本轮边界。现在必须根据累积readResults回答；不要继续请求读取，缺失内容请明确说明。';
  while(JSON.stringify(context).length>94000&&context.records.length)context.records.pop();
  // Preserve the first-read snapshot, so an edit during generation is refused.
 }
}
