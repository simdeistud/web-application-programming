const express = require("express");
const { authenticate } = require('../middleware/auth.middleware.js');
const { getDb, idFromString } = require("../config/db.js");

const router = express.Router();

// GET  /api/fields?q=query  List of sports fields (searchable)
router.get("", async (req, res) => {
    try {
        const q = req.query.q || "";
        const fields = await getDb()
            .collection("fields")
            .find({
                name: { $regex: q, $options: "i" } // "i" stands for case insensitive match
            })
            .toArray();
        if (!fields || fields.length === 0) {
            return res.status(404).json({ error: "No fields found" });
        }
        const trimmed = fields.map(({ _id, name }) => ({ _id, name }))
        return res.status(200).json({ trimmed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/fields/:id  Field details
router.get("/:id", async (req, res) => {
    try {
        const id = idFromString(req.params.id);
        const field = await getDb()
            .collection("fields")
            .findOne({ _id: id });
        if (!field) {
            return res.status(404).json({ error: "Field not found" });
        }
        return res.status(200).json({ field });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET  /api/fields/:id/slots?date=YYYY-MM-DD  Availability for a specific date
router.get("/:id/slots", async (req, res) => {
    try {
        const field_id = idFromString(req.params.id);
        const date = req.query.date || "";
        const slots = await getDb()
            .collection("slots")
            .find({
                field_id: field_id,
                slot_date: date,
            })
            .toArray();
        for (const slot of slots) {
            const found = await getDb()
                .collection("bookings")
                .findOne({ slot_id: slot._id });
            slot.booked = !!found;
        }
        const availableSlots = slots.filter(slot => slot.booked === false);
        return res.status(200).json({ slots: availableSlots });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// POST /api/fields/:id/bookings
router.post("/:id/bookings", authenticate, async (req, res) => {
    try {
        const slot_id = idFromString(req.body.slot_id);
        const username = req.body.username;

        if (!slot_id) {
            return res.status(400).json({ error: "Slot id not specified " });
        }

        const slot = await getDb().collection("slots").findOne({ _id: slot_id });
        if (!slot) {
            return res.status(404).json({ error: "Slot not found." });
        }
        const now = new Date();
        const slotDateTime = new Date(`${slot.slot_date}T${slot.start_time}:00`);
        if (slotDateTime < now) {
            return res.status(400).json({ error: "Cannot book past slots" });
        }
        if (await getDb().collection("bookings").findOne({ slot_id: slot_id })) {
            return res.status(409).json({ error: "Slot already booked" });
        }

        await getDb().collection("bookings").insertOne({
            slot_id: slot_id,
            booker: username
        });
        const booking = await getDb().collection("bookings").findOne({ slot_id: slot_id });

        return res.status(200).json({
            message: "Slot booked",
            slot: slot,
            booking: booking
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});



// DELETE /api/fields/:id/bookings/:bookingId
router.delete("/:id/bookings/:bookingId", authenticate, async (req, res) => {
    try {
        const booking_id = idFromString(req.params.bookingId);
        const requester = req.body.username;

        if (!booking_id) {
            return res.status(400).json({ error: "Booking id not specified " });
        }

        const booking = await getDb().collection("bookings").findOne({ _id: booking_id });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (booking.booker !== requester) {
            return res.status(403).json({ error: "You cannot cancel this booking" });
        }

        await getDb().collection("bookings").deleteOne({ _id: booking_id });

        return res.status(200).json({
            message: "Booking cancelled"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
