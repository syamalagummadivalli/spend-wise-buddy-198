import { describe, it, expect } from 'vitest';
import { reportRange, validateRange } from '@/lib/finance';
import { sampleState } from '@/lib/finance-storage';
const s=sampleState;
describe('report date range',()=>{
 it('October 2026 totals',()=>{const r=reportRange(s.transactions,s.budgets,'2026-10-01','2026-10-31');expect(r.income).toBe(65000);expect(r.expenses).toBe(54250);expect(r.savings).toBe(10750);});
 it('rejects end before start',()=>{expect(validateRange('2026-10-10','2026-10-01')).toMatch(/earlier/);expect(validateRange('2026-10-01','2026-10-01')).toBe('');});
 it('empty year gives zeros',()=>{const r=reportRange(s.transactions,s.budgets,'2025-10-01','2025-10-31');expect(r.income).toBe(0);expect(r.count).toBe(0);});
});
