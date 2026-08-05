import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../config/database.js';

export interface InvoiceCalculation {
  subtotal: number;
  tax_amount: number;
  total: number;
}

export const calculateInvoiceTotals = (
  items: { quantity: number; unit_price: number; total: number }[],
  tax_rate: number
): InvoiceCalculation => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax_amount = (subtotal * tax_rate) / 100;
  const total = subtotal + tax_amount;

  return { subtotal, tax_amount, total };
};

export const validateInvoiceItem = (item: any): void => {
  const calculatedTotal = item.quantity * item.unit_price;
  if (Math.abs(calculatedTotal - item.total) > 0.01) {
    throw new Error(`Item total mismatch: expected ${calculatedTotal}, got ${item.total}`);
  }
};

export const generateInvoicePDF = async (invoice: any, client: any, items: any[], businessInfo: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = 800;
  const margin = 50;
  const pageWidth = 595.28;

  // Invoice header
  page.drawText('INVOICE', {
    x: margin,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });

  // Invoice details
  yPosition -= 40;
  page.drawText(`Invoice Number: ${invoice.invoice_number}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font
  });

  yPosition -= 20;
  page.drawText(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font
  });

  yPosition -= 20;
  page.drawText(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font
  });

  yPosition -= 20;
  const statusColor = invoice.status === 'paid' ? rgb(0.2, 0.7, 0.2) :
                     invoice.status === 'overdue' ? rgb(0.8, 0.2, 0.2) :
                     rgb(0.5, 0.5, 0.5);

  page.drawText(`Status: ${invoice.status.toUpperCase()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: statusColor
  });

  // Business information
  yPosition -= 40;
  page.drawText('From:', {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont
  });

  yPosition -= 25;
  page.drawText(businessInfo.business_name || businessInfo.name || 'Business Name', {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  yPosition -= 20;
  if (businessInfo.email) {
    page.drawText(businessInfo.email, {
      x: margin,
      y: yPosition,
      size: 11,
      font
    });
  }

  yPosition -= 20;
  if (businessInfo.phone) {
    page.drawText(businessInfo.phone, {
      x: margin,
      y: yPosition,
      size: 11,
      font
    });
  }

  yPosition -= 20;
  if (businessInfo.address) {
    page.drawText(businessInfo.address, {
      x: margin,
      y: yPosition,
      size: 11,
      font
    });
  }

  // Client information
  yPosition -= 40;
  page.drawText('Bill To:', {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont
  });

  yPosition -= 25;
  page.drawText(client.name, {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  yPosition -= 20;
  page.drawText(client.email, {
    x: margin,
    y: yPosition,
    size: 12,
    font
  });

  if (client.address) {
    yPosition -= 20;
    page.drawText(client.address, {
      x: margin,
      y: yPosition,
      size: 12,
      font
    });
  }

  // Items table
  yPosition -= 40;
  const tableTop = yPosition;

  // Table headers
  page.drawText('Description', {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  page.drawText('Quantity', {
    x: margin + 250,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  page.drawText('Unit Price', {
    x: margin + 350,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  page.drawText('Total', {
    x: margin + 480,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  yPosition -= 25;
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  });

  // Items
  yPosition -= 10;
  for (const item of items) {
    const truncatedDescription = item.description.length > 30
      ? item.description.substring(0, 27) + '...'
      : item.description;

    page.drawText(truncatedDescription, {
      x: margin,
      y: yPosition,
      size: 11,
      font
    });

    page.drawText(item.quantity.toString(), {
      x: margin + 250,
      y: yPosition,
      size: 11,
      font
    });

    page.drawText(`GHS ${item.unit_price.toFixed(2)}`, {
      x: margin + 350,
      y: yPosition,
      size: 11,
      font
    });

    page.drawText(`GHS ${item.total.toFixed(2)}`, {
      x: margin + 480,
      y: yPosition,
      size: 11,
      font
    });

    yPosition -= 20;

    if (yPosition < 150) {
      // Add new page if running out of space
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      yPosition = 800;
    }
  }

  yPosition -= 20;
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5)
  });

  // Totals
  yPosition -= 30;
  const totalsX = margin + 350;

  page.drawText('Subtotal:', {
    x: totalsX,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  page.drawText(`GHS ${invoice.subtotal.toFixed(2)}`, {
    x: totalsX + 100,
    y: yPosition,
    size: 12,
    font
  });

  yPosition -= 25;
  page.drawText(`Tax (${invoice.tax_rate}%):`, {
    x: totalsX,
    y: yPosition,
    size: 12,
    font: boldFont
  });

  page.drawText(`GHS ${invoice.tax_amount.toFixed(2)}`, {
    x: totalsX + 100,
    y: yPosition,
    size: 12,
    font
  });

  yPosition -= 25;
  page.drawText('Total:', {
    x: totalsX,
    y: yPosition,
    size: 14,
    font: boldFont
  });

  page.drawText(`GHS ${invoice.total.toFixed(2)}`, {
    x: totalsX + 100,
    y: yPosition,
    size: 14,
    font: boldFont
  });

  // Generate QR code with public link
  yPosition -= 50;
  const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invoice/${invoice.public_token}`;
  const qrCodeDataUrl = await QRCode.toDataURL(publicUrl);

  const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
  const qrSize = 80;
  page.drawImage(qrImage, {
    x: pageWidth - margin - qrSize,
    y: yPosition - qrSize,
    width: qrSize,
    height: qrSize
  });

  // Notes
  if (invoice.notes) {
    yPosition -= 120;
    page.drawText('Notes:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont
    });

    yPosition -= 20;
    const words = invoice.notes.split(' ');
    let line = '';
    const lineHeight = 18;

    for (const word of words) {
      const testLine = line + word + ' ';
      if (testLine.length > 70) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 11,
          font
        });
        line = word + ' ';
        yPosition -= lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 11,
        font
      });
    }
  }

  // Footer
  yPosition = 50;
  const footerText = `Generated by InvoicePay | View online: ${publicUrl}`;
  page.drawText(footerText, {
    x: margin,
    y: yPosition,
    size: 9,
    font,
    color: rgb(0.6, 0.6, 0.6)
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

export const checkOverdueInvoices = async () => {
  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      status: 'sent',
      due_date: { lt: new Date() }
    }
  });

  for (const invoice of overdueInvoices) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'overdue' }
    });
  }

  return overdueInvoices.length;
};

export const generateInvoiceNumber = async (userId: string): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      user_id: userId,
      invoice_number: {
        startsWith: prefix
      }
    },
    orderBy: {
      invoice_number: 'desc'
    }
  });

  let sequenceNumber = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoice_number.split('-').pop() || '0');
    sequenceNumber = lastSequence + 1;
  }

  return `${prefix}${sequenceNumber.toString().padStart(4, '0')}`;
};