import { APIRequestContext, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const loginPathCourier = "login/courier";
const orderPath = 'orders'

export async function fetchJwt(request: APIRequestContext): Promise<string> {
  const authResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  if (authResponse.status() !== StatusCodes.OK) {
    throw new Error(`Authorization failed. Status: ${authResponse.status()}`)
  }
  return await authResponse.text()
}

export async function fetchCourierJwt(request: APIRequestContext): Promise<string> {
  const authResponse = await request.post(`${serviceURL}${loginPathCourier}`, {
    data: LoginDto.createCourierLoginWithCorrectData(),
  })
  if (authResponse.status() !== StatusCodes.OK) {
    throw new Error(`Authorization failed. Status: ${authResponse.status()}`)
  }
  return await authResponse.text()
}

export async function createOrder(request: APIRequestContext, jwt: string): Promise<number> {
  const response = await request.post(`${serviceURL}${orderPath}`, {
    data: OrderDto.createOrderWithRandomData(),
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  return responseBody.id
}

export async function getOrderById(
  request: APIRequestContext,
  jwt: string,
  id: number,
): Promise<OrderDto> {
  const response = await request.get(`${serviceURL}${orderPath}/${id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.json()
  return new OrderDto(
    data.status,
    data.courierId,
    data.customerName,
    data.customerPhone,
    data.comment,
    data.id,
  )
}

export async function getAllOrders(request: APIRequestContext, jwt: string): Promise<OrderDto[]> {
  const response = await request.get(`${serviceURL}${orderPath}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.json()
  const orders = data.map(
    (order: OrderDto) =>
      new OrderDto(
        order.status,
        order.courierId,
        order.customerName,
        order.customerPhone,
        order.comment,
        order.id,
      ),
  )
  return orders
}

export async function deleteAnOrder(
  request: APIRequestContext,
  jwt: string,
  orderId: number,
): Promise<boolean> {
  const response = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const data = await response.json()
  return data
}

export async function updateAnOrder(
  request: APIRequestContext,
  jwt: string,
  orderId: number,
  status: string,
): Promise<any> {
  const response = await request.put(`${serviceURL}${orderPath}/${orderId}/status`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      status: status,
    },
  })
  //expect(response.status()).toBe(StatusCodes.OK);
  //const data = await response.json();
  //return data;
  return response
}
