const bookCarpoolingService = require('../services/bookCarpoolingServices');



const bookCarpooling = async (req, res) => {
    const { requester_id, carpooling_id, requested_seats } = req.body;
    try {
        const booking = await bookCarpoolingService.bookCarpooling({ requester_id, carpooling_id, requested_seats });



        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const confirmBookingRequest = async (req, res) => {
    const { carpooling_id, requester_id, booking_id } = req.body;
    console.log(req.body);
    try {
        const booking = await bookCarpoolingService.confirmBookingRequest(
            req.body
        );
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const cancelBookingRequest = async (req, res) => {
    const { carpooling_id, requester_id, booking_id } = req.body;
    try {
        const booking = await bookCarpoolingService.cancelBookingRequest(
            carpooling_id,
            requester_id,
            booking_id
        );
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    bookCarpooling,
    confirmBookingRequest,
    cancelBookingRequest
}