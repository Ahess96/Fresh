# Fresh

## Nginx Scaled Backend API

Fresh is a horizontally scaled application capable of handling thousands of requests per second. It's a mock e-commerce site designed to quickly query a **PostgreSQL** database that may contain up to 1.777 * 10^30 possible datapoint combinations. **Nginx** is configured to act as a reverse proxy and load balancer for 3 identical APIs deployed to identical **AWS EC2** instances to handle over a quarter million requests per minute to a single endpoint.

## PostgreSQL Schemas

Easy querying and quick accessibility are the primary considerations for developing an application of this scale. Yet, the I want the database to reflect real data that the average user is familiar with seeing on other e-commerce sites.

Fresh contains a schema for *item*, *color*, *feature*, *user* and *review* at its core. There are 10,000 items each with up to 10 possible colors (from a pool of 50), up to 10 possible features (from a pool of 100) and up to 50 unique reviews from a pool of 1000 users.

### Item Schema

- id: unique identifier; primary key
- name: string
- description: string of text describing item
- price: numeric value with up to six digits followed by two decimal points
- SKU: UUID containing letters & numbers

### Color Schema

- id: unique identifier; primary key
- color_name: string

### Feature Schema

- id: unique identifier; primary key
- feature_name: string

### User Schema

- id: unique identifier; primary key
- name: fictional name of user
- address: string with realistic address

## Seeding Data with FakerJS

FakerJS allows for the quick generation of thousands of datapoints thanks to their built in methods. To simulate realistic data, but not spend months creating it, data was created as follows:
```
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
```

I created 10,000 total items, but they were seeded in smaller increments to avoid performance issues on my device. Here's a simple example of how the data was seeded:

```
async function seedData() {
    let client;
    try {
        // start database transaction
        client = await pool.connect();
        await client.query('BEGIN');
        // insert items statement
        const itemQuery = 'INSERT INTO items (name, price, description, sku) VALUES ($1, $2, $3, $4)';
        const itemValues = items.map(({name, price, description, sku}) => [name, price, description, sku]
        );        

        //execute insert item statment
        for (const values of itemValues) {
             await client.query(itemQuery, values);
        }
        await client.query('COMMIT');
        // rest of code
    }
}
```

