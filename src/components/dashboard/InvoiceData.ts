// ─── Invoice & Analytics Mock Data ───

export interface Invoice {
  id: string;
  date: string;
  service: string;
  doctor?: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled';
  items: { name: string; qty: number; price: number }[];
}

export const invoices: Invoice[] = [
  {
    id: 'AYR-2024-0041',
    date: '2024-03-28',
    service: 'AI Health Coach Session',
    amount: 1499,
    status: 'paid',
    items: [
      { name: 'AI Health Coach Consultation (60 min)', qty: 1, price: 1199 },
      { name: 'Personalized Ayurvedic Report', qty: 1, price: 300 },
    ],
  },
  {
    id: 'AYR-2024-0038',
    date: '2024-03-15',
    service: 'Herbal Products Order',
    amount: 2340,
    status: 'paid',
    items: [
      { name: 'Ashwagandha Root Extract (90 caps)', qty: 1, price: 780 },
      { name: 'Triphala Churna (200g)', qty: 2, price: 560 },
      { name: 'Tulsi Drops (30ml)', qty: 1, price: 440 },
    ],
  },
  {
    id: 'AYR-2024-0034',
    date: '2024-03-02',
    service: 'Doctor Consultation',
    doctor: 'Dr. Meera Krishnan',
    amount: 899,
    status: 'paid',
    items: [
      { name: 'Video Consultation (45 min)', qty: 1, price: 799 },
      { name: 'Prescription Documentation', qty: 1, price: 100 },
    ],
  },
  {
    id: 'AYR-2024-0031',
    date: '2024-02-18',
    service: 'Symptom Diagnosis Report',
    amount: 599,
    status: 'paid',
    items: [
      { name: 'AI Symptom Analysis', qty: 1, price: 499 },
      { name: 'Dosha Assessment', qty: 1, price: 100 },
    ],
  },
  {
    id: 'AYR-2024-0029',
    date: '2024-02-05',
    service: 'Platinum Wellness Plan',
    amount: 4999,
    status: 'pending',
    items: [
      { name: '3-Month Wellness Plan (Platinum)', qty: 1, price: 4499 },
      { name: 'Monthly Health Reports', qty: 3, price: 500 },
    ],
  },
  {
    id: 'AYR-2024-0025',
    date: '2024-01-22',
    service: 'Calorie & Diet Analysis',
    amount: 349,
    status: 'paid',
    items: [
      { name: 'AI Food Analysis Session', qty: 1, price: 249 },
      { name: 'Personalized Diet Plan', qty: 1, price: 100 },
    ],
  },
];

// ─── Monthly Spend Analytics ───
export const monthlySpend = [
  { month: 'Sep', amount: 1200, sessions: 2 },
  { month: 'Oct', amount: 2100, sessions: 3 },
  { month: 'Nov', amount: 1800, sessions: 4 },
  { month: 'Dec', amount: 3200, sessions: 5 },
  { month: 'Jan', amount: 349, sessions: 1 },
  { month: 'Feb', amount: 5598, sessions: 4 },
  { month: 'Mar', amount: 4738, sessions: 6 },
];

// ─── Service Category Breakdown ───
export const categoryBreakdown = [
  { name: 'Consultations', value: 1798, color: '#10B981', pct: 28 },
  { name: 'Herbal Products', value: 2340, color: '#F59E0B', pct: 37 },
  { name: 'AI Reports', value: 848, color: '#60A5FA', pct: 13 },
  { name: 'Wellness Plans', value: 4999, color: '#A78BFA', pct: 22 },
];

// ─── Weekly Session Activity ───
export const weeklyActivity = [
  { day: 'Mon', sessions: 1, duration: 45 },
  { day: 'Tue', sessions: 0, duration: 0 },
  { day: 'Wed', sessions: 2, duration: 90 },
  { day: 'Thu', sessions: 1, duration: 30 },
  { day: 'Fri', sessions: 3, duration: 120 },
  { day: 'Sat', sessions: 1, duration: 60 },
  { day: 'Sun', sessions: 0, duration: 0 },
];

// ─── Health Metrics Over 12 Weeks ───
export const healthMetrics = {
  wellness:   [62, 65, 68, 71, 69, 73, 75, 78, 76, 80, 83, 87],
  immunity:   [55, 58, 60, 63, 65, 67, 70, 72, 74, 76, 79, 84],
  energy:     [70, 72, 68, 74, 78, 75, 80, 82, 79, 85, 88, 92],
  sleep:      [60, 63, 65, 68, 70, 72, 74, 76, 75, 79, 81, 82],
  weeks: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],
};
