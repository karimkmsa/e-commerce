import express from 'express';
import * as order from './order.controller.js'
import { protectRoutes } from '../auth/auth.controller.js';
const orderRoute = express.Router();



orderRoute.route("/:id").post(protectRoutes, order.createCacheOrder)
orderRoute.route("/checkout/:id").post(protectRoutes, order.onlinePayment);
orderRoute.route("/").get(protectRoutes, order.getOrder);














export default orderRoute;