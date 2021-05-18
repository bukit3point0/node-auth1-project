const db = require('../../data/db-config')

function find() {
  return db('users')
  .select('user_id', 'username')
  .orderBy('user_id')
}

function findBy(filter) {
  return db('users')
  .where(filter)
  //.select('user_id', 'username')
  .orderBy('user_id')
}

function findIdAndUser(filter) {
  return db('users')
  .where(filter)
  .select('user_id', 'username')
  .orderBy('user_id')
}

function findById(user_id) {
  return db('users')
  .where ({user_id})
  .select('user_id', 'username')
  .first()
}

async function add(user) {
  const [id] = await db('users').insert(user, 'id')
  return findById(id)
}

module.exports = {
  find,
  findBy,
  findIdAndUser,
  findById,
  add
}
