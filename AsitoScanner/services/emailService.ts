import { Resend } from 'resend';
import { Report } from './storageService';
import { RESEND_API_KEY } from '@/constants/Config';

// Initialize Resend with API key
const resend = new Resend(RESEND_API_KEY);

/**
 * Format report data into HTML for email
 */
const formatReportHtml = (report: Report): string => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate HTML for each question
  const questionsHtml = report.questions
    .filter(q => q.completed)
    .map(question => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">${question.displayText || question.text}</h3>
        <div style="background-color: #f5f5f5; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <p style="font-style: italic; color: #666;">${question.analyticalQuestion || question.text}</p>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
          <p>${question.answer || "No analysis available for this question."}</p>
        </div>
      </div>
    `)
    .join('');

  // Return complete HTML email
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Asito Scanner Report: ${report.scope}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { margin-bottom: 20px; }
        .info-row { margin-bottom: 10px; }
        .divider { height: 2px; background-color: #FF5A00; margin: 20px 0; }
        h1 { color: #023866; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Asito Scanner Report: ${report.scope}</h1>
        
        <div class="info-row">
          <span class="label">User:</span> ${report.userName}
        </div>
        
        <div class="info-row">
          <span class="label">Date:</span> ${formatDate(report.date)}
        </div>
        
        <div class="info-row">
          <span class="label">Status:</span> ${report.status}
        </div>
        
        <div class="info-row">
          <span class="label">Description:</span> ${report.description}
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="questions">
        ${questionsHtml}
      </div>
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This report was generated by Asito Scanner. For more information, please contact support.
      </p>
    </body>
    </html>
  `;
};

/**
 * Send report via email
 */
export const sendReportByEmail = async (
  report: Report,
  recipientEmail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the recipient is a verified test email
    // You'll need to add your test emails in the Resend dashboard
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default sender in test mode
      to: [recipientEmail],
      subject: `Asito Scanner Report: ${report.scope}`,
      html: formatReportHtml(report),
    });

    if (response.error) {
      console.error('Error sending email:', response.error);
      return {
        success: false,
        message: `Failed to send email: ${response.error.message}`,
      };
    }

    return {
      success: true,
      message: 'Report sent successfully!',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while sending the email.',
    };
  }
}; 