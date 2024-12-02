const express = require("express");
const { createClient } = require("redis");
const { promisify } = require("util");
const kue = require("kue");

const app = express();
const client = createClient();
const queue = kue.createQueue();

const reserveSeat = (number) => {
    client.set("available_seats", number);
};

const getCurrentAvailableSeats = async () => {
    const getAsync = promisify(client.get).bind(client);
    const seats = await getAsync("available_seats");
    return parseInt(seats);
};

let reservationEnabled = true;

app.get("/available_seats", async (req, res) => {
    const seats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: seats });
});

app.get("/reserve_seat", (req, res) => {
    if (!reservationEnabled) {
        res.json({ status: "Reservation are blocked" });
        return;
    }

    const job = queue.create("reserve_seat").save((err) => {
        if (err) {
            res.json({ status: "Reservation failed" });
            return;
        }
        res.json({ status: "Reservation in process" });
    });

    job.on("complete", () => {
        console.log(`Seat reservation job ${job.id} completed`);
    }).on("failed", (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
});

app.get("/process", (req, res) => {
    res.json({ status: "Queue processing" });

    queue.process("reserve_seat", async (job, done) => {
        const seats = await getCurrentAvailableSeats();
        if (seats <= 0) {
            reservationEnabled = false;
            done(new Error("Not enough seats available"));
            return;
        }

        reserveSeat(seats - 1);
        if (seats - 1 === 0) {
            reservationEnabled = false;
        }
        done();
    });
});

app.listen(1245, () => {
    console.log("Server is running on port 1245");
    reserveSeat(50);
});
