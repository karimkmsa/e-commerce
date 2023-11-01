import express from 'express';
import * as cart from './cart.controller.js'
import { protectRoutes } from '../auth/auth.controller.js';
const cartRouter = express.Router();



cartRouter.route("/").post(protectRoutes, cart.createCart).get(protectRoutes,cart.getCart);
cartRouter.route("/:id").delete(protectRoutes,cart.removeCartItem);

cartRouter.put("/:code",protectRoutes,cart.applyCoupon)











export default cartRouter;