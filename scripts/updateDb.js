const { updateAllContent } = require('../src/utils/updateDatabase.js');

console.log('Начинаем обновление базы данных...');

updateAllContent()
  .then(() => {
    console.log('База данных успешно обновлена!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Ошибка при обновлении базы данных:', error);
    process.exit(1);
  }); 