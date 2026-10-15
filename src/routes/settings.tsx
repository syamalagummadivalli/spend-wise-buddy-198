import { createFileRoute } from '@tanstack/react-router';
import { FinanceScreen } from '@/components/finance/finance-screen';
import { financeQuery } from '@/lib/finance-query';
export const Route=createFileRoute('/settings')({
 head:()=>({meta:[{title:'Settings | SpendSmart'},{name:'description',content:'Update your display name and monthly budget in SpendSmart.'},{property:'og:title',content:'Settings | SpendSmart'},{property:'og:description',content:'Update your display name and monthly budget in SpendSmart.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 ssr:false,
 loader:({context})=>context.queryClient.ensureQueryData(financeQuery),
 component:Page
});
function Page(){return <FinanceScreen view="settings"/>}
