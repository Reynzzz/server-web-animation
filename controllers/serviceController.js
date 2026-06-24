import Service from '../models/Service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, image: imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    let image = imageUrl || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const service = await Service.create({
      title,
      description,
      image,
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const { title, description, image: imageUrl } = req.body;

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      service.image = imageUrl;
    }

    await service.save();
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    await service.destroy();
    return res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
