const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const promisify = require("util").promisify;

const hotelValidationInput = require("../validation/hotel");

// Include keys
const keys = require("../config/keys");

cloudinary.config({
  cloud_name: keys.CLOUDINARY.NAME,
  api_key: keys.CLOUDINARY.KEY,
  api_secret: keys.CLOUDINARY.SECRET,
});

//Calling middleware
const middlewareObj = require("../middleware");

//Calling Model
const Hotel = require("../models/hotels");

// Method     GET
// Desc       Get all hotels
// Access     Public
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.render("hotels/index", { hotels });
  } catch (err) {
    console.log(err);
  }
});

// Method     GET
// Desc       Get Add hotel page
// Access     Private - Logged in user only
router.get("/add", middlewareObj.isLoggedIn, async (req, res) => {
  res.render("hotels/add");
});

// Method     POST
// Desc       Create new hotel
// Access     Private - Logged in user only
router.post(
  "/",
  /* middlewareObj.isLoggedIn,*/ async (req, res) => {
    const { isValid, errors } = hotelValidationInput(req.body, req.files);
    if (!isValid) {
      Object.entries(errors).forEach(([key, value]) =>
        req.flash("error", value)
      );
      res.redirect("/hotels/add");
      return;
    }
    const name = req.body.name;
    const image = req.files.image;
    const detail = req.body.detail;
    const description = req.body.description;
    const hotel = { name, detail, description };

    const localUploadPath = "./upload/image/temp";

    const uploadImage = promisify(image.mv);
    try {
      const uploadCompletePath = `${localUploadPath}/${image.name}`;
      await uploadImage(uploadCompletePath);
      const createdHotel = await Hotel.create(hotel);
      const uploadedImage = await cloudinary.uploader.upload(
        uploadCompletePath,
        {
          public_id: createdHotel._id,
          folder: "/chillhotel/hotel",
        }
      );
      console.log(uploadedImage);
      createdHotel.image = uploadedImage.url;
      createdHotel.author.id = req.user.id;
      createdHotel.author.username = req.user.username;
      console.log(createdHotel);
      await createdHotel.save();
      res.redirect("/hotels");
    } catch (err) {
      console.log(err);
    }
    req.flash("error", "Password is not match");
    return;
  }
);

// Method     GET
// Desc       Get hotel base on id parameter
// Access     Public
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("comments");
    res.render("hotels/show", { hotel });
  } catch (err) {
    console.log(err);
  }
});

// Method     GET
// Desc       Get Edit Page
// Access     Private - Logged in user only
router.get("/:id/edit", middlewareObj.checkHotelOwnership, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.render("hotels/edit", { hotel: foundHotel });
  } catch (err) {
    console.log(err);
  }
});

// Method     PUT
// Desc       Edit data of hotel
// Access     Private - Logged in user only
router.put("/:id", middlewareObj.checkHotelOwnership, async (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const detail = req.body.detail;
  const description = req.body.description;
  const updatedHotel = {
    name: name,
    image: image,
    detail: detail,
    description: description,
  };
  try {
    await Hotel.findByIdAndUpdate(req.params.id, updatedHotel);
    res.redirect("/hotels/" + req.params.id);
  } catch (err) {
    console.log(err);
  }
});

// Method     DELETE
// Desc       Delete Hotel
// Access     Private - Logged in user only
router.delete("/:id", middlewareObj.checkHotelOwnership, async (req, res) => {
  try {
    await Hotel.findByIdAndRemove(req.params.id);
    res.redirect("/hotels");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
