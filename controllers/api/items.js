const client = require("../../config/database")

module.exports = {
    getQueriedItems,
}


async function getQueriedItems(req, res) {
    const re = {
        name: 'hand'
    }
    // initial query with true condition
    let query = 'SELECT * FROM items WHERE 1=1';
    if (re.name) {
        query += ` AND name ILIKE '%${re.name}%'`;
    }
    const results = await client.query(query);
    const items = results.rows;
    res.json(items)
}