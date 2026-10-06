require('dotenv').config();
const Stripe = require('stripe');

async function testCheckout() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const shopUrl = 'http://localhost:3000/shop-api';
  let token = null;

  async function gql(query, variables = {}) {
    const res = await fetch(shopUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query, variables })
    });
    const newToken = res.headers.get('vendure-auth-token');
    if (newToken) {
      token = newToken;
    }
    return res.json();
  }

  console.log('1. Getting product variants...');
  const productsRes = await gql(`query { products(options: { take: 1 }) { items { id name variants { id price } } } }`);
  const variantId = productsRes.data.products.items[0].variants[0].id;
  console.log('Product variant ID:', variantId);

  console.log('2. Adding item to order...');
  const addRes = await gql(`mutation AddItem($id: ID!) { addItemToOrder(productVariantId: $id, quantity: 1) { ... on Order { id code state totalWithTax } } }`, { id: variantId });
  console.log('Order created:', addRes.data.addItemToOrder.code, 'State:', addRes.data.addItemToOrder.state, 'Total:', addRes.data.addItemToOrder.totalWithTax, 'Token:', token);

  console.log('3. Setting customer...');
  const custRes = await gql(`mutation { setCustomerForOrder(input: { firstName: "Marco", lastName: "Polo", emailAddress: "marco.polo@venezia.it" }) { ... on Order { id } ... on ErrorResult { errorCode message } } }`);
  console.log('Customer res:', JSON.stringify(custRes.data), 'Token:', token);

  console.log('4. Setting shipping address...');
  const addrRes = await gql(`mutation { setOrderShippingAddress(input: { fullName: "Marco Polo", streetLine1: "Rialto 42", city: "Venezia", postalCode: "30124", countryCode: "IT" }) { ... on Order { id shippingAddress { countryCode } } ... on ErrorResult { errorCode message } } }`);
  console.log('Shipping address res:', JSON.stringify(addrRes.data), 'Token:', token);

  console.log('5. Setting shipping method...');
  const shippingMethodsRes = await gql(`query { eligibleShippingMethods { id price name description } }`);
  console.log('Eligible shipping methods:', shippingMethodsRes.data?.eligibleShippingMethods?.length);
  const shippingMethodId = shippingMethodsRes.data.eligibleShippingMethods[0].id;
  const shipRes = await gql(`mutation SetShipping($ids: [ID!]!) { setOrderShippingMethod(shippingMethodId: $ids) { ... on Order { id state shippingLines { shippingMethod { name } } } ... on ErrorResult { errorCode message } } }`, { ids: [shippingMethodId] });
  console.log('Set shipping result:', JSON.stringify(shipRes.data));

  console.log('6. Transitioning to ArrangingPayment...');
  const transRes = await gql(`mutation { transitionOrderToState(state: "ArrangingPayment") { ... on Order { id state } ... on OrderStateTransitionError { errorCode message transitionError } } }`);
  console.log('Order state:', transRes.data?.transitionOrderToState);

  console.log('7. Creating Stripe Payment Intent...');
  const piRes = await gql(`mutation { createStripePaymentIntent }`);
  const clientSecret = piRes.data?.createStripePaymentIntent;
  console.log('Stripe client secret received:', !!clientSecret);
  const paymentIntentId = clientSecret.split('_secret_')[0];
  console.log('PaymentIntent ID:', paymentIntentId);

  console.log('8. Confirming payment via Stripe (pm_card_visa)...');
  const confirmedPi = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: 'pm_card_visa',
    return_url: 'http://localhost:3001/checkout'
  });
  console.log('Stripe PaymentIntent status:', confirmedPi.status);

  console.log('9. Adding payment to Vendure order...');
  const payRes = await gql(`mutation AddPay($piId: String!) { addPaymentToOrder(input: { method: "stripe", metadata: { paymentIntentId: $piId } }) { ... on Order { id code state payments { id state method amount } } ... on ErrorResult { errorCode message } } }`, { piId: paymentIntentId });
  console.log('Final Order Result:', JSON.stringify(payRes.data?.addPaymentToOrder, null, 2));
}

testCheckout().catch(console.error);
