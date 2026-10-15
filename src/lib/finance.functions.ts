import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { stateSchema, type FinanceState } from './finance';
const demoId='00000000-0000-4000-8000-000000000001';
async function hash(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');}
export const getFinance=createServerFn({method:'GET'}).handler(async()=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const token=getCookie('spendsmart_workspace');
 const q=supabaseAdmin.from('finance_workspaces').select('transactions,budgets');
 const {data,error}=await (token?q.eq('capability_hash',await hash(token)):q.eq('id',demoId)).single();
 if(error||!data)throw new Error('Your finances could not load. Please try again.');
 return stateSchema.parse(data);
});
export const saveFinance=createServerFn({method:'POST'}).inputValidator(stateSchema).handler(async({data})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 let token=getCookie('spendsmart_workspace');
 if(token){const {error}=await supabaseAdmin.from('finance_workspaces').update({...data,updated_at:new Date().toISOString()}).eq('capability_hash',await hash(token));if(error)throw new Error('Could not save. Please try again.');}
 else {token=crypto.randomUUID()+crypto.randomUUID();const {error}=await supabaseAdmin.from('finance_workspaces').insert({...data,capability_hash:await hash(token)});if(error)throw new Error('Could not save. Please try again.');setCookie('spendsmart_workspace',token,{httpOnly:true,sameSite:'lax',secure:import.meta.env.PROD,path:'/',maxAge:31536000});}
 return data as FinanceState;
});
