
import slugify from 'slugify'
import AppError from "../../utils/services/AppError.js";
import catchAsyncError from "../../utils/middleware/catchAyncError.js";
import { brandModel } from '../../../databases/models/brand.model.js';
import deleteOne from '../../utils/handlers/refactor.handler.js';
import ApiFeatures from '../../utils/APIFeatures.js';




const createBrand = catchAsyncError(async (req, res, next) => {

  req.body.slug = slugify(req.body.name); 
  req.body.logo = req.file.filename;
  let results = new brandModel(req.body);
  let added = await results.save();
  res.status(201).json({ message: "added", added });
});


const getAllBrand = catchAsyncError(async (req, res, next) => {
     let apiFeature = new ApiFeatures(brandModel.find(), req.query).pagination().sort().search().fields();
     let results = await apiFeature.mongooseQuery;
  res.json({ message: "Done", results });
});

const getBrandById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let results = await brandModel.findById(id);
  res.json({ message: "Done", results });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
 req.body.slug = slugify(req.body.name)
  if (req.file) req.body.logo = req.file.filename;
  let results = await brandModel.findByIdAndUpdate(id, req.body, { new: true });
  !results && next(new AppError("not found Brand", 404));
  results && res.json({ message: "Done", results });
});

const deleteBrand = deleteOne(brandModel);
export {
    createBrand,
    getAllBrand,
    getBrandById,
    updateBrand,
    deleteBrand




























}