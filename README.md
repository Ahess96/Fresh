# Fresh

## Nginx Scaled Backend API

Fresh is a horizontally scaled application capable of handling thousands of requests per second. It's a mock e-commerce site designed to quickly query a **PostgreSQL** database deployed to an AWS RDS instance that may contain up to 1.777 * 10^30 possible datapoint combinations. **Nginx** is configured to act as a reverse proxy and load balancer for 3 identical APIs deployed to identical **AWS EC2** instances to handle over a quarter million requests per minute to a single endpoint. All routes are cleanly documented using **Swagger.io**.

## PostgreSQL Schemas

Easy querying and quick accessibility are the primary considerations for developing an application of this scale. I leveraged two primary tools provided by postgreSQL to accomplish this: indexing and conjunction tables. Indexing frequently searched table columns significantly increases access speeds. The foreign keys referenced in conjunction tables are also important to index to greatly increase the speed of queries involving join tables.

Fresh contains a schema for *item*, *color*, *feature*, *user* and *review* at its core. There are 10,000 items each with up to 10 possible colors (from a pool of 50), up to 10 possible features (from a pool of 100) and up to 50 unique reviews from a pool of 1000 users.

### Item Schema

- *id*: unique identifier; primary key
- *name*: string
- *description*: string of text describing item
- *price*: numeric value with up to six digits followed by two decimal points
- *SKU*: UUID containing letters & numbers

### Color Schema

- *id*: unique identifier; primary key
- *color_name*: string

### Feature Schema

- *id*: unique identifier; primary key
- *feature_name*: string

### User Schema

- *id*: unique identifier; primary key
- *name*: fictional name of user
- *address*: string with realistic address

## Using Conjunction Tables

The features and colors are reuseable in this application to allow for less storage use and more efficient development. PostgreSQL conjunction tables conveniently allow many to many relationships to be formed between items and colors and items and features by implementing table joins when querying the database.

Logic preventing redundant assignment of colors and features to the same item was performed on the creation of the conjunction tables. This allows for a cleaner database, faster load times when querying the database and eliminates the need for any front end polishing of the data.

### Item_features Schema

- *id*: unique identifier; primary key
- *item_id*: individual id corresponding to one item row; foreign key
- *feature_id*: individual id corresponding to one feature row; foreign key

### Item_colors Schema

- *id*: unique identifier; primary key
- *item_id*: individual id corresponding to one item row; foreign key
- *color_id*: individual id corresponding to one color row; foreign key

## Seeding Data with FakerJS

FakerJS allows for the quick generation of thousands of datapoints thanks to their built in methods. To simulate realistic data, but not spend months creating it, data was generated as follows:

``` javascript
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

``` javascript
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

## Running the API

Follow these steps to run the API locally:

### Prerequisites

Ensure you have the following installed on your local machine before attempting to run the API:

- Node.js (version 16.16.0 or higher): [Download Node.js](https://nodejs.org/en)
- PostgreSQL (version 15.3.0 or higher): [Download PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Clone the repository and cd into project directory

    ``` bash
    git clone https://github.com/Ahess96/Fresh.git

    cd Fresh/
    ```

2. Install package dependencies (I use npm)

    ``` bash
    npm ci
    ```

### Configuration

1. Create a '.env' file at the root of the directory.
2. Include the following variables in your '.env':

    ``` plaintext
    RDS_USERNAME=<username>
    RDS_HOSTNAME=<aws_rds_link>
    RDS_DB_NAME=<db_name>
    RDS_PASSWORD=<password>
    ```