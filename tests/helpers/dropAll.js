async function dropAll(sequelize) {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
  await sequelize.query('SET GROUP_CONCAT_MAX_LEN=32768;');
  const result = await sequelize.query(`
    SELECT GROUP_CONCAT('\`', table_name, '\`') as tables
      FROM information_schema.tables
      WHERE table_schema = (SELECT DATABASE());
  `);
  if (result.length && result[0].length && result[0][0].tables) {
    await sequelize.query(`DROP TABLE IF EXISTS ${result[0][0].tables};`);
  }
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
}

module.exports = dropAll;
