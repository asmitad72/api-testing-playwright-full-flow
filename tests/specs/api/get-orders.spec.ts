import { expect, test } from '@playwright/test'
//import { fetchJwt, getAllOrders } from '../../helpers/api-helper'
import {
  createOrder,
  deleteAnOrder,
  fetchJwt,
  getAllOrders,
  updateOrder,
} from '../../helpers/api-helper'

test('Get all orders', async ({ request }) => {
  //Get JWT token
  const jwt = await fetchJwt(request)
  const orders = await getAllOrders(request, jwt)
  expect(Array.isArray(orders))
  expect(orders.length).toBeGreaterThanOrEqual(0)
})

test ( "Delete an order", async ({request} ) => {
  // get jwt token
  const jwt = await fetchJwt(request);
  const orderId = await createOrder(request, jwt);
  const response = await deleteAnOrder(request, jwt, orderId);
  console.log(response);
  expect(response).toBe(true);
});

test.only ( "Student cannot update order", async ({request} ) => {
  // get jwt token
  const jwt = await fetchJwt(request);
  const orderId = await createOrder(request, jwt);
  const response = await updateOrder(request, jwt, orderId, "INPROGRESS");
  console.log(response);
  expect(response.status()).toBe(403);
});