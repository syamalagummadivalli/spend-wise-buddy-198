import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/budgets')({
 head:()=>({meta:[{title:'Monthly Budget | SpendSmart'},{name:'description',content:'Plan your monthly budget and see category-wise spending with SpendSmart.'},{property:'og:title',content:'Monthly Budget | SpendSmart'},{property:'og:description',content:'Plan your monthly budget and see category-wise spending with SpendSmart.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 ssr:false,
 loader:({context})=>context.queryClient.ensureQueryData(financeQuery),
 component:Page
});
function Page(){return <FinanceScreen view="budgets"/>}
