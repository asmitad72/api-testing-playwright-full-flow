import { expect, test } from '@playwright/test'
import {
  updateAnOrder,
  createOrder,
  deleteAnOrder,
  fetchJwt,
  fetchCourierJwt,
  getAllOrders,
  getAllCourierOrders,
  assignOrder,
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
// COURIER Tests

test.describe('Courier role actions', () => {
  test('Courier can get all orders', async ({ request }) => {
    const jwt = await fetchCourierJwt(request)

    const orders = await getAllCourierOrders(request, jwt)
    expect(orders.length).toBeGreaterThan(0)
  })

  test('Courier can update order status', async ({ request }) => {
    const jwt = await fetchJwt(request)
    const jwtCourier = await fetchCourierJwt(request)

    const orderId = await createOrder(request, jwt)
    await assignOrder(request, jwtCourier, orderId)
    const response = await updateAnOrder(request, jwtCourier, orderId, 'INPROGRESS')

    expect(response.status()).toBe(200)
  })

  test('Assign order to courier', async ({ request }) => {
    const jwt = await fetchJwt(request)
    const jwtCourier = await fetchCourierJwt(request)
    const orderID = await createOrder(request, jwt)
    const response = await assignOrder(request, jwtCourier, orderID)
    const data = await response.json()
    expect(response.status()).toBe(200)
    expect(data.id).toBe(orderID)
  })
})
