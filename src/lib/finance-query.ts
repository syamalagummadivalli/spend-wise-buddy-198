import {queryOptions} from '@tanstack/react-query';
import {getFinance} from './finance.functions';
export const financeQuery=queryOptions({queryKey:['finance'],queryFn:()=>getFinance()});
