import Message from '../models/Message.js';

export const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = await Message.create({ name, email, message });
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
