// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('tasks service', () => {
  it('registered the service', () => {
    const service = app.service('tasks')

    assert.ok(service, 'Registered the service')
  })
})
