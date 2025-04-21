// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, querySyntax, getValidator } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: true,
  required: ['_id', 'email'],
  properties: {
    _id: {
      type: 'string'
    },
    email: { type: 'string' },
    password: { type: 'string' }
  }
}
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new users
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: true,
  required: ['email', 'password'],
  properties: {
    ...userSchema.properties
  }
}
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing users
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: true,
  required: [],
  properties: {
    ...userSchema.properties
  }
}
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties)
  }
}
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    // if (context.params.user) {
    //   return context.params.user._id
    // }
    return value
  }
})
