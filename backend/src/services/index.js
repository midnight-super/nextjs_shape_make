import { invites } from './invites/invites.js'

import { supportTickets } from './support-tickets/support-tickets.js'

import { notifications } from './notifications/notifications.js'

import { invoices } from './invoices/invoices.js'

import { emails } from './emails/emails.js'

import { quotes } from './quotes/quotes.js'

import { jobs } from './jobs/jobs.js'

import { tasks } from './tasks/tasks.js'

import { notes } from './notes/notes.js'

import { opportunities } from './opportunities/opportunities.js'

import { organisations } from './organisations/organisations.js'

import { designs } from './designs/designs.js'

import { robots } from './robots/robots.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(invites)

  app.configure(supportTickets)

  app.configure(notifications)

  app.configure(invoices)

  app.configure(emails)

  app.configure(quotes)

  app.configure(jobs)

  app.configure(tasks)

  app.configure(notes)

  app.configure(opportunities)

  app.configure(organisations)

  app.configure(designs)

  app.configure(robots)

  app.configure(user)

  // All services will be registered here
}
