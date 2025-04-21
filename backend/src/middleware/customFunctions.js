import Stripe from 'stripe'
const stripe = new Stripe(
  'sk_test_51J2aAWFspVtjhCfbN34H5Lp4LLqYXhxY0866Dd0pjbYHyxVZbnbbhTSbimMb09hDZJ4zXSNMSysWXheojcXWD4Az00EQwVsu90'
)

export const createStripeCustomer = async (req, res) => {
  const { name } = req.body

  // return res.json(name)

  try {
    const customer = await stripe.customers.create({ name })
    res.json({ success: true, customer })
  } catch (error) {
    res.json(error)
  }

  // res.send('test function working')
}

export const createSubscription = async (req, res) => {
  const { customerId, payment_method, price } = req.body
  // const price = 'price_1McAupFspVtjhCfbfmyyPKzk'

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price }],
      default_payment_method: payment_method
    })

    res.json({ success: true, subscription })
  } catch (error) {
    res.json(error)
  }
}

export const createSetupIntent = async (req, res) => {
  // const customerId = 'cus_NNGinRnTbUDBaT'

  try {
    const setupIntent = await stripe.setupIntents.create({
      // customer: customerId,
      payment_method_types: ['card']
    })

    res.json(setupIntent)
  } catch (error) {
    res.json(error)
  }
}

export const createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true }
    })

    res.json(paymentIntent)
  } catch (error) {
    res.json(error)
  }
}

export const attachPaymentMethod = async (req, res) => {
  const { customerId, payment_method } = req.body

  // const customerId = 'cus_NNnwGBWEb6g5jj'
  // const payment_method = 'pm_1Md2KBFspVtjhCfbXyfRamWC'

  console.log({ customerId, payment_method })

  try {
    const result = await stripe.paymentMethods.attach(payment_method, { customer: customerId })
    res.json({ success: true, result, customerId, payment_method })
  } catch (error) {
    res.json(error)
  }
}

export const getCustomer = async (req, res) => {
  const { customerId } = req.body

  try {
    const customer = await stripe.customers.retrieve(customerId)
    res.json(customer)
  } catch (error) {
    res.json(error)
  }
}

export const getCustomerPaymentMethods = async (req, res) => {
  const { customerId } = req.body

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    })

    res.json(paymentMethods)
  } catch (error) {
    res.json(error)
  }
}

// export const createSubscription = async (req, res) => {
//   try {

//   } catch (error) {
//     res.json(error)
//   }
// }
