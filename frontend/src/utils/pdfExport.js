import jsPDF from 'jspdf';

export const exportComplaintPDF = (complaint) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(2, 132, 199); // Sky blue
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CITIZEN COMPLAINT MANAGEMENT SYSTEM', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Resolution & Complaint Dossier', 15, 25);

  // Complaint ID & Date
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Complaint Reference: ${complaint.id}`, 15, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 145, 45);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 49, 195, 49);

  // Metadata Table
  let y = 58;

  const row = (label, val) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val || 'N/A', 65, y);
    y += 8;
  };

  row('Title:', complaint.title);
  row('Category / Dept:', complaint.category);
  row('Priority:', complaint.priority);
  row('Current Status:', complaint.status);
  row('Citizen Name:', complaint.citizenName);
  row('Contact Phone:', complaint.citizenPhone);
  row('Location:', complaint.location);
  row('Registered Date:', new Date(complaint.createdAt).toLocaleString());
  row('Assigned Officer:', complaint.assignedOfficerName || 'Pending Assignment');

  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 10;

  // Problem Description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Problem Description:', 15, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const splitDesc = doc.splitTextToSize(complaint.description, 180);
  doc.text(splitDesc, 15, y);
  y += splitDesc.length * 6 + 10;

  // Resolution Details if available
  if (complaint.status === 'Resolved' && complaint.resolutionNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('Resolution Remarks & Action Taken:', 15, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitRes = doc.splitTextToSize(complaint.resolutionNotes, 180);
    doc.text(splitRes, 15, y);
    y += splitRes.length * 6 + 10;
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('This is a computer-generated document issued by CCMS Public Services Authority.', 15, 280);

  doc.save(`${complaint.id}_Official_Report.pdf`);
};
