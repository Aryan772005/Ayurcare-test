import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, onSnapshot, limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AppointmentDoc {
  id: string;
  userId: string;
  name?: string;
  doctorId: string;
  doctorName: string;
  specialization?: string;
  problem: string;
  preferredDate: string;
  amountPaid: number;
  status: string;
  createdAt: string;
  // Invoice-compatible fields
  service: string;
  items: { name: string; qty: number; price: number }[];
}

export interface OrderDoc {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  total: number;
  items: { name: string; qty: number; price: number; brand?: string }[];
}

export interface HeartLogDoc {
  id: string;
  userId: string;
  heartRate: number;
  conditionStatus?: string;
  measuredAt: string;
}

export interface UserStats {
  // Derived analytics
  totalSpend: number;
  totalAppointments: number;
  totalOrders: number;
  latestHeartRate: number | null;
  avgHeartRate: number | null;
  streak: number;          // Days since first appointment
  wellnessScore: number;   // Computed from activity
  // Monthly breakdowns
  monthlySpend: { month: string; amount: number; sessions: number }[];
  // Category breakdown
  categoryBreakdown: { name: string; value: number; color: string; pct: number }[];
  // 12-week heart rate trend (weekly averages)
  weeklyHeartRates: number[];
  weekLabels: string[];
}

// ─── Unified Invoice type (merges appointments + orders) ──────────────────────

export interface DashInvoice {
  id: string;
  date: string;
  service: string;
  doctor?: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled';
  type: 'consultation' | 'order';
  items: { name: string; qty: number; price: number }[];
}

// ─── Helper: compute stats from raw Firestore docs ───────────────────────────

function computeStats(
  appointments: AppointmentDoc[],
  orders: OrderDoc[],
  heartLogs: HeartLogDoc[],
): UserStats {
  const totalAppointments = appointments.length;
  const totalOrders = orders.length;

  // Total spend
  const apptSpend = appointments.reduce((s, a) => s + (a.amountPaid || 0), 0);
  const orderSpend = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalSpend = apptSpend + orderSpend;

  // Heart rate
  const sortedLogs = [...heartLogs].sort(
    (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
  );
  const latestHeartRate = sortedLogs.length > 0 ? sortedLogs[0].heartRate : null;
  const avgHeartRate =
    heartLogs.length > 0
      ? Math.round(heartLogs.reduce((s, l) => s + l.heartRate, 0) / heartLogs.length)
      : null;

  // Streak: consecutive days with any activity (simplified: days since first activity)
  const allDates = [
    ...appointments.map(a => a.createdAt),
    ...orders.map(o => o.createdAt),
  ].map(d => new Date(d).toDateString());
  const uniqueDays = new Set(allDates).size;
  const streak = uniqueDays;

  // Wellness score: 50 base + 5 per session (cap 99) + heart rate bonus
  const activityBonus = Math.min((totalAppointments + totalOrders) * 5, 35);
  const hrBonus =
    avgHeartRate && avgHeartRate >= 60 && avgHeartRate <= 100
      ? 12
      : avgHeartRate
      ? 4
      : 0;
  const wellnessScore = Math.min(50 + activityBonus + hrBonus, 99);

  // Monthly spend — last 7 months
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const monthlySpend: UserStats['monthlySpend'] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const apptAmt = appointments
      .filter(a => {
        const ad = new Date(a.createdAt);
        return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
      })
      .reduce((s, a) => s + (a.amountPaid || 0), 0);
    const orderAmt = orders
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      })
      .reduce((s, o) => s + (o.total || 0), 0);
    const sessions = appointments.filter(a => {
      const ad = new Date(a.createdAt);
      return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
    }).length;
    monthlySpend.push({ month: MONTHS[d.getMonth()], amount: apptAmt + orderAmt, sessions });
  }

  // Category breakdown
  const consultTotal = apptSpend;
  const productTotal = orderSpend;
  const total = consultTotal + productTotal || 1;
  const categoryBreakdown: UserStats['categoryBreakdown'] = [
    { name: 'Consultations', value: consultTotal, color: '#10B981', pct: Math.round((consultTotal / total) * 100) },
    { name: 'Herbal Products', value: productTotal, color: '#F59E0B', pct: Math.round((productTotal / total) * 100) },
  ].filter(c => c.value > 0);
  if (categoryBreakdown.length === 0) {
    categoryBreakdown.push({ name: 'No spending yet', value: 0, color: '#6B7280', pct: 100 });
  }

  // Weekly heart rate trend (last 12 weeks)
  const weekLabels: string[] = [];
  const weeklyHeartRates: number[] = [];
  for (let w = 11; w >= 0; w--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekLogs = heartLogs.filter(l => {
      const d = new Date(l.measuredAt);
      return d >= weekStart && d <= weekEnd;
    });
    const avg =
      weekLogs.length > 0
        ? Math.round(weekLogs.reduce((s, l) => s + l.heartRate, 0) / weekLogs.length)
        : 0;
    weeklyHeartRates.push(avg);
    weekLabels.push(`W${12 - w}`);
  }

  return {
    totalSpend, totalAppointments, totalOrders,
    latestHeartRate, avgHeartRate, streak, wellnessScore,
    monthlySpend, categoryBreakdown, weeklyHeartRates, weekLabels,
  };
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

