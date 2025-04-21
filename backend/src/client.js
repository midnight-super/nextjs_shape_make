// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
export const invitesServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const supportTicketsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const notificationsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const invoicesServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const emailsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const quotesServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const tasksServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const notesServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const opportunitiesServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const organisationsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const designsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const robotsServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

export const userServiceMethods = ['find', 'get', 'create', 'patch', 'remove']

/**
 * Returns a  client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))

  client.use('users', connection.service('users'), {
    methods: userServiceMethods
  })

  client.use('robots', connection.service('robots'), {
    methods: robotsServiceMethods
  })

  client.use('designs', connection.service('designs'), {
    methods: designsServiceMethods
  })

  client.use('organisations', connection.service('organisations'), {
    methods: organisationsServiceMethods
  })

  client.use('opportunities', connection.service('opportunities'), {
    methods: opportunitiesServiceMethods
  })

  client.use('notes', connection.service('notes'), {
    methods: notesServiceMethods
  })

  client.use('tasks', connection.service('tasks'), {
    methods: tasksServiceMethods
  })

  client.use('jobs', connection.service('jobs'), {
    methods: jobsServiceMethods
  })

  client.use('quotes', connection.service('quotes'), {
    methods: quotesServiceMethods
  })

  client.use('emails', connection.service('emails'), {
    methods: emailsServiceMethods
  })

  client.use('invoices', connection.service('invoices'), {
    methods: invoicesServiceMethods
  })

  client.use('notes', connection.service('notes'), {
    methods: notesServiceMethods
  })

  client.use('notifications', connection.service('notifications'), {
    methods: notificationsServiceMethods
  })

  client.use('support-tickets', connection.service('support-tickets'), {
    methods: supportTicketsServiceMethods
  })

  client.use('invites', connection.service('invites'), {
    methods: invitesServiceMethods
  })

  return client
}
