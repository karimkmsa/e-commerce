
import slugify from 'slugify'
import AppError from "../../utils/services/AppError.js";
import catchAsyncError from "../../utils/middleware/catchAyncError.js";
import deleteOne from '../../utils/handlers/refactor.handler.js';
import ApiFeatures from '../../utils/APIFeatures.js';
import { cartModel } from '../../../databases/models/cart.model.js';
import { productModel } from '../../../databases/models/product.model.js';
import { couponModel } from '../../../databases/models/coupon.model.js';



function calcPrice(cart) {
      let totalPrice = 0;
      cart.cartItems.forEach((ele) => {
        totalPrice += ele.quantity * ele.price;
      });

  cart.totalPrice = totalPrice;
  
}


const createCart =  async (req, res, next) => {

  let product = await productModel.findById(req.body.product).select("price")
  !product && next(new AppError("product not found", 404))
  req.body.price = product.price
  let isCartExist = await cartModel.findOne({ user: req.user._id })
  if (!isCartExist) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body]
    });

    calcPrice(cart);
    await cart.save()
   return res.status(201).json({message:"created", cart})

  }
    
    
    let item = isCartExist.cartItems.find((ele) => ele.product == req.body.product)
    console.log(item);
    if (item) {
      item.quantity +=1
    } else {
      isCartExist.cartItems.push(req.body)
    }

    calcPrice(isCartExist);
     if (isCartExist.discount) isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100;

await isCartExist.save()
  res.json({ message: "Done", isCartExist });
  }




const getCart = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id })
  
  res.json({message:"Done",cart})
})


const removeCartItem = catchAsyncError(async (req, res, next) => {
  
  let cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { _id: req.params.id } } }, { new: true })
  calcPrice(cart);

  res.json({message:"deleted" , cart})
})



const updateCart =
    async (req, res, next) => {

  let product = await productModel.findById(req.body.product).select("price")
  !product && next(new AppError("product not found", 404))
  req.body.price = product.price
  let isCartExist = await cartModel.findOne({ user: req.user._id })    
    
    let item = isCartExist.cartItems.find((ele) => ele.product == req.body.product)

      !item && next( new AppError( "doesn't exist", 404))
    if (item) {
      item.quantity =req.body.quantity
    } 
    calcPrice(isCartExist);

await isCartExist.save()
  res.json({ message: "Done", isCartExist });
  }




const applyCoupon = catchAsyncError(async (req, res, next) => {

  let code = await couponModel.findOne({ code: req.params.code });
  let cart = await cartModel.findOne({ user: req.user._id })
  cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * code.discount) / 100;
  cart.discount = code.discount;
  await cart.save();
  res.json({message:"Done", cart})
})














export { createCart, getCart, removeCartItem, updateCart, applyCoupon };