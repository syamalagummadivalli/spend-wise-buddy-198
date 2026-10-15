import { describe, expect, it } from 'vitest';
import { loadFinance, saveFinanceLocal, sampleState, STORAGE_KEY } from '@/lib/finance-storage';
import { report, summarize } from '@/lib/finance';
function mem(){const m=new Map<string,string>();return {getItem:(k:string)=>m.get(k)??null,setItem:(k:string,v:string)=>{m.set(k,v)},removeItem:(k:string)=>{m.delete(k)},clear:()=>m.clear(),key:()=>null,get length(){return m.size}} as Storage;}
describe('SpendSmart saved data',()=>{
 it('starts with sample totals when nothing is saved',()=>{const s=summarize(loadFinance(mem()).transactions,'2026-10',60000);expect([s.income,s.expenses,s.balance]).toEqual([65000,54250,10750]);});
 it('keeps a saved ₹70,000 budget instead of resetting to sample data',()=>{const st=mem();saveFinanceLocal({...sampleState,budgets:{'2026-10':70000}},st);expect(loadFinance(st).budgets['2026-10']).toBe(70000);});
 it('keeps an added transaction after reload',()=>{const st=mem();saveFinanceLocal({...sampleState,transactions:[...sampleState.transactions,{id:'x',type:'expense',amount:250,category:'Food',date:'2026-10-20',description:'Test'}]},st);expect(summarize(loadFinance(st).transactions,'2026-10',0).expenses).toBe(54500);});
 it('recovers from corrupted saved data without crashing',()=>{const st=mem();st.setItem(STORAGE_KEY,'{bad');expect(loadFinance(st).transactions).toHaveLength(14);});
 it('reports match dashboard totals for October',()=>{const r=report(sampleState.transactions,sampleState.budgets,['2026-10']);expect([r.income,r.expenses,r.savings,r.budget]).toEqual([65000,54250,10750,60000]);});
});
