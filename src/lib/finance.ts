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
