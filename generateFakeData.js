const faker = require('faker');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fresh',
    password: 'Jambajuice1',
    port: 5432, // default PostgreSQL port
  });


function generateUsers() {
    const userName = faker.person.fullName();
    const address = faker.location.streetAddress();
    return [userName, address];
}

const users = [];
for (let i = 0; i < 2000; i++) {
    const user = generateUsers();
    users.push(user);
}


function generateItemData() {
    const itemName = faker.commerce.productName();
    const itemDescription = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const sku = faker.string.uuid();

    return [itemName, itemDescription, price, sku];
}

const items = [];
for (let i = 0; i < 10000; i++) {
    const item = generateItemData();
    items.push(item);
}

function generateFeatures(itemIDs, totalFeatures) {
    const features = [];
    for (const itemID of itemIDs) {
        const numFeatures = faker.number.int({min: 1, max: Math.min(totalFeatures, 10)});
        for (let i = 0; i < numFeatures; i++) {
            const feature = faker.commerce.productAdjective();
            features.push([feature, itemID]);
        }
    }
    return features;
}

const totalFeatures = 50;
const features = generateFeatures(items.map(item => item[0]), totalFeatures);


function generateColors(itemIDs, minColors, maxColors) {
    const colors = [];
    for (const itemID of itemIDs) {
        const numColors = faker.number.int({min: minColors, max: maxColors});
        for (let i = 0; i < numColors; i++) {
            const color = faker.color.human();
            colors.push([color, itemID]);
        }
    }
    return colors;
}

const colors = generateColors(items.map(item => item[0]), 1, 10);


function generateReviews(itemIDs, userIDs) {
    const reviews = [];
    for (const itemID of itemIDs) {
        const numReviews = faker.number.int({min: 1, max: 50});
        for (let i = 0; i < numReviews; i++) {
            const content = faker.lorem.sentences();
            const userID = faker.random.arrayElement(userIDs);
            reviews.push([content, itemID, userID]);
        }
    }
    return reviews;
}

const reviews = generateReviews(items.map(item => item[0]), users.map(user => user.id));


async function seedData() {
    try {
        // start database transaction
        const client = await pool.connect();
        await client.query('BEGIN');

        // insert users statement
        const userQuery = 'INSERT INTO users (userName, address) VALUES ($1, $2)';
        const userValues = users;

        // execute insert user statement
        await client.query(userQuery, userValues);

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

        // insert colors statement
        const colorQuery = 'INSERT INTO colors (colors, item_id) VALUES ($1, $2)';
        const colorValues = colors;

        // execute insert colors statement
        await client.query(colorQuery, colorValues);

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
  