export function useUserDashboard(userId: string | undefined) {
  const [appointments, setAppointments] = useState<AppointmentDoc[]>([]);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [heartLogs, setHeartLogs] = useState<HeartLogDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAppointments([]);
      setOrders([]);
      setHeartLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let apptDone = false, ordersDone = false, heartDone = false;
    const checkDone = () => {
      if (apptDone && ordersDone && heartDone) setLoading(false);
    };

    // Appointments listener
    const apptQ = query(
      collection(db, 'appointments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const unsubAppt = onSnapshot(apptQ, snap => {
      setAppointments(
        snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            name: data.name,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            specialization: data.specialization,
            problem: data.problem,
            preferredDate: data.preferredDate,
            amountPaid: data.amountPaid || 1,
            status: data.status || 'Paid & Confirmed',
            createdAt: data.createdAt,
            service: data.service || 'Doctor Consultation',
            items: data.items || [
              { name: `Consultation with ${data.doctorName}`, qty: 1, price: data.amountPaid || 1 },
            ],
          } as AppointmentDoc;
        }),
      );
      apptDone = true;
      checkDone();
    }, () => { apptDone = true; checkDone(); });

    // Orders listener
    const ordersQ = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    const unsubOrders = onSnapshot(ordersQ, snap => {
      setOrders(
        snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            createdAt: data.createdAt,
            status: data.status || 'ordered',
            total: data.total || 0,
            items: data.items || [],
          } as OrderDoc;
        }),
      );
      ordersDone = true;
      checkDone();
    }, () => { ordersDone = true; checkDone(); });

    // Heart logs listener (last 90 entries)
    const heartQ = query(
      collection(db, 'heart_logs'),
      where('userId', '==', userId),
      orderBy('measuredAt', 'desc'),
      limit(90),
    );
    const unsubHeart = onSnapshot(heartQ, snap => {
      setHeartLogs(
        snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId,
            heartRate: data.heartRate || data.heart_rate || 0,
            conditionStatus: data.conditionStatus || data.condition_status,
            measuredAt: data.measuredAt || data.measured_at || new Date().toISOString(),
          } as HeartLogDoc;
        }),
      );
      heartDone = true;
      checkDone();
    }, () => { heartDone = true; checkDone(); });

    return () => {
      unsubAppt();
      unsubOrders();
      unsubHeart();
    };
  }, [userId]);

  // Derived invoices list (merged, sorted by date desc)
  const invoices: DashInvoice[] = [
    ...appointments.map(a => ({
      id: a.id,
      date: a.createdAt,
      service: a.service || 'Doctor Consultation',
      doctor: a.doctorName,
      amount: a.amountPaid,
      status: (a.status.toLowerCase().includes('paid') ? 'paid' : 'pending') as 'paid' | 'pending',
      type: 'consultation' as const,
      items: a.items,
    })),
    ...orders.map(o => ({
      id: o.id,
      date: o.createdAt,
      service: 'Herbal Products Order',
      amount: o.total,
      status: (o.status === 'ordered' ? 'paid' : 'pending') as 'paid' | 'pending',
      type: 'order' as const,
      items: o.items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const stats = computeStats(appointments, orders, heartLogs);

  return { appointments, orders, heartLogs, invoices, stats, loading };
}
