import { z } from 'zod';
export const expenseCategories = ['Bills','Food','Education','Travel','Shopping'] as const;
export const incomeCategories = ['Salary','Freelance','Allowance','Other'] as const;
export const transactionSchema = z.object({id:z.string().min(1).max(100),type:z.enum(['income','expense']),amount:z.number().positive('Enter an amount greater than zero.').max(100000000).refine(n=>Math.abs(Math.round(n*100)-n*100)<0.000001,'Use at most two decimal places.'),category:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(d=>!Number.isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0,10)===d,'Choose a valid date.'),description:z.string().trim().min(1,'Add a description.').max(160)}).refine(t=>(t.type==='expense'?expenseCategories:incomeCategories).includes(t.category as never),'Choose a category for this transaction type.');
export type Transaction = z.infer<typeof transactionSchema>;
export const stateSchema = z.object({transactions:z.array(transactionSchema).max(5000),budgets:z.record(z.string().regex(/^\d{4}-\d{2}$/),z.number().positive().max(100000000))});
export type FinanceState=z.infer<typeof stateSchema>;
export const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:n%1?2:0}).format(n);
export function summarize(transactions:Transaction[],month:string,budget:number){
 const rows=transactions.filter(t=>t.date.startsWith(month));
 const income=rows.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
 const expenses=rows.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
 const categories=expenseCategories.map(name=>({name,value:rows.filter(t=>t.type==='expense'&&t.category===name).reduce((s,t)=>s+t.amount,0)}));
 return {rows,income,expenses,balance:income-expenses,budget,progress:budget>0?expenses/budget*100:0,categories};
}
export function monthsEnding(end:string,count:number){const y=Number(end.slice(0,4)),m=Number(end.slice(5,7));return Array.from({length:count},(_,i)=>{const d=new Date(Date.UTC(y,m-1-(count-1-i),1));return d.toISOString().slice(0,7);});}
export function report(transactions:Transaction[],budgets:Record<string,number>,months:string[]){
 const trend=months.map(month=>{const s=summarize(transactions,month,budgets[month]??0);return {month,income:s.income,expenses:s.expenses,budget:s.budget,savings:s.balance};});
 const rows=transactions.filter(t=>months.includes(t.date.slice(0,7)));
 const income=trend.reduce((s,m)=>s+m.income,0);const expenses=trend.reduce((s,m)=>s+m.expenses,0);
 const categories=expenseCategories.map(name=>({name,value:rows.filter(t=>t.type==='expense'&&t.category===name).reduce((s,t)=>s+t.amount,0)}));
 return {trend,income,expenses,savings:income-expenses,budget:trend.reduce((s,m)=>s+m.budget,0),categories,count:rows.length};
}
/** Normalise any stored date to a plain YYYY-MM-DD string (no timezone shifting). */
export function dayKey(date:string){return /^\d{4}-\d{2}-\d{2}/.test(date)?date.slice(0,10):'';}
export function monthsBetween(start:string,end:string){const out:string[]=[];let y=Number(start.slice(0,4)),m=Number(start.slice(5,7));const ey=Number(end.slice(0,4)),em=Number(end.slice(5,7));if(!y||!m||!ey||!em)return out;while((y<ey||(y===ey&&m<=em))&&out.length<240){out.push(`${y}-${String(m).padStart(2,'0')}`);m++;if(m>12){m=1;y++;}}return out;}
export function validateRange(start:string,end:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end))return 'Choose both a start date and an end date.';if(end<start)return 'End date cannot be earlier than the start date.';return '';}
export function lastDay(month:string){const y=Number(month.slice(0,4)),m=Number(month.slice(5,7));return `${month}-${String(new Date(Date.UTC(y,m,0)).getUTCDate()).padStart(2,'0')}`;}
/** Report for an inclusive date range; every section derives from the same filtered rows. */
export function reportRange(transactions:Transaction[],budgets:Record<string,number>,start:string,end:string){
 const rows=transactions.filter(t=>{const d=dayKey(t.date);return d!==''&&d>=start&&d<=end;});
 const months=monthsBetween(start.slice(0,7),end.slice(0,7));
 const trend=months.map(month=>{const r=rows.filter(t=>dayKey(t.date).startsWith(month));const income=r.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);const expenses=r.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);const budget=budgets[month]??0;return {month,income,expenses,budget,savings:income-expenses};});
 const income=trend.reduce((s,m)=>s+m.income,0);const expenses=trend.reduce((s,m)=>s+m.expenses,0);
 const categories=expenseCategories.map(name=>({name,value:rows.filter(t=>t.type==='expense'&&t.category===name).reduce((s,t)=>s+t.amount,0)}));
 return {trend,income,expenses,savings:income-expenses,budget:trend.reduce((s,m)=>s+m.budget,0),categories,count:rows.length};
}
