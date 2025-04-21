// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const robotsSchema = {
  $id: 'Robots',
  type: 'object',
  additionalProperties: false,
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
export const robotsResolver = resolve({})
export const robotsExternalResolver = resolve({})

// Schema for creating new data
export const robotsDataSchema = {
  $id: 'RobotsData',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    text: {
      type: 'string'
    }
  }
}
export const robotsDataValidator = getValidator(robotsDataSchema, dataValidator)
export const robotsDataResolver = resolve({})

// Schema for updating existing data
export const robotsPatchSchema = {
  $id: 'RobotsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...robotsSchema.properties
  }
}
export const robotsPatchValidator = getValidator(robotsPatchSchema, dataValidator)
export const robotsPatchResolver = resolve({})

// Schema for allowed query properties
export const robotsQuerySchema = {
  $id: 'RobotsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(robotsSchema.properties)
  }
}
export const robotsQueryValidator = getValidator(robotsQuerySchema, queryValidator)
export const robotsQueryResolver = resolve({})
