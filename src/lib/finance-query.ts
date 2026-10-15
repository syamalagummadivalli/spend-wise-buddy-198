import {queryOptions} from '@tanstack/react-query';
import {loadFinance, loadName} from './finance-storage';
export const financeQuery=queryOptions({queryKey:['finance'],queryFn:async()=>loadFinance(),staleTime:Infinity});
export const nameQuery=queryOptions({queryKey:['display-name'],queryFn:async()=>loadName(),staleTime:Infinity});
