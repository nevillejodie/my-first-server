const { Client } = require("pg");
const client = new Client();
(async () => {
  await client.connect();
})();

module.exports = {
  // getAllPersons should retrieve all person records

  // currently held.
  getAllPersons: async () => {
      const res = await.client.query(`

      SELECT 
      id, 
      name,
      handle,
      language
      FROM username `);

      return res.rows;
  },
    
  // savePerson should create a new person record and
  // return its `id`.
  savePerson: async (name, twitterHandle, favouriteLanguage) => {
    const res = await client.query(`
    `, [name, twitterHandle, favouriteLanguage]);

    return res.rows[0];
},

  // deletePerson should delete a person record and
  // return true or false depending of if it succeeded.
  deletePerson: async (id) => {
    await client.query( [id]);

    return true;
},
};
