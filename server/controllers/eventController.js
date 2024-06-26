const { Event } = require("../models/event");
const { Payment } = require("../models/payment");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
    let eventData = req.body;
    try {
        let existEvent = await Event.exists({ title: eventData.title });

        if (existEvent) {
            return res
                .status(403)
                .json({ errors: { title: "This event already exists" } });
        }

        const totalParticipants = eventData.participants.length;
        const individualCost = eventData.eventCost / totalParticipants;

        const participantsWithCosts = eventData.participants.map(
            (participant) => ({
                participant: participant,
                participantCost: individualCost,
            })
        );

        let event = new Event({
            title: eventData.title,
            createdBy: eventData.createdBy,
            eventCost: eventData.eventCost,
            remainingCost: eventData.eventCost,
            participants: participantsWithCosts,
        });

        let savedEvent = await event.save();
        res.json({ event: savedEvent });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errors = {};
            Object.keys(error.errors).map((key) => {
                errors[key] = error.errors[key].message;
            });

            res.status(400).json({ errors: errors });
        } else {
            res.status(500).json({ error: error.toString() });
        }
    }
};

const getAllEvents = async (req, res) => {
    try {
        let events = await Event.find();
        res.json({ events });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errors = {};
            Object.keys(error.errors).map((key) => {
                errors[key] = error.errors[key].message;
            });

            res.status(400).json({ errors: errors });
        } else {
            res.status(500).json({ error: error.toString() });
        }
    }
};
const createPayment = async (req, res) => {
    let paymentData = req.body;
    console.log(paymentData);
    let eventId = req.body.eventId;
    try {
        let event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.remainingCost -= paymentData.paymentAmount;

        await event.save();
        console.log("comentario" + paymentData.comment);
        let payment = new Payment({
            eventId: eventId,
            payer: paymentData.userName,
            paymentAmount: paymentData.paymentAmount,
            comment: paymentData.comment,
        });

        let savedPayment = await payment.save();
        res.json({ payment: savedPayment });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errors = {};
            Object.keys(error.errors).map((key) => {
                errors[key] = error.errors[key].message;
            });
            console.log("soy un error 400");
            console.log(JSON.stringify(errors, null, 2));
            res.status(400).json({ errors: errors });
        } else {
            console.log("aca");
            console.log(error.toString());
            res.status(500).json({ error: error.toString() });
        }
    }
};

const getPaymentsByEvent = async (req, res) => {
    let eventId = req.params.eventId;
    try {
        let payments = await Payment.find({ eventId });
        res.json({ payments });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errors = {};
            Object.keys(error.errors).map((key) => {
                errors[key] = error.errors[key].message;
            });

            res.status(400).json({ errors: errors });
        } else {
            res.status(500).json({ error: error.toString() });
        }
    }
};
const deleteEvent = async (req, res) => {
    let eventId = req.params.eventId;
    try {
        await Payment.deleteMany({ eventId });
        await Event.findByIdAndDelete(eventId);
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deletePayment = async (req, res) => {
    let paymentId = req.params.paymentId;
    try {
        await Payment.findByIdAndDelete(paymentId);
        res.json({ message: "Payment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    createPayment,
    getPaymentsByEvent,
    deleteEvent,
    deletePayment,
};
