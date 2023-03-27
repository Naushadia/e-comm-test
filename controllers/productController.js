const PDFKit = require("pdfkit");

const fs = require("fs");

const path = require("path");

const pdfDoc = new PDFKit();

const db = require("../models");

const upload = require("../utils/multer");

const Product = db.product;
const { error, success } = require("../utils/responseWrapper");
const { validationResult, Result } = require("express-validator");
const { where } = require("sequelize");

exports.addProductController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { product_name, price, description } = req.body;
    const images = req.files.map(file => file.filename);
    // const images = req.files.map(file => file.originalname);
    // const {originalname} = req.file; // For Single
    console.log(req.file);
    const product = await Product.create({
      product_name,
      price,
      description,
      // imageurl: originalname,
      imageurl: images,
      userId: req.user.id,
    });
    res.send(success(200, "Product Added Successfully"));
  } catch (error) {
    console.error(error);
  }
};

exports.getProductController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const product = await Product.findAll({
      where: { userId: req.user.id },
    });
    res.send(success(200, { product, msg: "Here's The All Products" }));
  } catch (error) {
    console.error(error);
  }
};

exports.getallProductController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const product = await Product.findAll();
    res.send(success(200, { product, msg: "Here's The All Products" }));
  } catch (error) {
    console.error(error);
  }
};

exports.pdfController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.body;
    const product = await Product.findOne({ where: { id } });
    const pdfName = "product_" + product.id + ".pdf";

    const pdfPath = path.join(__dirname, "../", "uploads", pdfName);
    pdfDoc.pipe(fs.createWriteStream(pdfPath));
    pdfDoc.text("API Response", { align: "center" });
    pdfDoc.moveDown();
    pdfDoc.text(`product_name: ${product.product_name}`);
    pdfDoc.text(`price: ${product.price}`);
    pdfDoc.text(`description: ${product.description}`);
    pdfDoc.text(
      `ProductUrl: ${req.protocol}://${req.headers.host}/product/${id}`
    );
    pdfDoc.end();

    return res.send(
      success(200, {
        msg: "PDF generated Sucessfully",
        product,
        pdfPath
      })
    );
  } catch (error) {
    console.error(error);
  }
};

exports.getProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = req.params.id;
  const product = await Product.findOne({ where: { id } });
  return res.send(success(200, { product }));
  } catch (error) {
    console.error(error); 
  }
};
