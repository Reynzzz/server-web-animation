import Project from '../models/Project.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSlug = async (title, currentId = null) => {
  let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!baseSlug) baseSlug = 'project';
  
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const whereClause = { slug };
    if (currentId) {
      whereClause.id = { [Op.ne]: currentId };
    }
    const existing = await Project.findOne({ where: whereClause });
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

const parseJsonField = (raw, fallback) => {
  if (raw === undefined || raw === null || raw === '') return fallback;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { slug: req.params.slug } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, category, color, year, client, role, description, galleryCaption, video, sortOrder } = req.body;
    let heroImage = req.body.heroImage || '';
    
    if (req.files && req.files.heroImageFile && req.files.heroImageFile.length > 0) {
      heroImage = `/uploads/${req.files.heroImageFile[0].filename}`;
    }

    let gallery = parseJsonField(req.body.gallery, []);
    
    if (req.files && req.files.galleryFiles && req.files.galleryFiles.length > 0) {
      for (const file of req.files.galleryFiles) {
        gallery.push(`/uploads/${file.filename}`);
      }
    }

    const stats = parseJsonField(req.body.stats, []);
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const slug = await generateSlug(title);

    const project = await Project.create({
      title,
      slug,
      category: category || '',
      color: color || '',
      year: year || '',
      client: client || '',
      role: role || '',
      description: description || '',
      galleryCaption: galleryCaption || '',
      video: video || '',
      heroImage,
      gallery,
      stats,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : 0,
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const { title, category, color, year, client, role, description, galleryCaption, video, sortOrder } = req.body;

    if (title && title !== project.title) {
      project.title = title;
      project.slug = await generateSlug(title, project.id);
    }

    if (category !== undefined) project.category = category;
    if (color !== undefined) project.color = color;
    if (year !== undefined) project.year = year;
    if (client !== undefined) project.client = client;
    if (role !== undefined) project.role = role;
    if (description !== undefined) project.description = description;
    if (galleryCaption !== undefined) project.galleryCaption = galleryCaption;
    if (video !== undefined) project.video = video;
    if (sortOrder !== undefined) project.sortOrder = parseInt(sortOrder, 10);

    if (req.files && req.files.heroImageFile && req.files.heroImageFile.length > 0) {
      project.heroImage = `/uploads/${req.files.heroImageFile[0].filename}`;
    } else if (req.body.heroImage !== undefined) {
      project.heroImage = req.body.heroImage;
    }

    if (req.body.gallery !== undefined) {
      project.gallery = parseJsonField(req.body.gallery, []);
    }
    
    if (req.files && req.files.galleryFiles && req.files.galleryFiles.length > 0) {
      const newGalleryFiles = req.files.galleryFiles.map(file => `/uploads/${file.filename}`);
      project.gallery = [...(project.gallery || []), ...newGalleryFiles];
    }

    if (req.body.stats !== undefined) {
      project.stats = parseJsonField(req.body.stats, []);
    }

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    await project.destroy();
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
