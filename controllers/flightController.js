const Flight = require('../models/Flight');

// @desc   Create new flight
// @route  POST /api/flights/createFlight
// @access Public
exports.createFlight = async (req, res) => {
    try {
        const logoPath = req.file ? `/uploads/${req.file.filename}` : '';

        const newFlight = new Flight({
            ...req.body,
            price: Number(req.body.price),
            logo: logoPath,
        });

        await newFlight.save();
        res.status(201).json(newFlight);
    } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ message: 'Error creating flight' });
    }
};

// ✅ @desc  Update an existing flight
// ✅ @route PUT /api/flights/:id
// ✅ @access Public
exports.updateFlight = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // Agar naya logo file upload hua hai, to logo path ko update karein
        if (req.file) {
            updateData = { ...req.body, logo: `/uploads/${req.file.filename}` };
        }

        const updatedFlight = await Flight.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFlight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json(updatedFlight);
    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ message: 'Error updating flight' });
    }
};
exports.getFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Error fetching flights' });
    }
};
exports.deleteFlight = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFlight = await Flight.findByIdAndDelete(id);

        if (!deletedFlight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Error deleting flight:', error);
        res.status(500).json({ message: 'Error deleting flight' });
    }
};
