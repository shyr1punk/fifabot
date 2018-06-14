const { Client } = require('pg');

const client = new Client();
client.connect();

// Поиск по ОКПО
async function getRandomPicture() {
  try {
    const query =
      'SELECT * FROM pictures OFFSET floor(random() * (select COUNT(*) from pictures)) LIMIT 1;';
    const res = await client.query(query);

    return { err: null, res };
  } catch (err) {
    return { err };
  }
}

module.exports = {
  getRandomPicture
};