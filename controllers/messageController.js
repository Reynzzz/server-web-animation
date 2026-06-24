import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

export const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = await Message.create({ name, email, message });

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER || 'no-reply@ayuta.id'}>`, // sender address
        replyTo: email,
        to: 'mail@ayuta.id', // list of receivers
        subject: `New Contact Message from ${name}`, // Subject line
        text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`, // plain text body
        html: `<p>You have received a new message from your website contact form.</p><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`, // html body
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // We still return 201 because the message was successfully saved to DB.
    }

    return res.status(201).json({ message: 'Message sent successfully.', data: newMessage });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await message.destroy();
    return res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
