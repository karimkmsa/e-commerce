import express from 'express';
import * as productController from './product.controller.js'
import { uploadMixFiles } from '../../utils/middleware/fileUploads.js';
import { allowTo, protectRoutes } from '../auth/auth.controller.js';
const productRouter = express.Router();


productRouter
  .route("/")
  .get(productController.getAllProduct)
  .post(
    protectRoutes,
    uploadMixFiles("product", [
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 8 },
    ]),
    productController.createProduct
  );


productRouter.route("/:id")
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);





export default productRouter;