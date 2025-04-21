// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'

import { authentication } from './authentication.js'

import { services } from './services/index.js'
import { channels } from './channels.js'

import {
  attachPaymentMethod,
  createPaymentIntent,
  createSetupIntent,
  createStripeCustomer,
  createSubscription,
  getCustomer,
  getCustomerPaymentMethods
} from './middleware/customFunctions.js'

const app = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())

app.use(function (req, res, next) {

  console.log('example')

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

// custom middleware
app.post('/create-stripe-customer', createStripeCustomer)
app.post('/create-subscription', createSubscription)
app.post('/create-setupintent', createSetupIntent)
app.post('/create-paymentintent', createPaymentIntent)
app.post('/attach-paymentmethod', attachPaymentMethod)
app.post('/get-customer', getCustomer)
app.post('/get-customer-paymentmethods', getCustomerPaymentMethods)

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: '*'
    }
  })
)
app.configure(mongodb)

app.configure(authentication)

app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
