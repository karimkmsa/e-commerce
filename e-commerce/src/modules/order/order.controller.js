
import slugify from 'slugify'
import AppError from "../../utils/services/AppError.js";
import catchAsyncError from "../../utils/middleware/catchAyncError.js";
import deleteOne from '../../utils/handlers/refactor.handler.js';
import ApiFeatures from '../../utils/APIFeatures.js';
import { orderModel } from '../../../databases/models/order.model.js';
import { cartModel } from '../../../databases/models/cart.model.js';
import { productModel } from '../../../databases/models/product.model.js';
import Stripe from "stripe";
const stripe = new Stripe("sk_test_51N9sq0FdpscXN88i6ODiMOykcjMCelk6MbCnifHv3ZGoBBAfoCOeunOilTyVvYvC6tbzEfZFIgxXGzm0ZHCWw77B00OxoHFxTx");


const createCacheOrder = catchAsyncError(async(req, res, nex) => {
  let cart = await cartModel.findById(req.params.id);
  let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
  let order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,

  });
  if (order) {
    
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      }
    }));

    await productModel.bulkWrite(options);
    await order.save()
  } else {
    return next(new AppError("error occur" , 409))
  }
  await cartModel.findByIdAndDelete(req.params.id);
  res.json({message:"Done", order})
})


const getOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel.findOne({ user: req.user._id }).populate("cartItems.product");
  res.json({message:"Done" , order})
})


const getAllOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel.find({ user: req.user._id });
  res.json({ message: "Done", order });
});



const onlinePayment = catchAsyncError(async (req, res, next) => {



    let cart = await cartModel.findById(req.params.id);
    let totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
console.log(onlinePayment);
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://www.google.com/?hl=ar",
    cancel_url: "https://www.google.com/?hl=ar",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress
  });


  res.json({message:"Done", session})
})



















export { createCacheOrder, getOrder, getAllOrder, onlinePayment };