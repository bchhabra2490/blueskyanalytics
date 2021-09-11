const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const redisClient = require('./redisSetup');
// Read .env file from the project
const dotenv = require('dotenv')
dotenv.config();

// Logger
const morgan  = require('morgan');
app.use(morgan('combined')); 

const country = require('./controllers/country.js');


// Setting Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });

   
app.use(cors({
    origin: true,
    credentials: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (request, response) => {
    response.json({ info: 'BlueSky Analytics task APIs are up.' })
})

app.get('/countries', country.getAll);

app.get('/country/:id', country.getCountry);

// Listen to the server
app.listen(process.env.APP_PORT, () => {
    console.log(`App running on port ${process.env.APP_PORT}.`);
})

module.exports = app; // for testing