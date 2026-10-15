import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery, nameQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/reports')({
 head:()=>({meta:[{title:'Reports & Analytics | SpendSmart'},{name:'description',content:'See income, spending trends and budget vs actual in SpendSmart.'},{property:'og:title',content:'Reports & Analytics | SpendSmart'},{property:'og:description',content:'See income, spending trends and budget vs actual in SpendSmart.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 ssr:false,
 loader:({context})=>Promise.all([context.queryClient.ensureQueryData(financeQuery),context.queryClient.ensureQueryData(nameQuery)]),
 component:Page
});
function Page(){return <FinanceScreen view="reports"/>}
