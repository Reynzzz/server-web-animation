export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Projects', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.STRING,
    },
    client: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    heroImage: {
      type: Sequelize.TEXT,
    },
    gallery: {
      type: Sequelize.JSON,
      defaultValue: [],
    },
    stats: {
      type: Sequelize.JSON,
      defaultValue: [],
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

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Projects');
}
