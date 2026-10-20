// Chat shares the existing local account cache; no account transport object is
// serialized here. This module never changes state/meta or another owner's chat.
export const CHAT_LIMITS=Object.freeze({messages:50,bytes:192*1024,text:16000});
const secretKey=/^(account|session|token|password|secret|apiKey|authorization|endpoint|authProof|keyEnvelope|transport)$/i;
const clean=value=>JSON.parse(JSON.stringify(value,(key,item)=>secretKey.test(key)?undefined:item));
const bytes=value=>new TextEncoder().encode(JSON.stringify(value)).length;
const opKeys=new Set('action id label item patch steps entryId route query name color at note theme replaces'.split(' '));
const statuses=new Set('pending applying applied rejected error superseded expired'.split(' '));
const text=value=>typeof value==='string'?value:'';
function htmlText(html){return text(html).replace(/<(?:br|\/p|\/tr|\/li)\s*\/?>/gi,'\n').replace(/<[^>]*>/g,' ').replace(/&(?:amp|lt|gt|quot|#39);/g,token=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[token])).trim();}
function proposal(value){
 if(!value||typeof value!=='object'||!value.op||typeof value.op.action!=='string')return null;
 const op=clean(Object.fromEntries(Object.entries(value.op).filter(([key])=>opKeys.has(key))));
 let revision='';try{revision=JSON.stringify(clean(JSON.parse(text(value.revision))));}catch{}
 const status=statuses.has(value.status)&&value.status!=='applying'?value.status:'expired';
 const receipt=text(value.receipt).slice(0,4000)||(value.status==='applying'?'上次执行没有完成回执，请先核对事项，避免重复执行。':'');
 const result={id:text(value.id).slice(0,100),op,revision,status:revision?status:'expired',receipt};
 return bytes(result)<=65536?result:{...result,op:{action:op.action,label:text(op.label)},revision:'',status:'expired'};
}
export function boundedChat(value){
 if(!Array.isArray(value))return [];
 const messages=[];
 for(const entry of value.slice(-CHAT_LIMITS.messages)){
  if(!entry||!['user','assistant'].includes(entry.role))continue;
  const original=typeof entry.text==='string'?entry.text:htmlText(entry.html);
  const message={role:entry.role,text:original.slice(0,CHAT_LIMITS.text)};
  if(entry.truncated||original.length>CHAT_LIMITS.text)message.truncated=true;
  if(entry.error)message.error=true;
  if(typeof entry.retryQuestion==='string')message.retryQuestion=entry.retryQuestion.slice(0,4000);
  if(Array.isArray(entry.actions))message.actions=entry.actions.slice(0,16).map(proposal).filter(Boolean);
  if(entry.incomplete)message.incomplete=true;
  messages.push(message);
 }
 while(bytes(messages)>CHAT_LIMITS.bytes&&messages.length>1)messages.shift();
 if(bytes(messages)>CHAT_LIMITS.bytes){messages[0].actions=[];messages[0].truncated=true;}
 return messages;
}
const parse=value=>{try{return JSON.parse(value);}catch{return null;}};
export function createChatHistory(local,session){
 const ownerName=owner=>String(owner||'local');
 const key=owner=>ownerName(owner)==='local'?'shixu-chat-local':'shixu-account-cache:'+ownerName(owner);
 const persistent=owner=>{const saved=parse(local.getItem(key(owner)));return ownerName(owner)==='local'?saved:saved?.chat;};
 function writeSession(owner,messages){try{session.setItem('shixu-chat',JSON.stringify(messages));session.setItem('shixu-chat-owner',ownerName(owner));}catch{}}
 function save(owner,value){
  const messages=boundedChat(value);let saved=false;
  try{
   if(ownerName(owner)==='local')local.setItem(key(owner),JSON.stringify(messages));
   else{const cache=parse(local.getItem(key(owner)));local.setItem(key(owner),JSON.stringify({...((cache&&typeof cache==='object'&&!Array.isArray(cache))?cache:{}),chat:messages}));}
   saved=true;
  }catch{}
  writeSession(owner,messages);return{messages,persisted:saved};
 }
 function load(owner,{legacySession=true,fallback=[]}={}){
  let value;try{value=persistent(owner);}catch{}
  if(Array.isArray(value)){const messages=boundedChat(value);writeSession(owner,messages);return messages;}
  let sessionOwner,legacy=null;try{sessionOwner=session.getItem('shixu-chat-owner');legacy=legacySession&&(!sessionOwner||sessionOwner===ownerName(owner))?parse(session.getItem('shixu-chat')):null;}catch{}
  return save(owner,Array.isArray(legacy)?legacy:fallback).messages;
 }
 return{load,save,clear:owner=>save(owner,[]),bounded:boundedChat,dropSession(){try{session.removeItem('shixu-chat');session.removeItem('shixu-chat-owner');}catch{}}};
}
