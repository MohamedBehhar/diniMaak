const carServices = require('../services/carServices');

const getCarBrand = async (req, res) => {
  try {
    const brand = req.params.brand;
    const result = await carServices.getCarBrand(brand);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getCarByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await carServices.getCarByUserId(user_id);
    res.status(200).send(
      {
        status: 200,
        data: result
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const addCar = async (req, res) => {
  const requiredFields = ['brand', 'year', 'plate', ];
  try {
    const car = {
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      plate: req.body.plate,
      user_id: req.body.user_id,
      image: req.file ? `/public/cars/${req.file.filename}` : null, // Add the file path here
    };
    // Find missing fields
    const missingFields = requiredFields.filter(field => !car[field]);

    // If any fields are missing, return a 400 error with dynamic messages
    if (missingFields.length) {
      const errorMessages = missingFields.reduce((acc, field) => {
        acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        return acc;
      }, {});

      return res.status(400).json({
        status: 400,
        error: errorMessages
      });
    }
    const result = await carServices.addCar(car);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const editCar = async (req, res) => {
  try {
    const car = {
      car_id: req.body.car_id,
      brand: req.body.brand,
      year: req.body.year,
      plate: req.body.plate,
      image: req.file ? `/public/cars/${req.file.filename}` : null, // Add the file path here
    };
    const result = await carServices.editCar(car);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



module.exports = {
  getCarBrand,
  addCar,
  getCarByUserId,
  editCar
}
