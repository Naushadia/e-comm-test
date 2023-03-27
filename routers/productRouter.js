const router = require('express').Router();
const productController = require("../controllers/productController");
const { body } = require("express-validator");
const requireUser = require("../middleware/requireUser");
const upload = require("../utils/multer")

router.post('/create-product',requireUser,upload.array("image"),function(req,res,next) {
    next();
},productController.addProductController);
router.get('/all-product',requireUser,productController.getProductController);
router.get('/all-getproduct',requireUser,productController.getallProductController);

router.get('/pdf',requireUser,productController.pdfController);
router.get('/product/:id',productController.getProduct)

module.exports = router;