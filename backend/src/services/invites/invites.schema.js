// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const invitesSchema = {
  $id: 'Invites',
  type: 'object',
  additionalProperties: true,
  required: ['_id'],
  properties: {
    _id: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  }
}
export const invitesResolver = resolve({})
export const invitesExternalResolver = resolve({})

// Schema for creating new data
export const invitesDataSchema = {
  $id: 'InvitesData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const invitesDataValidator = getValidator(invitesDataSchema, dataValidator)
export const invitesDataResolver = resolve({})

// Schema for updating existing data
export const invitesPatchSchema = {
  $id: 'InvitesPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...invitesSchema.properties
  }
}
export const invitesPatchValidator = getValidator(invitesPatchSchema, dataValidator)
export const invitesPatchResolver = resolve({})

// Schema for allowed query properties
export const invitesQuerySchema = {
  $id: 'InvitesQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(invitesSchema.properties)
  }
}
export const invitesQueryValidator = getValidator(invitesQuerySchema, queryValidator)
export const invitesQueryResolver = resolve({})
