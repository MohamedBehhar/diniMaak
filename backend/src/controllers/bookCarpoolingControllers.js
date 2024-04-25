const bookCarpoolingService = require('../services/bookCarpoolingServices');



const bookCarpooling = async (req, res) => {
    const { user_id, carpooling_id, numberOfSeats } = req.body;
    try {
        const booking = await bookCarpoolingService.bookCarpooling({ user_id, carpooling_id, numberOfSeats });

        io.emit('newBooking', booking);


        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    bookCarpooling,
}