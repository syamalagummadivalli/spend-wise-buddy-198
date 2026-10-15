import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery, nameQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/')({
 head:()=>({meta:[{title:'Dashboard | SpendSmart'},{name:'description',content:'Track your income, expenses, available balance and monthly spending in Indian rupees.'},{property:'og:title',content:'Dashboard | SpendSmart'},{property:'og:description',content:'Track your income, expenses, available balance and monthly spending in Indian rupees.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 ssr:false,
 loader:({context})=>Promise.all([context.queryClient.ensureQueryData(financeQuery),context.queryClient.ensureQueryData(nameQuery)]),
 component:Page
});
function Page(){return <FinanceScreen view="dashboard"/>}
