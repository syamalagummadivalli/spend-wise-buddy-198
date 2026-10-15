import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/transactions')({
 head:()=>({meta:[{title:'Transactions | SpendSmart'},{name:'description',content:'Add, edit and organize your income and expenses with SpendSmart.'},{property:'og:title',content:'Transactions | SpendSmart'},{property:'og:description',content:'Add, edit and organize your income and expenses with SpendSmart.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 loader:({context})=>context.queryClient.ensureQueryData(financeQuery),
 component:Page
});
function Page(){return <FinanceScreen view="transactions"/>}
