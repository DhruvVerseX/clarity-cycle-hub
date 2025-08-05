/**
 * Email Utilities
 * Handles sending authentication-related emails
 */

import nodemailer from "nodemailer";
import { authConfig } from "../config/auth.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 */
const createTransporter = () => {
  if (!authConfig.email.enabled) {
    throw new Error("Email service is not configured");
  }
  
  return nodemailer.createTransporter({
    host: authConfig.email.host,
    port: authConfig.email.port,
    secure: authConfig.email.port === 465,
    auth: {
      user: authConfig.email.user,
      pass: authConfig.email.pass,
    },
  });
};

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!authConfig.email.enabled) {
      console.warn("Email service is not configured, skipping email send");
      return false;
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: authConfig.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  resetUrl: string
): Promise<boolean> => {
  const subject = "Password Reset Request - Clarity Cycle Hub";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You have requested to reset your password for your Clarity Cycle Hub account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}?token=${resetToken}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}?token=${resetToken}</p>
      <p><strong>This link will expire in 1 hour.</strong></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Best regards,<br>The Clarity Cycle Hub Team</p>
    </div>
  `;
  
  return await sendEmail({ to: email, subject, html });
};

/**
 * Send email verification email
 */
export const sendEmailVerificationEmail = async (
  email: string,
  verificationToken: string,
  verificationUrl: string
): Promise<boolean> => {
  const subject = "Verify Your Email - Clarity Cycle Hub";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for signing up for Clarity Cycle Hub! Please verify your email address to complete your registration.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}?token=${verificationToken}" 
           style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}?token=${verificationToken}</p>
      <p><strong>This link will expire in 24 hours.</strong></p>
      <p>Best regards,<br>The Clarity Cycle Hub Team</p>
    </div>
  `;
  
  return await sendEmail({ to: email, subject, html });
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (
  email: string,
  username: string
): Promise<boolean> => {
  const subject = "Welcome to Clarity Cycle Hub!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Clarity Cycle Hub!</h2>
      <p>Hello ${username},</p>
      <p>Welcome to Clarity Cycle Hub! We're excited to have you on board.</p>
      <p>With Clarity Cycle Hub, you can:</p>
      <ul>
        <li>Manage your tasks efficiently</li>
        <li>Use the Pomodoro technique to boost productivity</li>
        <li>Track your progress and build better habits</li>
        <li>Stay organized and focused</li>
      </ul>
      <p>Get started by creating your first task and setting up a Pomodoro session!</p>
      <p>If you have any questions or need help, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The Clarity Cycle Hub Team</p>
    </div>
  `;
  
  return await sendEmail({ to: email, subject, html });
};

/**
 * Send account security alert
 */
export const sendSecurityAlertEmail = async (
  email: string,
  username: string,
  alertType: 'login' | 'password_change' | 'suspicious_activity'
): Promise<boolean> => {
  const alertMessages = {
    login: "A new login was detected on your account.",
    password_change: "Your password was recently changed.",
    suspicious_activity: "Suspicious activity was detected on your account."
  };
  
  const subject = `Security Alert - Clarity Cycle Hub`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">Security Alert</h2>
      <p>Hello ${username},</p>
      <p>${alertMessages[alertType]}</p>
      <p><strong>If this was you, no action is required.</strong></p>
      <p>If this wasn't you, please:</p>
      <ol>
        <li>Change your password immediately</li>
        <li>Enable two-factor authentication if available</li>
        <li>Contact our support team</li>
      </ol>
      <p>Best regards,<br>The Clarity Cycle Hub Security Team</p>
    </div>
  `;
  
  return await sendEmail({ to: email, subject, html });
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    if (!authConfig.email.enabled) {
      console.log("Email service is not configured");
      return false;
    }
    
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return false;
  }
}; 