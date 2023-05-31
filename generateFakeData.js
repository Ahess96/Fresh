const faker = require('faker');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fresh',
    password: 'Jambajuice1',
    port: 5432, // default PostgreSQL port
  });


const items = [];
for (let i = 0; i < 10000; i++) {
    const item = generateItemData();
    items.push(item);
}

function generateItemData() {
    const itemName = faker.commerce.productName();
    const itemDescription = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const sku = faker.string.uuid();

    return [itemName, itemDescription, price, sku];
}


const features = generateFeatures(items.map(item => item[0]), 1, 10);


function generateFeatures(itemIDs, minFeatures, maxFeatures) {
    const features = [];
    for (const itemID of itemIDs) {
        const numFeatures = faker.number.int({min: minFeatures, max: maxFeatures});
        for (let i = 0; i < numFeatures; i++) {
            const feature = faker.commerce.productAdjective();
            features.push([feature, itemID]);
        }
    }
    return features;
}

async function seedData() {
    try {
        // start database transaction
        const client = await pool.connect();
        await client.query('BEGIN');

        // insert items statement
        const itemQuery = 'INSERT INTO items (itemName, itemDescription, price, sku) VALUES ($1, $2, $3, $4)';
        const itemValues = items;

        //execute insert item statment
        await client.query(itemQuery, itemValues);

        // insert features statement
        const featureQuery = 'INSERT INTO features (features, item_id) VALUES ($1, $2)';
        const featureValues = features;

        //execute insert features statement
        await client.query(featureQuery, featureValues);

        //commit transaction
        await client.query('COMMIT');

        // release DB connection
        client.release();
        console.log('Data seeded successfully.')
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error seeding data:', error);
    }
}

seedData();
  