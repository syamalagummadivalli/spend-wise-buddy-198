import { describe, expect, it } from 'vitest';
import { summarize, transactionSchema, type Transaction } from '@/lib/finance';
const amounts = {Bills:28500,Food:11750,Education:6000,Travel:4500,Shopping:3500};
const rows:Transaction[]=[{id:'income',type:'income',amount:65000,category:'Salary',date:'2026-10-01',description:'Salary'},...Object.entries(amounts).map(([category,amount])=>({id:category,type:'expense' as const,amount,category,date:'2026-10-02',description:category}))];
describe('SpendSmart financial rules',()=>{
 const summary=summarize(rows,'2026-10',60000);
 it('totals income at ₹65,000',()=>expect(summary.income).toBe(65000));
 it('totals expenses at ₹54,250',()=>expect(summary.expenses).toBe(54250));
 it('calculates available balance as ₹10,750',()=>expect(summary.balance).toBe(10750));
 it('shows 90.4% of ₹60,000 used',()=>{expect(summary.budget).toBe(60000);expect(Number(summary.progress.toFixed(1))).toBe(90.4)});
 Object.entries(amounts).forEach(([category,amount])=>it(`uses the requested ${category} amount`,()=>expect(summary.categories.find(c=>c.name===category)?.value).toBe(amount)));
 it('category chart totals equal total expenses',()=>expect(summary.categories.reduce((s,c)=>s+c.value,0)).toBe(summary.expenses));
 it('filters all calculations by selected month',()=>expect(summarize(rows,'2026-11',60000).expenses).toBe(0));
 it('rejects zero amounts',()=>expect(transactionSchema.safeParse({...rows[0],amount:0}).success).toBe(false));
 it('rejects mismatched category and type',()=>expect(transactionSchema.safeParse({...rows[0],category:'Food'}).success).toBe(false));
 it('updates balance when an expense is added',()=>expect(summarize([...rows,{id:'new',type:'expense',amount:250,category:'Food',date:'2026-10-15',description:'Lunch'}],'2026-10',60000).balance).toBe(10500));
});