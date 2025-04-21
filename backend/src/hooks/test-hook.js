// import { ERROR } from 'feathers-knex'

export const testHook = async (context) => {
  // console.log(`Running hook testHook on ${context.path}.${context.method}`)
  console.log(`__________________`)
  console.log(context)
  // ERROR('HHHH')
  throw new Error('oi')
}
