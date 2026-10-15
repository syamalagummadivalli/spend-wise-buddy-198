import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/categories')({
 head:()=>({meta:[{title:'Spending Categories | SpendSmart'},{name:'description',content:'Explore bills, food, education, travel and shopping expenses with SpendSmart.'},{property:'og:title',content:'Spending Categories | SpendSmart'},{property:'og:description',content:'Explore bills, food, education, travel and shopping expenses with SpendSmart.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 ssr:false,
 loader:({context})=>context.queryClient.ensureQueryData(financeQuery),
 component:Page
});
function Page(){return <FinanceScreen view="categories"/>}
