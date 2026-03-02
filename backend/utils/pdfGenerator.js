import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

// Configure email service (using Gmail or your email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Use App Password for Gmail
  }
});

// Generate PDF Receipt
export const generatePDFReceipt = (paymentDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header - Logo/Title
  doc.setFontSize(24);
  doc.setTextColor(39, 174, 96); // Green color
  doc.text('VIRTUAL LAB', margin, yPosition);
  yPosition += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Payment Receipt', margin, yPosition);
  yPosition += 15;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Security Badge Section
  doc.setFontSize(10);
  doc.setTextColor(27, 111, 66); // Dark green
  doc.text('🔒 SECURE TRANSACTION', margin, yPosition);
  yPosition += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This transaction is protected by industry-standard encryption (SSL/TLS)', margin, yPosition);
  yPosition += 15;

  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Order ID and Date
  doc.text('Order ID: ' + paymentDetails.orderId, margin, yPosition);
  yPosition += 8;
  doc.text('Date: ' + paymentDetails.purchaseDate, margin, yPosition);
  yPosition += 8;
  doc.text('Transaction ID: ' + paymentDetails.transactionId, margin, yPosition);
  yPosition += 15;

  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Student/User Info
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Student / User:', margin, yPosition);
  yPosition += 6;
  doc.text('Name: ' + paymentDetails.userName, margin + 5, yPosition);
  yPosition += 6;
  doc.text('Email: ' + paymentDetails.userEmail, margin + 5, yPosition);
  yPosition += 15;

  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Experiment Details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Experiment Details:', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(39, 174, 96);
  doc.text(paymentDetails.experimentTitle, margin + 3, yPosition);
  yPosition += 12;

  // Amount Table
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition - 3, contentWidth, 8, 'F');
  doc.text('Amount', margin + 5, yPosition + 2);
  doc.text('Duration', margin + 80, yPosition + 2);
  doc.text('Total', margin + 140, yPosition + 2);
  yPosition += 10;

  // Table row
  doc.text('₹' + paymentDetails.amount + ' ' + paymentDetails.currency, margin + 5, yPosition);
  doc.text(paymentDetails.duration + ' days', margin + 80, yPosition);
  doc.text('₹' + paymentDetails.amount, margin + 140, yPosition);
  yPosition += 15;

  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Access Info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Access Valid Until: ' + paymentDetails.expiryDate, margin, yPosition);
  yPosition += 8;
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text('Subscription Duration: ' + paymentDetails.duration + ' days from ' + paymentDetails.purchaseDate, margin, yPosition);
  yPosition += 15;

  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Security & Privacy Section
  doc.setFontSize(10);
  doc.setTextColor(27, 111, 66); // Dark green
  doc.text('Security & Privacy Information', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const securityDetails = [
    '✓ Encrypted Payment: All transactions are protected by SSL/TLS encryption',
    '✓ Data Protection: Personal information is securely stored',
    '✓ Verification: Use Order ID to verify this receipt online',
    '✓ Non-transferable: This subscription is for the registered user only',
    '✓ Support: Report unauthorized access at support@virtuallab.com'
  ];

  securityDetails.forEach((detail) => {
    doc.text(detail, margin + 3, yPosition);
    yPosition += 6;
  });

  yPosition += 5;
  // Divider
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('This is an automated secure receipt. For any queries, contact support@virtuallab.com', margin, pageHeight - 20);
  doc.text('Thank you for your purchase!', margin, pageHeight - 15);

  return doc.output('arraybuffer');
};

// Send Receipt Email
export const sendReceiptEmail = async (paymentDetails) => {
  try {
    const pdfBuffer = generatePDFReceipt(paymentDetails);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@virtuallab.com',
      to: paymentDetails.userEmail,
      subject: `Virtual Lab Payment Receipt - ${paymentDetails.experimentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">VIRTUAL LAB</h1>
            <p style="margin: 5px 0 0 0;">Payment Receipt</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px;">
            <p>Dear <strong>${paymentDetails.userName}</strong>,</p>
            
            <p>Thank you for your purchase! Your payment has been successfully processed.</p>
            
            <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #27ae60;">
              <h3 style="margin-top: 0; color: #27ae60;">Experiment Access Details</h3>
              <p><strong>Experiment:</strong> ${paymentDetails.experimentTitle}</p>
              <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount} ${paymentDetails.currency}</p>
              <p><strong>Duration:</strong> ${paymentDetails.duration} days</p>
              <p><strong>Valid Until:</strong> ${paymentDetails.expiryDate}</p>
              <p><strong>Order ID:</strong> ${paymentDetails.orderId}</p>
            </div>
            
            <p>Your receipt is attached to this email. You can also download it from your account dashboard.</p>
            
            <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-left: 4px solid #27ae60; border-radius: 3px;">
              <h4 style="margin-top: 0; color: #27ae60;">🔒 Security & Privacy</h4>
              <ul style="margin: 10px 0; padding-left: 20px; font-size: 13px; color: #555;">
                <li><strong>Encrypted Payment:</strong> Your transaction is protected by SSL/TLS encryption</li>
                <li><strong>Data Protection:</strong> Your personal data is securely stored and never shared</li>
                <li><strong>Transaction ID:</strong> ${paymentDetails.transactionId} (for dispute resolution)</li>
                <li><strong>Verification:</strong> This receipt can be verified with your order ID: ${paymentDetails.orderId}</li>
              </ul>
            </div>
            
            <p>To access your experiment, please log in to the Virtual Lab website:</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/sorting-lab" style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Experiment</a>
            </p>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <strong>Important Security Tips:</strong><br>
              • Never share your receipt or transaction details with anyone<br>
              • Always access Virtual Lab through the official website<br>
              • Report any unauthorized transactions immediately to support@virtuallab.com<br>
              • Your subscription is personal and non-transferable<br>
              If you have any questions or need assistance, please contact us at support@virtuallab.com<br>
              Thank you for using Virtual Lab!
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Virtual_Lab_Receipt_${paymentDetails.orderId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✓ Receipt email sent successfully to:', paymentDetails.userEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('✗ Error sending email:', error);
    return { success: false, error: error.message };
  }
};
