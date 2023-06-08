const client = require("../../config/database")

module.exports = {
    getItems,
}

async function getItems(req, res) {
    const colors = await client.query('SELECT * FROM colors')
    res.json(colors)
}