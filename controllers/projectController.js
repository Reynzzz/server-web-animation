import Project from '../models/Project.js';
import { slugify } from '../helpers/slugHelper.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await Project.findOne({ where: { slug } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      color,
      year,
      client,
      role,
      description,
      heroImage: heroImageUrl,
      gallery: galleryUrls,
      stats: statsRaw
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required.' });
    }

    // Generate slug from title
    let slug = slugify(title);
    // Ensure unique slug
    let slugExists = await Project.findOne({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(title)}-${counter}`;
      slugExists = await Project.findOne({ where: { slug } });
      counter++;
    }

    // Process Hero Image
    let heroImage = heroImageUrl || '';
    if (req.files && req.files.heroImageFile && req.files.heroImageFile[0]) {
      heroImage = `/uploads/${req.files.heroImageFile[0].filename}`;
    }

    // Process Gallery
    let gallery = [];
    if (galleryUrls) {
      try {
        gallery = typeof galleryUrls === 'string' ? JSON.parse(galleryUrls) : galleryUrls;
      } catch (e) {
        gallery = [galleryUrls];
      }
    }
    if (req.files && req.files.galleryFiles) {
      const uploadedPaths = req.files.galleryFiles.map(file => `/uploads/${file.filename}`);
      gallery = [...gallery, ...uploadedPaths];
    }

    // Process Stats
    let stats = [];
    if (statsRaw) {
      try {
        stats = typeof statsRaw === 'string' ? JSON.parse(statsRaw) : statsRaw;
      } catch (e) {
        stats = [];
      }
    }

    const project = await Project.create({
      slug,
      title,
      category,
      color,
      year,
      client,
      role,
      description,
      heroImage,
      gallery,
      stats
    });

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const {
      title,
      category,
      color,
      year,
      client,
      role,
      description,
      heroImage: heroImageUrl,
      gallery: galleryUrls,
      stats: statsRaw
    } = req.body;

    if (title) {
      const oldTitle = project.title;
      project.title = title;
      // If title changed, update slug
      if (title.toLowerCase() !== oldTitle.toLowerCase()) {
        let slug = slugify(title);
        let slugExists = await Project.findOne({ where: { slug } });
        let counter = 1;
        while (slugExists && slugExists.id !== project.id) {
          slug = `${slugify(title)}-${counter}`;
          slugExists = await Project.findOne({ where: { slug } });
          counter++;
        }
        project.slug = slug;
      }
    }

    if (category !== undefined) project.category = category;
    if (color !== undefined) project.color = color;
    if (year !== undefined) project.year = year;
    if (client !== undefined) project.client = client;
    if (role !== undefined) project.role = role;
    if (description !== undefined) project.description = description;

    // Hero Image
    if (req.files && req.files.heroImageFile && req.files.heroImageFile[0]) {
      project.heroImage = `/uploads/${req.files.heroImageFile[0].filename}`;
    } else if (heroImageUrl !== undefined) {
      project.heroImage = heroImageUrl;
    }

    // Gallery
    let newGallery = project.gallery || [];
    if (galleryUrls !== undefined) {
      try {
        newGallery = typeof galleryUrls === 'string' ? JSON.parse(galleryUrls) : galleryUrls;
      } catch (e) {
        newGallery = [galleryUrls];
      }
    }
    if (req.files && req.files.galleryFiles) {
      const uploadedPaths = req.files.galleryFiles.map(file => `/uploads/${file.filename}`);
      newGallery = [...newGallery, ...uploadedPaths];
    }
    project.gallery = newGallery;

    // Stats
    if (statsRaw !== undefined) {
      try {
        project.stats = typeof statsRaw === 'string' ? JSON.parse(statsRaw) : statsRaw;
      } catch (e) {
        // ignore
      }
    }

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    await project.destroy();
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
