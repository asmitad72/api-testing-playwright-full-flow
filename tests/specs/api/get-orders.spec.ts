import { expect, test } from '@playwright/test'
import {
  createOrder,
  deleteAnOrder,
  fetchJwt,
  getAllOrders,
  updateOrder,
} from '../../helpers/api-helper'

test('Get all orders', async ({ request }) => {
  const jwt = await fetchJwt(request)
  const orders = await getAllOrders(request, jwt)

  expect(Array.isArray(orders)).toBe(true)
  expect(orders.length).toBeGreaterThanOrEqual(0)
})

test('Delete an order', async ({ request }) => {
  const jwt = await fetchJwt(request)
  const orderId = await createOrder(request, jwt)

  const response = await deleteAnOrder(request, jwt, orderId)
  expect(response).toBe(true)
})

test('Student cannot update order', async ({ request }) => {
  const jwt = await fetchJwt(request)
  const orderId = await createOrder(request, jwt)

  const response = await updateOrder(request, jwt, orderId, 'INPROGRESS')
  expect(response.status()).toBe(403)
})
