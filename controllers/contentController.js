import SiteSetting from '../models/SiteSetting.js';
import ContentItem from '../models/ContentItem.js';

function groupItemsBySection(items) {
  return items.reduce((acc, item) => {
    const plain = item.get ? item.get({ plain: true }) : item;
    if (!acc[plain.section]) acc[plain.section] = [];
    acc[plain.section].push(plain);
    return acc;
  }, {});
}

function parseJsonField(raw, fallback) {
  if (raw === undefined || raw === null || raw === '') return fallback;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const getAllContent = async (req, res) => {
  try {
    const settings = await SiteSetting.findAll({ order: [['key', 'ASC']] });
    const items = await ContentItem.findAll({
      order: [
        ['section', 'ASC'],
        ['sortOrder', 'ASC'],
      ],
    });

    const settingsMap = settings.reduce((acc, row) => {
      const plain = row.get({ plain: true });
      acc[plain.key] = plain.value;
      return acc;
    }, {});

    return res.status(200).json({
      settings: settingsMap,
      items: groupItemsBySection(items),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getSettingByKey = async (req, res) => {
  const { key } = req.params;
  try {
    const setting = await SiteSetting.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found.' });
    }
    return res.status(200).json({ key: setting.key, value: setting.value });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateSetting = async (req, res) => {
  const { key } = req.params;
  try {
    let value = {};

    if (req.body.valueJson) {
      value = parseJsonField(req.body.valueJson, {});
    } else {
      value = parseJsonField(req.body.value, {});
    }

    if (req.file) {
      value.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined && req.body.image !== '') {
      value.image = req.body.image;
    }

    const [setting, created] = await SiteSetting.findOrCreate({
      where: { key },
      defaults: { key, value },
    });

    if (!created) {
      const merged = { ...setting.value, ...value };
      if (req.body.valueJson) {
        setting.value = merged;
      } else {
        setting.value = merged;
      }
      await setting.save();
    }

    return res.status(200).json({ key: setting.key, value: setting.value });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getContentItems = async (req, res) => {
  const { section } = req.query;
  try {
    const where = section ? { section } : {};
    const items = await ContentItem.findAll({
      where,
      order: [
        ['section', 'ASC'],
        ['sortOrder', 'ASC'],
      ],
    });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createContentItem = async (req, res) => {
  try {
    const { section, sortOrder, title, subtitle, body, image, metadata } = req.body;

    if (!section) {
      return res.status(400).json({ message: 'Section is required.' });
    }

    let imagePath = image || '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const item = await ContentItem.create({
      section,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      title: title || '',
      subtitle: subtitle || '',
      body: body || '',
      image: imagePath,
      metadata: parseJsonField(metadata, {}),
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateContentItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ContentItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Content item not found.' });
    }

    const { section, sortOrder, title, subtitle, body, image, metadata } = req.body;

    if (section !== undefined) item.section = section;
    if (sortOrder !== undefined) item.sortOrder = Number(sortOrder);
    if (title !== undefined) item.title = title;
    if (subtitle !== undefined) item.subtitle = subtitle;
    if (body !== undefined) item.body = body;
    if (metadata !== undefined) {
      item.metadata = parseJsonField(metadata, item.metadata || {});
    }

    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      item.image = image;
    }

    await item.save();
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const deleteContentItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ContentItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Content item not found.' });
    }
    await item.destroy();
    return res.status(200).json({ message: 'Content item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
