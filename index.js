import express from 'express';
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const rooms = [{
        room_name: 'test',
        no_of_seats_available: 100,
        amenities: ['TV', 'fridge', 'AC', 'wifi'],
        price: 5000,
        room_id: '301',
        booking_details: [{
            booking_status: 'complete',
            customer_name: 'henry',
            date: new Date('2023-10-01'),
            start_time: '08:35',
            end_time: '21:35',
        }, ],
    },
    {
        room_name: 'test1',
        no_of_seats_available: 50,
        amenities: ['TV', 'fridge', 'wifi'],
        price: 2000,
        room_id: '302',
        booking_details: [{
            booking_status: 'complete',
            customer_name: 'john',
            date: new Date('2023-12-01'),
            start_time: '01:35',
            end_time: '21:35',
        }, ],
    },
];

// Creating a new room
app.post('/createRoom', (req, res) => {
    const { room_name, no_of_seats_available, amenities, price } = req.body;
    const newRoom = {
        room_name,
        no_of_seats_available,
        amenities,
        price,
        room_id: '303',
    };
    rooms.push(newRoom);
    res.json(rooms);
});

// Booking a new room
app.post('/bookRoom', (req, res) => {
    const { room_id, customer_name, date, start_time, end_time } = req.body;
    const bookingDetails = {
        room_id,
        customer_name,
        date,
        start_time,
        end_time,
        booking_status: 'complete',
    };

    const room = rooms.find((room) => room.room_id === room_id);

    if (!room) {
        res.status(400).send('Invalid room ID');
        return;
    }

    const conflictingBooking = room.booking_details.find(
        (booking) =>
        booking.date === date &&
        booking.start_time === start_time &&
        booking.end_time === end_time
    );

    if (conflictingBooking) {
        res.status(400).send('Please book another slot');
        return;
    }

    room.booking_details.push(bookingDetails);
    res.status(200).send(rooms);
});

// List all rooms
app.get('/getallrooms', (req, res) => {
    const array = [];
    for (const room of rooms) {
        for (const booking of room.booking_details) {
            const {
                room_name,
                booking_status,
                customer_name,
                date,
                start_time,
                end_time,
            } = booking;
            const newObject = {
                'Room Name': room_name,
                'Booked Status': booking_status,
                'Customer Name': customer_name,
                Date: date,
                'Start Time': start_time,
                'End Time': end_time,
            };
            array.push(newObject);
        }
    }
    res.send(array);
});

// List all customers
app.get('/getallcustomers', (req, res) => {
    const array = [];
    for (const room of rooms) {
        for (const booking of room.booking_details) {
            const {
                customer_name,
                room_name,
                date,
                start_time,
                end_time,
            } = booking;
            const newObject = {
                'Customer Name': customer_name,
                'Room Name': room_name,
                Date: date,
                'Start Time': start_time,
                'End Time': end_time,
            };
            array.push(newObject);
        }
    }
    res.send(array);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});