const express = require("express");
const router = express.Router();

// GET  /api/fields?q=query  List of sports fields (searchable)
router.get("", async (req, res) => {
    try {
        const q = req.query.q || "";
        const fields = await db.client
            .db("calcetto")
            .collection("fields")
            .find({
                name: { $regex: q, $options: "i" } // "i" stands for case insensitive match
            })
            .toArray();
        return res.status(200).json({ fields });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});



// GET /api/fields/:id  Field details
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const field = await db.client
            .db("calcetto")
            .collection("fields")
            .findOne({ id: id });
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
router.get("", (req, res) => {

});


// POST /api/fields/:id/bookings
router.post("/:id/bookings", authenticate, async (req, res) => {
    try {
        const fieldId = req.params.id;
        const { slot_id } = req.body;
        const username = req.body.username;

        if (!slot_id) {
            return res.status(400).json({ error: "slot_id is required" });
        }

        const col = db.client.db("calcetto").collection("booking_slots");

        const slot = await col.findOne({ slot_id, field_id: fieldId });
        if (!slot) {
            return res.status(404).json({ error: "Slot not found for this field" });
        }

        const now = new Date();
        const slotDateTime = new Date(`${slot.slot_date}T${slot.start_time}:00`);
        if (slotDateTime < now) {
            return res.status(400).json({ error: "Cannot book past slots" });
        }

        if (slot.booker !== null) {
            return res.status(409).json({ error: "Slot already booked" });
        }

        await col.updateOne(
            { slot_id },
            { $set: { booker: username } }
        );

        return res.status(200).json({
            message: "Slot booked",
            slot_id,
            booker: username
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});



// DELETE /api/fields/:id/bookings/:bookingId
router.delete("/:id/bookings/:bookingId", authenticate, async (req, res) => {
    try {
        const fieldId = req.params.id;
        const bookingId = req.params.bookingId;
        const requester = req.body.username;

        const col = db.client.db("calcetto").collection("booking_slots");

        const slot = await col.findOne({ slot_id: bookingId, field_id: fieldId });
        if (!slot) {
            return res.status(404).json({ error: "Booking slot not found" });
        }

        if (slot.booker !== requester) {
            return res.status(403).json({ error: "You cannot cancel this booking" });
        }

        await col.updateOne(
            { slot_id: bookingId },
            { $set: { booker: null } }
        );

        return res.status(200).json({
            message: "Booking cancelled",
            slot_id: bookingId
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
