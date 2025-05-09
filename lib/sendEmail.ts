import nodemailer from 'nodemailer';

export async function sendLoginCodeEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // For example, using Gmail SMTP (set up your credentials in environment variables)
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email username
      pass: process.env.EMAIL_PASSWORD, // Your email password or an app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject: 'Your Login Code',
    text: `Your login code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login code sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendInvitationEmail(email: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invitation to join our platform',
    text: `Hey! We noticed you're interested in joining our platform. Please sign up by visiting our site.`,
  };

  await transporter.sendMail(mailOptions);
}