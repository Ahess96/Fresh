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
    // const numFeatures = faker.number.int({min: 1, max: Math.min(totalFeatures, 10)});
    for (let i = 0; i < 100; i++) {
        const feature = faker.commerce.productAdjective();
        features.push(feature);
    }
    return features;
}

const totalFeatures = 10;
const features = generateFeatures(totalFeatures);


function generateColors(minColors, maxColors) {
    const colors = [];
    // const numColors = faker.number.int({min: minColors, max: maxColors});
    for (let i = 0; i < 50; i++) {
        const color_name = faker.color.human();
        colors.push(color_name);
    }
    return colors;
}

const colors = generateColors(1, 10);


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

        // query for inserted features and colors to retrieve id's given by postgres
        // const selectFeaturesQuery = 'SELECT id FROM features';
        // const featuresResult = await client.query(selectFeaturesQuery);
        // const featureIDs = featuresResult.rows;
        // grab random ids


        const selectColorsQuery = 'SELECT id FROM colors';
        const colorsResults = await client.query(selectColorsQuery);
        const colorIDs = colorsResults.rows.map(obj => obj.id);
        
        const selectItemsQuery = 'SELECT id FROM items';
        const itemsResults = await client.query(selectItemsQuery);
        const itemsIDs = itemsResults.rows.map(obj => obj.id);

        // create random assignment of random number of colors to each item
        const generateRandomNumber = () => Math.floor(Math.random() * 15) + 1;

        // create tables for M:M relationships
        // items : colors
        for (const itemID of itemsIDs) {
            const numOfColors = generateRandomNumber();
            const randomColorIDs = [];
            // select unique colorIDs
            while (randomColorIDs.length < numOfColors) {
                const randomIdx = Math.floor(Math.random() * colorIDs.length);
                const randomColorID = colorIDs[randomIdx];

                if(!randomColorIDs.includes(randomColorID)) {
                    randomColorIDs.push(randomColorID);
                }
            }

            for (const colorID of randomColorIDs) {
                const itemColorsQuery = 'INSERT INTO item_colors (item_id, color_id) VALUES ($1, $2)';
                await client.query(itemColorsQuery, [itemID, colorID])
            }
        } 
        

        // insert users statement
        // const userQuery = 'INSERT INTO users (name, address) VALUES ($1, $2)';
        // const userValues = users.map(({ name, address }) => [name, address]);

        // // execute insert user statement
        // for (const values of userValues) {
        //     await client.query(userQuery, values);
        // }

        // insert items statement
        // const itemQuery = 'INSERT INTO items (name, price, description, sku) VALUES ($1, $2, $3, $4)';
        // const itemValues = items.map(({name, price, description, sku}) => [name, price, description, sku]
        // );        

        // //execute insert item statment
        // for (const values of itemValues) {
        //     await client.query(itemQuery, values);
        // }

        // insert features statement
        // const featureQuery = 'INSERT INTO features (features) VALUES ($1)';
        // const featureValues = features.map(feature => [feature]);

        // for (const values of featureValues) {
        //     await client.query(featureQuery, values);
        // }
        // // insert colors statement
        // const colorQuery = 'INSERT INTO colors (color_name) VALUES ($1)';
        // const colorValues = colors.map(color => [color]);

        // // execute insert colors statement
        // for (const values of colorValues) {
        //     await client.query(colorQuery, values);
        // }

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
  