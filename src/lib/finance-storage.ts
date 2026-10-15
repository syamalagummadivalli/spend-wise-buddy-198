import { stateSchema, type FinanceState } from './finance';

// Browser-only persistence for SpendSmart. Sample data is written only when nothing is saved yet.
export const STORAGE_KEY = 'spendsmart:data:v1';
export const NAME_KEY = 'spendsmart:display-name:v1';
export const DEFAULT_NAME = 'My workspace';

const t = (id: string, type: 'income' | 'expense', amount: number, category: string, date: string, description: string) => ({ id, type, amount, category, date, description });
export const sampleState: FinanceState = {
  budgets: { '2026-10': 60000 },
  transactions: [
    t('1', 'income', 45000, 'Salary', '2026-10-01', 'Monthly salary'),
    t('2', 'income', 15000, 'Freelance', '2026-10-05', 'Website design project'),
    t('3', 'income', 5000, 'Allowance', '2026-10-02', 'Family allowance'),
    t('4', 'expense', 22000, 'Bills', '2026-10-01', 'Apartment rent'),
    t('5', 'expense', 4500, 'Bills', '2026-10-03', 'Electricity and internet'),
    t('6', 'expense', 2000, 'Bills', '2026-10-07', 'Phone and subscriptions'),
    t('7', 'expense', 6500, 'Food', '2026-10-04', 'Monthly groceries'),
    t('8', 'expense', 3250, 'Food', '2026-10-10', 'Meals and coffee'),
    t('9', 'expense', 2000, 'Food', '2026-10-14', 'Dinner with friends'),
    t('10', 'expense', 4500, 'Education', '2026-10-06', 'Online course'),
    t('11', 'expense', 1500, 'Education', '2026-10-11', 'Books and stationery'),
    t('12', 'expense', 3000, 'Travel', '2026-10-08', 'Metro pass'),
    t('13', 'expense', 1500, 'Travel', '2026-10-12', 'Auto and cab rides'),
    t('14', 'expense', 3500, 'Shopping', '2026-10-13', 'Clothing and essentials'),
  ],
};

function storage(): Storage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export function loadFinance(store: Storage | null = storage()): FinanceState {
  if (!store) return structuredClone(sampleState);
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = stateSchema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data;
      store.setItem(`${STORAGE_KEY}:invalid-backup`, raw);
    }
    store.setItem(STORAGE_KEY, JSON.stringify(sampleState));
  } catch { /* unreadable storage: fall back to sample data */ }
  return structuredClone(sampleState);
}

export function saveFinanceLocal(state: FinanceState, store: Storage | null = storage()): FinanceState {
  const valid = stateSchema.parse(state);
  if (!store) throw new Error('Your browser is blocking saved data. Please allow site storage and try again.');
  try { store.setItem(STORAGE_KEY, JSON.stringify(valid)); } catch { throw new Error('Could not save in this browser. Please try again.'); }
  return valid;
}

export function loadName(store: Storage | null = storage()): string {
  try { const n = store?.getItem(NAME_KEY)?.trim(); return n ? n.slice(0, 40) : DEFAULT_NAME; } catch { return DEFAULT_NAME; }
}

export function saveName(name: string, store: Storage | null = storage()): string {
  const clean = name.trim().slice(0, 40);
  if (!clean) throw new Error('Enter a display name.');
  if (!store) throw new Error('Your browser is blocking saved data.');
  store.setItem(NAME_KEY, clean);
  return clean;
}
