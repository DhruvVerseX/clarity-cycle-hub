import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  const requiredEnvVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file and try again.');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   - Service: ${process.env.EMAIL_SERVICE}`);
  console.log(`   - User: ${process.env.EMAIL_USER}`);
  console.log(`   - Host Email: ${process.env.HOST_EMAIL || process.env.EMAIL_USER}`);

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    // Test connection
    console.log('\n🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    // Send test email
    console.log('\n📧 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.HOST_EMAIL || process.env.EMAIL_USER,
      subject: 'Test Email - Contact Form Setup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">✅ Email Configuration Test Successful!</h2>
          <p>If you're receiving this email, your Nodemailer configuration is working correctly.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>Service:</strong> ${process.env.EMAIL_SERVICE}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Test Date:</strong> ${new Date().toISOString()}</p>
          </div>
          <p>You can now use the contact form functionality in your application.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   - Message ID: ${result.messageId}`);
    console.log(`   - Response: ${result.response}`);

    console.log('\n🎉 Email configuration test completed successfully!');
    console.log('Your contact form is ready to use.');

  } catch (error) {
    console.error('\n❌ Email configuration test failed:');
    console.error(`   Error: ${error.message}`);
    
    // Provide specific troubleshooting tips
    if (error.message.includes('authentication')) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   - Make sure you\'re using an app password, not your regular password');
      console.error('   - Enable 2-Factor Authentication on your email account');
      console.error('   - Generate a new app password if needed');
    } else if (error.message.includes('connection')) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the EMAIL_SERVICE setting');
      console.error('   - Try using a different email provider');
    }
    
    process.exit(1);
  }
}

// Run the test
testEmailConfiguration().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});