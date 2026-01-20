import { expect, test } from '@playwright/test'
import {
  updateAnOrder,
  createOrder,
  deleteAnOrder,
  fetchJwt,
  getAllOrders,
} from '../../helpers/api-helper'

test('Get all orders', async ({ request }) => {
  // get jwt token
  const jwt = await fetchJwt(request)
  // get all orders using jwt token
  const orders = await getAllOrders(request, jwt)
  expect(Array.isArray(orders))
  expect(orders.length).toBeGreaterThanOrEqual(0)
})

test('Delete an order', async ({ request }) => {
  // get jwt token
  const jwt = await fetchJwt(request)
  const orderId = await createOrder(request, jwt)
  const response = await deleteAnOrder(request, jwt, orderId)
  console.log(response)
  expect(response).toBe(true)
})

test('Update an order with student role should not be allowed, code 403', async ({ request }) => {
  // get jwt token
  const jwt = await fetchJwt(request)
  const orderId = await createOrder(request, jwt)
  const response = await updateAnOrder(request, jwt, orderId, 'INPROGRESS')
  console.log(response)
  expect(response.status()).toBe(403)
})

test('Student cannot change order status to DELIVERED', async ({ request }) => {
  const jwt = await fetchJwt(request)
  const orderId = await createOrder(request, jwt)

  const response = await updateAnOrder(request, jwt, orderId, 'DELIVERED')
  expect(response.status()).toBe(403)
})

test('Create two orders and validate get all orders', async ({ request }) => {
  const jwt = await fetchJwt(request)

  await createOrder(request, jwt)
  await createOrder(request, jwt)

  const orders = await getAllOrders(request, jwt)
  expect(orders.length).toBeGreaterThanOrEqual(2)
})
