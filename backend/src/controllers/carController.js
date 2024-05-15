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

const addCar = async (req, res) => {
  try {
    const car = {
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      plate: req.body.plate,
	  user_id: req.body.user_id,
      profile_picture: req.file.path, // Add the file path here
    };
    console.log('car: ', car);
    const result = await carServices.addCar(car);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getCarBrand,
  addCar,
}
