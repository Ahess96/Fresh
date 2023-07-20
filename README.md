# Fresh

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Sinon](https://img.shields.io/badge/sinon.js-323330?style=for-the-badge&logo=sinon) ![Chai](https://img.shields.io/badge/chai.js-323330?style=for-the-badge&logo=chai&logoColor=red) ![Mocha](https://img.shields.io/badge/mocha.js-323330?style=for-the-badge&logo=mocha&logoColor=Brown) ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white) ![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## Nginx Scaled Backend API

Fresh is a horizontally scaled *ExpressJS* and *NodeJS* backend application capable of handling thousands of requests per second. It's a mock e-commerce site designed to quickly query a **PostgreSQL** database deployed to an **AWS RDS** instance that may contain up to 1.777 x 10^30 possible datapoint combinations. **Nginx** is configured to act as a *reverse proxy* and *load balancer* for 3 identical APIs deployed to identical **AWS EC2** instances to handle over a quarter million requests per minute to a single endpoint. All routes are cleanly documented using **Swagger.io**.

## Table of Contents

- [PostgreSQL Schemas](#postgresql-schemas)
- [Seeding Data with Faker.JS](#seeding-data-with-fakerjs)
- [Running the API](#running-the-api)
- [Scaling the Application](#scaling-the-application)
- [Stress Tests Using Loader.io](#stress-tests-using-loaderio)
- [Future Enhancements](#future-enhancements)

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

### Using Conjunction Tables

The features and colors are reuseable in this application to allow for less storage use and more efficient development. PostgreSQL conjunction tables conveniently allow many to many relationships to be formed between items and colors and items and features by implementing table joins when querying the database.

Logic preventing redundant assignment of colors and features to the same item was performed on the creation of the conjunction tables. This allows for a cleaner database, faster load times when querying the database and eliminates the need for any front end polishing of the data.

#### Item_features Schema

- *id*: unique identifier; primary key
- *item_id*: individual id corresponding to one item row; foreign key
- *feature_id*: individual id corresponding to one feature row; foreign key

#### Item_colors Schema

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

Adjust the values as needed.

### Database Setup

1. Create the database using psql

    ``` bash
    createdb fresh
    ```

2. Create the tables using the schemas provided above.
3. Seed data using the 'generateFakeData.js' file in the root of the project directory. I recommend seeding the data in chunks to prevent crashing your system.
4. Deploy database to an **Amazon RDS** instance. If you're unsure how to do this, consult [this link](https://www.commandprompt.com/education/how-to-migrate-local-postgresql-database-to-aws-rds/#:~:text=To%20migrate%20the%20local%20PostgreSQL%20database%20to%20the%20AWS%20RDS,file%20from%20the%20local%20directory.). I used the default settings for the free tier.

### API Documentation

![Swagger Docs](https://media.giphy.com/media/JDqfZri81bXmZt8Ehd/giphy.gif)

All routes are thoroughly documented using **Swagger.io**, which provides a clean GUI to navigate the API. Use 'nodemon server' in the CLI and navigate to [here](http://localhost:3000/api-docs/#/default). Otherwise, consult '/routes/api/items.js'.

## Scaling the Application

The main purpose of Fresh is to be a scaleable application capable of handling thousands of requests per second. Implementing horizontal scaling and load balancing are key to this project's functionality.

### Horizontal Scaling

Identical backend APIs of Fresh are hosted on three identical **Ubuntu AWS EC2** instances. Here, horizontal scaling is a more favorable approach to app development than vertical scaling because it requires less memory (cheaper) and can handle requests more efficiently and consistently. Three **t2 micro** instances are used because they are in the AWS free tier and three is an appropriate amount to handle the volume I'm interested in. **Amazon Machine Images (AMIs)** were created from an initial EC2 instance to ensure each is an exact replica and creates more consistent and predictable performance outcomes.

### Nginx Load Balancing

Nginx is used as a reverse proxy and load balancer for Fresh. It is deployed to a separate **Ubuntu t2 medium** server to accomodate thousands of requests per second. As discussed below in *"Load Testing"*, using a t2 micro instance proved inadequate and resulted in bottlenecking at high request volumes.

*IP Hash* is the most effective load balancing technique in stress test environments for Fresh as revealed by many tests using **Loader.io**. This may be because this method is particularly useful for maintaining session persistance.

Refer to 'nginx.conf' in the root directory for the exact configuration of **Nginx**.

## Stress Tests Using Loader.io

[Loader.io](https://loader.io/) allows for load tests on an application and is capable of creating thousands of requests per second from different IP addresses. It's an appropriate tool for stress tests on Fresh because it provides data on the Average Response Time (ART) and the Error Rate (ER) for each stress testing environment. It also allows you to define the desired request volume and distribution of the requests over time. The results discussed below were configured to simulate ability of Fresh to handle a certain number of Clients per Second (c/s).

![Loader Results](url./../public/Image%207-14-23%20at%208.07%20AM.jpg)

Stress tests revealed that I am able to horizontally scale and load balance Fresh to respond up to **56 times faster** than it would as a single instance server. Additionally, this scaled version of Fresh can handle **333 percent** more c/s while staying below a 6500 ms ART and having a mere 0.3 percent ER.

Express compression is also installed as a dependency to improve response time but the most effective performance variables are in the 'nginx.conf' file. Each line is annotated as needed to explain the utility of implemented configurations.

## Future Enhancements

Fresh is currently a backend application, so one of the most obvious additions would be designing a front end using React.JS.

Performance wise, Fresh would likely have a faster ART if it was horizontally scaled to include additional servers, say four or five instead of three. It seems for every additional backend server the apps performance increased two-fold. Of course, Nginx bottlenecking will occur at some point with the addition of servers, so upgrading the server that it is hosted is likely required as well.
