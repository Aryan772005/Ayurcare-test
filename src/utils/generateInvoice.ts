import { jsPDF } from 'jspdf';

interface InvoiceData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialization: string;
  problem: string;
  preferredDate: string;
  amountPaid: number;
  bookingId: string;
  createdAt: string;
}

export function generateConsultationInvoice(data: InvoiceData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ─── Background ───────────────────────────────────────────────────
  doc.setFillColor(10, 31, 20);        // dark forest green
  doc.rect(0, 0, pageW, pageH, 'F');

  // ─── Header Band ──────────────────────────────────────────────────
  doc.setFillColor(15, 45, 30);
  doc.roundedRect(0, 0, pageW, 52, 0, 0, 'F');

  // thin emerald accent line below header
  doc.setFillColor(52, 211, 153);
  doc.rect(0, 52, pageW, 0.8, 'F');

  // ─── Brand / Logo area ────────────────────────────────────────────
  // Leaf "icon" drawn as a simple arc badge
  doc.setFillColor(52, 211, 153);
  doc.circle(20, 26, 10, 'F');
  doc.setFillColor(15, 45, 30);
  doc.circle(21.5, 24.5, 7, 'F');    // cut-out gives leaf silhouette

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(52, 211, 153);
  doc.text('Nexus Ayurve', 35, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 200, 160);
  doc.text('company  By Aryan', 35, 29);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 160, 130);
  doc.text('Ancient Wisdom · Modern Healing', 35, 35.5);

  // ─── INVOICE label (right side of header) ────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(52, 211, 153);
  doc.text('INVOICE', pageW - 14, 22, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 180, 150);
  doc.text(`Receipt No: ${data.bookingId}`, pageW - 14, 30, { align: 'right' });
  doc.text(`Date: ${formatDate(data.createdAt)}`, pageW - 14, 37, { align: 'right' });
  doc.text('Status: PAID & CONFIRMED', pageW - 14, 44, { align: 'right' });

  // ─── Section helper ───────────────────────────────────────────────
  let y = 66;

  const sectionTitle = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(52, 211, 153);
    doc.text(title.toUpperCase(), 14, y);
    doc.setFillColor(52, 211, 153, 0.3 as any);
    doc.setDrawColor(52, 211, 153);
    doc.setLineWidth(0.3);
    doc.line(14, y + 1.5, pageW - 14, y + 1.5);
    y += 8;
  };

  const row = (label: string, value: string, highlight = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(140, 190, 165);
    doc.text(label, 14, y);

    doc.setFont('helvetica', highlight ? 'bold' : 'normal');
    doc.setTextColor(highlight ? 52 : 220, highlight ? 211 : 240, highlight ? 153 : 225);
    doc.text(value, 80, y);
    y += 8;
  };

  // ─── Patient Details ──────────────────────────────────────────────
  sectionTitle('Patient Details');
  row('Full Name', data.patientName);
  row('Email', data.patientEmail || 'N/A');
  y += 2;

  // ─── Consultation Details ─────────────────────────────────────────
  sectionTitle('Consultation Details');
  row('Doctor', data.doctorName);
  row('Specialization', data.specialization);
  row('Health Concern', data.problem);
  row('Preferred Date', formatDate(data.preferredDate));
  y += 2;

  // ─── Payment Summary box ──────────────────────────────────────────
  sectionTitle('Payment Summary');

  const boxY = y - 2;
  doc.setFillColor(5, 46, 22);
  doc.roundedRect(14, boxY, pageW - 28, 44, 4, 4, 'F');
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, boxY, pageW - 28, 44, 4, 4, 'S');

  y = boxY + 10;
  row('Consultation Fee', '₹1.00');
  row('Platform Fee', '₹0.00');
  row('GST', '₹0.00');

  // Total line
  doc.setFillColor(52, 211, 153);
  doc.rect(14, y + 1, pageW - 28, 0.4, 'F');
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text('Total Paid', 20, y);
  doc.text('₹1.00', pageW - 20, y, { align: 'right' });
  y += 16;

  // ─── Note ────────────────────────────────────────────────────────
  doc.setFillColor(15, 45, 30);
  doc.roundedRect(14, y, pageW - 28, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153);
  doc.text('📋  Important Note', 20, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 210, 185);
  doc.text(
    'The doctor will contact you on your preferred date. Keep this invoice for your records.',
    20, y + 14,
    { maxWidth: pageW - 40 }
  );
  y += 28;

  // ─── Footer ──────────────────────────────────────────────────────
  doc.setFillColor(52, 211, 153);
  doc.rect(0, pageH - 22, pageW, 0.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153);
  doc.text('Nexus Ayurve company By Aryan', pageW / 2, pageH - 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 160, 130);
  doc.text(
    'Nexus Ayurve.app · support: aryansinghtariani@gmail.com · This is a computer-generated invoice',
    pageW / 2, pageH - 7, { align: 'center' }
  );

  // ─── Download ─────────────────────────────────────────────────────
  const fileName = `Nexus Ayurve_Invoice_${data.bookingId}.pdf`;
  doc.save(fileName);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
