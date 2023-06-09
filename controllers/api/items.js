const pool = require("../../config/database")

module.exports = {
    getQueriedItems,
    getItemDetails,
    getItemReviews,
    getUser,
}


async function getQueriedItems(req, res, next) {
    let client;
    try {
        const re = {
            name: 'hand'
        }
        // initial query with true condition
        let query = 'SELECT * FROM items WHERE 1=1';
        if (re.name) {
            query += ` AND name ILIKE '%${re.name}%'`;
        }
        query += ' Limit 50'

        client = await pool.connect();
        const results = await client.query(query);
        const items = results.rows;
        res.status(200).json(items)
    } catch (err) {
        console.error('Cannot retrieve items matching your query', err)
        if (next) {
            next(err)
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function getItemDetails(req, res) {
    let client;
    // ID will be pass as req.params.id
    const reqparams = {
        id: 12006
    }
    // ITEM DESCRIPTION, PRICE, NAME, SKU WILL BE PASSED DOWN AS PROP ON FRONT END TO PREVENT REDUNDANT QUERY
    try {
        const itemID = reqparams.id;
        // select distinct colors and features belonging to an item and aggregate them into arrays
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

        client = await pool.connect();
        const results = await client.query(query);
        const itemDetails = results.rows[0];

        res.status(200).json(itemDetails);
    } catch (err) {
       console.error('Cannot retrieve item details', err)
       res.status(500).json({ error: "Internal server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function getItemReviews(req, res) {
    let client;
    // ID will be pass as req.params.id
    const reqparams = {
        id: 12008
    }
    try {
        const query = `
        SELECT * FROM reviews AS r  
        WHERE r.item_id = ${reqparams.id}
        `;
        client = await pool.connect();
        const results = await client.query(query);
        const reviews = results.rows;
        res.status(200).json(reviews);
    } catch (err) {
        console.error('Cannot retrieve item details', err)
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function getUser(req, res) {
    let client;
    // ID will be pass as req.params.id
    const reqparams = {
        id: 614
    }

    try {
        const query = `
        SELECT DISTINCT * FROM users AS u
        WHERE u.id = ${reqparams.id}
        `;
        client = await pool.connect();
        const results = await client.query(query);
        const user = results.rows[0];

        res.status(200).json(user);
    } catch (err) {
        console.error('Cannot retrieve item details', err)
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (client) {
            client.release();
        }
    }
}