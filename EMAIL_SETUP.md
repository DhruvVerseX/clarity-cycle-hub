# Email Contact Form Setup Guide

This guide will help you set up the Nodemailer contact form functionality in your application.

## 📋 Prerequisites

1. Node.js and npm installed
2. A working email account (Gmail, Outlook, Yahoo, etc.)
3. App-specific password for your email account

## 🚀 Quick Setup

### 1. Install Dependencies

The required dependencies are already installed:
- `nodemailer` - For sending emails
- `@types/nodemailer` - TypeScript definitions
- `express-validator` - For input validation

### 2. Email Provider Setup

#### For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Use this password in your environment variables

#### For Other Providers:
- **Outlook/Hotmail**: Use `outlook` as the service
- **Yahoo**: Use `yahoo` as the service
- **Custom SMTP**: Configure host, port, and secure settings

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
HOST_EMAIL=your-host-email@gmail.com

# Other existing configurations...
MONGODB_URI=mongodb://localhost:27017/your-database
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

**Important Notes:**
- `EMAIL_USER`: The email address you'll send emails from
- `EMAIL_PASSWORD`: The app-specific password (NOT your regular password)
- `HOST_EMAIL`: The email address that will receive contact form submissions
- If `HOST_EMAIL` is not set, emails will be sent to `EMAIL_USER`

### 4. Security Best Practices

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Use app-specific passwords** instead of your main email password
3. **Enable 2FA** on your email account
4. **Rotate passwords regularly**

## 📁 File Structure

```
server/
├── routes/
│   └── contact.ts          # Contact form routes
├── env.example             # Environment variables template
└── index.ts               # Updated with contact routes

src/
├── components/
│   └── ContactForm.tsx     # React contact form component
└── pages/
    └── ContactPage.tsx     # Contact page example
```

## 🔧 API Endpoints

### POST `/api/contact/send`

Sends a contact form email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567", // optional
  "subject": "Website Inquiry",
  "message": "Hello, I have a question about..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Message sent successfully!",
  "warnings": ["Auto-reply email could not be sent"] // optional
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### GET `/api/contact/health`

Health check endpoint for the contact service.

## 🎨 Frontend Usage

### Using the ContactForm Component

```tsx
import ContactForm from "@/components/ContactForm";

function App() {
  return (
    <div className="container mx-auto py-8">
      <ContactForm />
    </div>
  );
}
```

### Custom Styling

The component uses Tailwind CSS and shadcn/ui components. You can customize the styling by:

1. Modifying the `className` prop
2. Editing the component's internal styles
3. Overriding CSS classes

## 📧 Email Templates

The system sends two types of emails:

### 1. Host Notification Email
- Sent to the website owner/host
- Contains all form details
- Includes sender's email for direct reply
- Professional HTML template

### 2. Auto-Reply Email
- Sent to the form submitter
- Confirmation of message receipt
- Expected response time
- Professional thank-you message

## 🛠 Customization

### Email Templates

Edit the email templates in `server/routes/contact.ts`:

```typescript
// Modify the hostEmailTemplate for host notifications
const hostEmailTemplate = `
  <!-- Your custom HTML template -->
`;

// Modify the autoReplyTemplate for auto-replies
const autoReplyTemplate = `
  <!-- Your custom HTML template -->
`;
```

### Validation Rules

Modify validation in `server/routes/contact.ts`:

```typescript
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Custom validation message'),
  // Add more validations...
];
```

### Form Fields

Add new fields by:

1. Updating the validation schema in both frontend and backend
2. Adding the field to the email templates
3. Updating the ContactForm component

## 🧪 Testing

### Test the API Endpoint

```bash
curl -X POST http://localhost:5000/api/contact/send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message."
  }'
```

### Test Email Configuration

```bash
curl http://localhost:5000/api/contact/health
```

## 🚨 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check if you're using an app password, not your regular password
   - Verify 2FA is enabled on your email account

2. **"Connection refused"**
   - Check your EMAIL_SERVICE setting
   - Verify your internet connection
   - Try different email providers

3. **"Invalid credentials"**
   - Double-check EMAIL_USER and EMAIL_PASSWORD
   - Ensure no extra spaces in environment variables

4. **Frontend not connecting**
   - Check if the backend server is running
   - Verify CORS configuration
   - Check browser network tab for errors

### Debug Mode

Add debug logging in `server/routes/contact.ts`:

```typescript
// Add after creating transporter
console.log('Email config:', {
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  // Don't log the password!
});
```

## 🔄 Production Deployment

### Environment Variables

Set these in your production environment:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=production@yourdomain.com
EMAIL_PASSWORD=your-production-app-password
HOST_EMAIL=contact@yourdomain.com
```

### Rate Limiting

Consider adding rate limiting for production:

```typescript
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many contact form submissions, please try again later."
});

router.post('/send', contactLimiter, validateContactForm, async (req, res) => {
  // ... existing code
});
```

## 📊 Monitoring

Consider adding:

1. **Logging**: Use Winston or similar for structured logging
2. **Metrics**: Track successful/failed email sends
3. **Alerts**: Monitor for email delivery failures
4. **Analytics**: Track contact form usage patterns

## 🤝 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your email provider settings
3. Test with a different email service
4. Review the troubleshooting section above

## 📄 License

This email contact form setup is part of your application and follows the same license terms.