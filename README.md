# How to implements middlewares in Harmonia

The objective of this workshop is to practice the implementation of middleware otherwise called service within harmonia to validate data and exchange information between your different middlewares

## Getting started

- Git clone this [project](https://github.com/WildCodeSchool/workshop-js-middlewares)
- Run `npm install`
- Setup your .env file in the `server` folder
- Run `npm run db:migrate`
- Run `npm run dev:server`

## Project architecture

Diagram allowing you to visualize the architecture of the server folder, certain parts have been deliberately omitted in this diagram to concentrate on the essentials

The part that interests us here is found in the `app/service` folder, this is where we will declare all our middleware

```sh
server
├── database
│   ├── fixtures
│   │   └──  // ✅
│   ├── models
│   │   └──  // ✅
│   ├── client.js
│   ├── schema.sql // ✅
│   └── tables.js  // ✅
├── app
│   ├── routers
│   │   └──  // ✅
│   ├── controllers
│   │   └──  // ✅
│   ├── services # folder who contain others middlewares services (data validator, email service, etc..)
│   │   └──  // MAINTENANT
│   └── config.js
├── tests
│   └──  // bientôt
├── .env.sample
├── .gitignore
├── index.js // ✅
├── package-lock.json
└── package.json
```

## Your mission

### Data validation middlewares

You should implement a data validation middleware for an album table which contains at least the following information: title, genre, picture, artist
To validate these fields, you must respect at least the following rules: the title must be at least 3 characters long, the genre must be one of the 3 genres mentioned (Rap, Rock, Electro) the case being important.

- To do this, start by creating a new `albums.js` file in the `app/services` folder.
- In your middleware validate the data using the rules above
- In case of error send a 400 status code with a message explaining the error
- In case of no error call the next method to pass the rest to the controller
- Apply your middleware to the POST route `/albums` just before your controller

**Validation middleware example :**

```js
// Validation middleware
const validateData = (req, res, next) => {
  const { name, age } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string with at least 3 characters.' });
  }

  if (!age || typeof age !== 'number' || age < 18) {
    return res.status(400).json({ error: 'Age must be a number and at least 18.' });
  }

  next();
};
```

**Valid Request Example:**

- URL: http://localhost:3000/albums
- Method: POST
- Body (JSON):

```json
{
  "title": "Revolutionary",
  "genre": "Rock",
  "picture": "http://example.com/pic.jpg",
  "artist": "The Rockers"
}
```

Expected Response:

```json
{
  "title": "Revolutionary",
  "genre": "Rock",
  "picture": "http://example.com/pic.jpg",
  "artist": "The Rockers"
}
```

**Invalid Request Example (Title too short):**

- URL: http://localhost:3000/albums
- Method: POST
- Body (JSON):

```json
{
  "title": "Hi",
  "genre": "Rock",
  "picture": "http://example.com/pic.jpg",
  "artist": "The Rockers"
}
```

Expected Response:

```json
{
  "error": "Title must be at least 3 characters long."
}
```

### Data transfert betweens middlewares

In Express.js, middleware functions are pieces of code that execute during the lifecycle of a request to the server. They have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. Middleware functions can perform a variety of tasks, such as executing code, modifying the request and response objects, ending the request-response cycle, and calling the next middleware function.

#### How Data Transfer Works Between Middlewares

Middleware functions are executed sequentially, in the order they are defined in the application. The primary way data is transferred between middleware functions is through the req and res objects.

**Example of Middleware Data Transfer :**

```js

// Validation middleware
const validateData = (req, res, next) => {
  const { name, age } = req.body;

  if (!name || typeof name !== 'string' || name.length < 3) {
    return res.status(400).json({ error: 'Name must be a string with at least 3 characters.' });
  }

  if (!age || typeof age !== 'number' || age < 18) {
    return res.status(400).json({ error: 'Age must be a number and at least 18.' });
  }

  next();
};

// Transformation middleware
const transformData = (req, res, next) => {
  req.body.name = req.body.name.trim();
  req.isAdmin = true // we can also pass new data directly in the request object !
  next();
};

// Controller middlewares
const createUser = async (req, res, next) => {
  // call the model to insert data in the db & send response to the client
}

// Route with middleware
app.post('/user', validateData, transformData, createUser);

```

Now it's your turn, add in the `albums` file previously created in the `service` folder a middleware function which must add to the `req` object an `isAdmin` property set to false and move on to the next middleware using the `next` method

Then implement this middleware on the post `/albums` route before the validation middleware done above then modify the validation middleware so that it returns a 403 status in response in the case where the isAdmin property defined in the request object is false

Now test changing the value of the isAdmin property from false to true, you should now have a status 201 returned by your api


## Bonus mission

To simplify and strengthen validation, modify your validation middleware to use a library like joi.

[joi get started](https://www.digitalocean.com/community/tutorials/how-to-use-joi-for-node-api-schema-validation#step-2-experimenting-with-joi-validation-rules)