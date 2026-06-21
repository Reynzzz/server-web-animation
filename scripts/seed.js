import User from '../models/User.js';
import Project from '../models/Project.js';
import SiteSetting from '../models/SiteSetting.js';
import ContentItem from '../models/ContentItem.js';
import { SITE_SETTINGS_SEED, CONTENT_ITEMS_SEED } from '../data/contentSeed.js';

const PROJECTS = [
  {
    slug: 'void-identity',
    title: 'Void Identity',
    category: 'Brand Strategy',
    color: '#775BA4',
    year: '2025',
    client: 'Cipher Collective',
    role: 'Art Direction / Identity',
    description: 'A complete visual overhaul for a digital-first fashion label, focusing on the intersection of physical void and digital presence.',
    heroImage: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0',
    gallery: [
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2544&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2535&auto=format&fit=crop',
    ],
    stats: [
      { label: 'Brand Reach', value: '2.5M' },
      { label: 'Growth', value: '45%' },
    ]
  },
  {
    slug: 'neon-catalyst',
    title: 'Neon Catalyst',
    category: 'Creative Tech',
    color: '#DE15CC',
    year: '2024',
    client: 'HyperFuture',
    role: 'UX / Creative Code',
    description: 'An interactive installation that translates bio-signals into generative neon landscapes, blurring the line between biology and mathematics.',
    heroImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550684847-75bdda21cc95?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop',
    ],
    stats: [
      { label: 'Interactions', value: '120K' },
      { label: 'Latency', value: '12ms' },
    ]
  },
  {
    slug: 'solaris-experience',
    title: 'Solaris Experience',
    category: 'Immersive Web',
    color: '#F15FA5',
    year: '2026',
    client: 'Zenith Labs',
    role: 'WebGL / Design',
    description: 'A browser-based odyssey through a dying star system, pushing the boundaries of what is possible with realtime rendering on the web.',
    heroImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2671&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2672&auto=format&fit=crop',
    ],
    stats: [
      { label: 'FPS', value: '120' },
      { label: 'Particles', value: '1M+' },
    ]
  },
  {
    slug: 'metropolis-arise',
    title: 'Metropolis Arise',
    category: 'Cinematic Motion',
    color: '#F5F5F5',
    year: '2024',
    client: 'Urban Core',
    role: 'VFX / Directing',
    description: 'A study on the rhythmic nature of brutalist architecture in modern Tokyo, translated into a series of highly stylized cinematic loops.',
    heroImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470723710355-95304bc09975?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449156001935-d28705351fa7?q=80&w=2670&auto=format&fit=crop',
    ],
    stats: [
      { label: 'Scenes', value: '42' },
      { label: 'Resolution', value: '8K' },
    ]
  }
];

async function seed() {
  console.log('--- Seeding Database ---');
  
  try {
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('Admin user seeded (admin / admin123).');
    } else {
      console.log('Admin user already exists.');
    }
    
    for (const projectData of PROJECTS) {
      const projectExists = await Project.findOne({ where: { slug: projectData.slug } });
      if (!projectExists) {
        await Project.create(projectData);
        console.log(`Seeded project: ${projectData.title}`);
      } else {
        console.log(`Project already exists: ${projectData.title}`);
      }
    }

    for (const setting of SITE_SETTINGS_SEED) {
      const exists = await SiteSetting.findOne({ where: { key: setting.key } });
      if (!exists) {
        await SiteSetting.create(setting);
        console.log(`Seeded site setting: ${setting.key}`);
      } else {
        console.log(`Site setting already exists: ${setting.key}`);
      }
    }

    for (const item of CONTENT_ITEMS_SEED) {
      const exists = await ContentItem.findOne({
        where: { section: item.section, sortOrder: item.sortOrder },
      });
      if (!exists) {
        await ContentItem.create(item);
        console.log(`Seeded content item: ${item.section} #${item.sortOrder}`);
      }
    }
    
    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
