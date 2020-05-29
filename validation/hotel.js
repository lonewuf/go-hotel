const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function hotelValidationInput(data, image) {
  let errors = {};
  // const hotel = { name, image, detail, description };
  data.name = !isEmpty(data.name) ? data.name : "";
  data.detail = !isEmpty(data.detail) ? data.detail : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.name)) errors.name = "Name is required";

  if (Validator.isEmpty(data.detail)) errors.detail = "Detail is required";

  if (Validator.isEmpty(data.description))
    errors.description = "Description is required";

  if (isEmpty(image)) {
    errors.image = "Image is required";
  } else {
    switch (image.image.mimetype) {
      case "image/jpeg":
        break;
      case "image/jpg":
        break;
      case "image/png":
        break;
      default:
        errors.image =
          "File is not image. Please upload only jpg, jpeg and png format.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
