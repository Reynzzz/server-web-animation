export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SiteSettings', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    value: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable('ContentItems', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sortOrder: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    title: {
      type: Sequelize.STRING,
    },
    subtitle: {
      type: Sequelize.STRING,
    },
    body: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.TEXT,
    },
    metadata: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('ContentItems');
  await queryInterface.dropTable('SiteSettings');
}
