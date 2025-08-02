import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail', // gmail, outlook, yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER, // sender email
      pass: process.env.EMAIL_PASSWORD, // app password
    },
  });
};

// Validation middleware for contact form
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

// Contact form submission route
router.post('/send', validateContactForm, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message, phone } = req.body;

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP configuration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Email service configuration error'
      });
    }

    // Email template for the host
    const hostEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This email was sent from your website contact form on ${new Date().toLocaleString()}.</p>
        </div>
      </div>
    `;

    // Auto-reply email template for the sender
    const autoReplyTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Thank You for Contacting Us!</h2>
        
        <p style="color: #555; line-height: 1.6;">Dear ${name},</p>
        
        <p style="color: #555; line-height: 1.6;">
          Thank you for reaching out to us. We have received your message and will get back to you as soon as possible, 
          typically within 24-48 hours.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Your Message Summary:</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
        </div>
        
        <p style="color: #555; line-height: 1.6;">
          If you have any urgent inquiries, please don't hesitate to contact us directly.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>Your Website Team</strong>
          </p>
        </div>
        
        <div style="margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    // Email options for the host
    const hostMailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.HOST_EMAIL || process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: hostEmailTemplate,
      replyTo: email,
    };

    // Email options for auto-reply
    const autoReplyOptions = {
      from: `"Your Website" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting us - ${subject}`,
      html: autoReplyTemplate,
    };

    // Send emails
    const [hostEmailResult, autoReplyResult] = await Promise.allSettled([
      transporter.sendMail(hostMailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    // Check results
    let warnings = [];
    
    if (hostEmailResult.status === 'rejected') {
      console.error('Failed to send email to host:', hostEmailResult.reason);
      return res.status(500).json({
        success: false,
        message: 'Failed to send message to host'
      });
    }

    if (autoReplyResult.status === 'rejected') {
      console.error('Failed to send auto-reply:', autoReplyResult.reason);
      warnings.push('Auto-reply email could not be sent');
    }

    console.log('Contact form email sent successfully:', {
      messageId: hostEmailResult.value.messageId,
      from: email,
      subject: subject
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      warnings: warnings.length > 0 ? warnings : undefined
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Health check route
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Contact service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;