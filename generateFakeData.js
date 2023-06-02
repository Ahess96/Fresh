const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fresh',
    password: 'Jambajuice1',
    port: 5432, // default PostgreSQL port
  });


function generateUsers() {
    const name = faker.person.fullName();
    const address = faker.location.streetAddress();
    return {name, address};
}

const users = [];
for (let i = 0; i < 200; i++) {
    const user = generateUsers();
    users.push(user);
}


function generateItemData() {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const sku = faker.string.uuid();

    return {name, price, description, sku};
}

const items = [];
for (let i = 0; i < 1000; i++) {
    const item = generateItemData();
    items.push(item);
}

function generateFeatures(totalFeatures) {
    const features = [];
    // for (const item_id of itemIDs) {
        const numFeatures = faker.number.int({min: 1, max: Math.min(totalFeatures, 10)});
        for (let i = 0; i < numFeatures; i++) {
            const feature = faker.commerce.productAdjective();
            features.push(feature);
        }
    // }
    console.log(features);
    return features;
}

const totalFeatures = 10;
const features = generateFeatures(totalFeatures);


function generateColors(itemIDs, minColors, maxColors) {
    const colors = [];
    for (const item_id of itemIDs) {
        const numColors = faker.number.int({min: minColors, max: maxColors});
        for (let i = 0; i < numColors; i++) {
            const color_name = faker.color.human();
            colors.push([color_name, item_id]);
        }
    }
    return colors;
}

const colors = generateColors(items.map(item => item[0]), 1, 10);


function generateReviews(itemIDs, userIDs) {
    const reviews = [];
    for (const item_id of itemIDs) {
        const numReviews = faker.number.int({min: 1, max: 50});
        for (let i = 0; i < numReviews; i++) {
            const content = faker.lorem.sentences();
            const user_id = userIDs[faker.number.int({ min: 0, max: userIDs.length - 1 })];
            reviews.push([content, item_id, user_id]);
        }
    }
    return reviews;
}

const reviews = generateReviews(items.map(item => item[0]), users.map(user => user.id));


async function seedData() {
    let client;
    try {
        // start database transaction
        client = await pool.connect();
        await client.query('BEGIN');

        // insert users statement
        // const userQuery = 'INSERT INTO users (name, address) VALUES ($1, $2)';
        // const userValues = users.map(({ name, address }) => [name, address]);

        // // execute insert user statement
        // for (const values of userValues) {
        //     await client.query(userQuery, values);
        // }

        // insert items statement
        const itemQuery = 'INSERT INTO items (name, price, description, sku) VALUES ($1, $2, $3, $4)';
        const itemValues = items.map(({name, price, description, sku}) => [name, price, description, sku]);        

        //execute insert item statment
        for (const values of itemValues) {
            await client.query(itemQuery, values);
        }

        // query for inserted items to retrieve id's given by postgres
        // Select last 100 data points
        const selectQuery = 'SELECT id FROM items ORDER BY id DESC LIMIT 1000';
        const result = await client.query(selectQuery);
        const last1000DataPoints = result.rows;

        console.log('Last 1000 data points:');
        console.log(last1000DataPoints);

        // insert features statement
        const featureQuery = 'INSERT INTO features (features) VALUES ($1)';
        const featureValues = features.map(feature => [feature]);

        for (const values of featureValues) {
            await client.query(featureQuery, values);
        }
        // insert colors statement
        // const colorQuery = 'INSERT INTO colors (color_name, item_id) VALUES ($1, $2)';
        // const colorValues = colors;

        // // execute insert colors statement
        // await client.query(colorQuery, colorValues);

        // // insert reviews statement
        // const reviewQuery = 'INSERT INTO reviews (content, item_id, user_id) VALUES ($1, $2, $3)';
        // const reviewValues = reviews;

        // // execute insert reviews statement
        // await client.query(reviewQuery, reviewValues);

        //commit transaction
        await client.query('COMMIT');

        // release DB connection
        console.log('Data seeded successfully.')
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error seeding data:', error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

seedData();
  