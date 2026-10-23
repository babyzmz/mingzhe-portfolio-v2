export function localDay(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function occursOn(item,date){return item.planDate===date||item.dueDate===date||item.type==='event'&&!!item.planDate&&!!item.endDate&&item.planDate<=date&&date<=item.endDate;}
export function monthDates(anchor){const d=new Date(anchor.slice(0,7)+'-01T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));return Array.from({length:42},(_,n)=>{const value=new Date(d);value.setDate(d.getDate()+n);return localDay(value);});}
export function dashboardGroups(items,date,category='',kind='all'){
 const scope=items.filter(i=>(!category||i.category===category)&&(kind==='all'||i.type===kind));
 const end=new Date(date+'T12:00:00');end.setDate(end.getDate()+7);const until=localDay(end);
 return {tasks:scope.filter(i=>i.type==='task'&&!i.dailyTarget&&i.status!=='done'&&(i.planDate===date||i.dueDate===date||!i.planDate&&!i.dueDate)),events:scope.filter(i=>i.type==='event'&&occursOn(i,date)).sort((a,b)=>(a.startTime||'').localeCompare(b.startTime||'')),important:scope.filter(i=>i.type==='task'&&!i.dailyTarget&&i.status!=='done'&&i.priority==='high'),trackers:scope.filter(i=>i.dailyTarget>0),overdue:scope.filter(i=>i.type==='task'&&i.status!=='done'&&i.dueDate&&i.dueDate<date),upcoming:scope.filter(i=>i.status!=='done'&&i.dueDate&&i.dueDate>=date&&i.dueDate<=until).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)),done:scope.filter(i=>i.type==='task'&&i.status==='done')};
}
