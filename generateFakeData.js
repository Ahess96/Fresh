require('dotenv').config();
const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');
const env = process.env;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fresh',
    password: env.RDS_PASSWORD,
    port: 5432, // default PostgreSQL port
  });


function generateUsers() {
    const name = faker.person.fullName();
    const address = faker.location.streetAddress();
    return {name, address};
}

const users = [];
for (let i = 0; i < 600; i++) {
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
    for (const itemID of itemIDs) {
        const numReviews = faker.number.int({min: 1, max: 50});
        for (let i = 0; i < numReviews; i++) {
            const content = faker.lorem.sentences();
            const rating = Math.floor(Math.random() * 5) + 1;
            const userID = userIDs[faker.number.int({ min: 0, max: userIDs.length - 1 })];
            reviews.push([content, itemID, userID, rating]);
        }
    }
    return reviews;
}


async function seedData() {
    let client;
    try {
        // start database transaction
        client = await pool.connect();
        await client.query('BEGIN');

        // query for inserted features and colors to retrieve id's given by postgres
        // const selectFeaturesQuery = 'SELECT id FROM features';
        // const featuresResult = await client.query(selectFeaturesQuery);
        // const featureIDs = featuresResult.rows.map(obj => obj.id);

        // const selectColorsQuery = 'SELECT id FROM colors';
        // const colorsResults = await client.query(selectColorsQuery);
        // const colorIDs = colorsResults.rows.map(obj => obj.id);
        
        // const selectItemsQuery = 'SELECT * FROM items ORDER BY id DESC LIMIT 1000';
        // const itemsResults = await client.query(selectItemsQuery);
        // const itemsIDs = itemsResults.rows.map(obj => obj.id);

        // const selectUsersQuery = 'SELECT id FROM users';
        // const usersResults = await client.query(selectUsersQuery);
        // const usersIDs = usersResults.rows.map(obj => obj.id);

        // create random assignment of random number of colors to each item
        // const generateRandomNumber = () => Math.floor(Math.random() * 15) + 1;

        // create tables for M:M relationships
        // items : features
        // for (const itemID of itemsIDs) {
        //     const numOfFeatures = generateRandomNumber();
        //     const randomFeatureIDs = [];
        //     while (randomFeatureIDs.length < numOfFeatures) {
        //         const randomIdx = Math.floor(Math.random() * featureIDs.length);
        //         const randomFeatureID = featureIDs[randomIdx];
        //         if (!randomFeatureIDs.includes(randomFeatureID)) {
        //             randomFeatureIDs.push(randomFeatureID);
        //         }
        //     }
        //     for (const featureID of randomFeatureIDs) {
        //         const itemFeaturesQuery = 'INSERT INTO item_features (item_id, feature_id) VALUES ($1, $2)'
        //         await client.query(itemFeaturesQuery, [itemID, featureID])
        //     }
        // }
        // // items : colors
        // for (const itemID of itemsIDs) {
        //     const numOfColors = generateRandomNumber();
        //     const randomColorIDs = [];
        //     // select unique colorIDs
        //     while (randomColorIDs.length < numOfColors) {
        //         const randomIdx = Math.floor(Math.random() * colorIDs.length);
        //         const randomColorID = colorIDs[randomIdx];

        //         if(!randomColorIDs.includes(randomColorID)) {
        //             randomColorIDs.push(randomColorID);
        //         }
        //     }

        //     for (const colorID of randomColorIDs) {
        //         const itemColorsQuery = 'INSERT INTO item_colors (item_id, color_id) VALUES ($1, $2)';
        //         await client.query(itemColorsQuery, [itemID, colorID])
        //     }
        // }    

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

        // insert reviews statement
        // const reviews = generateReviews(itemsIDs, usersIDs);
        // const reviewQuery = 'INSERT INTO reviews (content, item_id, user_id, rating) VALUES ($1, $2, $3, $4)';
        // const reviewValues = reviews.map(review => [review[0], review[1], review[2], review[3]]);

        // // execute insert reviews statement
        // for (const values of reviewValues) {
        //     await client.query(reviewQuery, values);
        // }
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
  