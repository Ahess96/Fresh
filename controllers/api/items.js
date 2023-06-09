const client = require("../../config/database")

module.exports = {
    getQueriedItems,
    getItemDetails,
}


async function getQueriedItems(req, res) {
    try {
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
        res.status(200).json(items)
    } catch (err) {
        console.error('Cannot retrieve items matching your query', err)
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getItemDetails(req, res) {
    // ID will be pass as req.params.id
    const reqparams = {
        id: 12008
    }
    // ITEM DESCRIPTION, PRICE, NAME, SKU WILL BE PASSED DOWN AS PROP ON FRONT END TO PREVENT REDUNDANT QUERY
    try {
        const itemID = reqparams.id;
        const query = `
            SELECT i.*, ARRAY_AGG(DISTINCT c.color_name) AS colors, ARRAY_AGG(DISTINCT f.features) AS features
            FROM items AS i
            LEFT JOIN item_colors AS ic ON i.id = ic.item_id
            LEFT JOIN colors AS c ON ic.color_id = c.id
            LEFT JOIN item_features AS ife ON i.id = ife.item_id
            LEFT JOIN features AS f ON ife.feature_id = f.id
            WHERE i.id = ${itemID}
            GROUP BY i.id;
        `;    

        const results = await client.query(query);
        const itemDetails = results.rows[0];

        // add all features and colors to first result
        // let colors = [];
        // let features = [];
        // for (const row of results.rows) {
        //     if (row.color_name) colors.push(row.color_name);
        //     if (row.features) features.push(row.features);
        // }

        // // add features and colors to item details
        // itemDetails.color_name = colors;
        // itemDetails.features = features;

        res.json(itemDetails);
    } catch (err) {
       console.error('Cannot retrieve item details', err)
       res.status(500).json({ error: "Internal server error" });
    }
}