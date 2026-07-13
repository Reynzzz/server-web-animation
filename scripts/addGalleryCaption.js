import sequelize from '../config/database.js';

async function addColumn() {
  try {
    await sequelize.query('ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "galleryCaption" TEXT DEFAULT \'\'');
    console.log('✅ Column "galleryCaption" added to Projects table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addColumn();
