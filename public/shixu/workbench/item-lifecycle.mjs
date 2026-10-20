import {creationUtc,zoneOf,reminderLocal} from './creation-model.mjs';

// Display-only state: never change status, timestamps, reminders or calendar mirrors.
export function itemTiming(item,now=Date.now()){
 if(!item||item.status==='done'||!Number.isFinite(now))return '';
 if(item.type==='event'){
  const zone=zoneOf(item),start=creationUtc(item.planDate+'T'+item.startTime,zone);
  const end=item.pointEvent?start+60000:creationUtc(item.endDate+'T'+item.endTime,zone);
  return Number.isFinite(start)&&Number.isFinite(end)&&end>start&&end<=now?'ended':'';
 }
 if(item.type!=='task'||item.dailyTarget>0)return '';
 const localDay=reminderLocal(item,now).slice(0,10);
 const validDay=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
 if(validDay(item.dueDate)&&item.dueDate<localDay)return 'overdue';
 return validDay(item.planDate)&&item.planDate<localDay?'plan-past':'';
}
