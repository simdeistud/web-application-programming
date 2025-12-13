const express = require("express");
const router = express.Router();

// GET  /api/fields?q=query  List of sports fields (searchable)
router.get("", (req, res) => {});

// GET  /api/fields/:id  Field details
router.get("", (req, res) => {});

// GET  /api/fields/:id/slots?date=YYYY-MM-DD  Availability for a specific date
router.get("", (req, res) => {});

// POST  /api/fields/:id/bookings  Book a slot (authenticated)
router.post("", (req, res) => {});

// DELETE  /api/fields/:id/bookings/:bookingId  Cancel a booking (authenticated)
router.delete("", (req, res) => {});

module.exports = router;
