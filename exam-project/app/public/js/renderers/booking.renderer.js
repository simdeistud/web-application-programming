function attachSlotEventListeners(htmlElement) {
    const list = htmlElement.querySelector('#slots-list');
    if (!list) return;
    const items = list.querySelectorAll(':scope > li');

    items.forEach(li => {
        li.addEventListener('click', async () => {
            try {
                const slot_id = li.getAttribute('data-slot-id').split('-')[1];
                const res = await fetch(`http://localhost:3000/api/fields/test/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ slot_id })
                });
                if (!res.ok) {
                    alert('Failed to book the slot.');
                    return;
                }
                alert('Slot booked successfully!');
            } catch (err) {
                console.error('Request failed:', err);
            }
        });
    });
}

function attachBookingEventListeners(htmlElement) {
    const list = htmlElement.querySelector('#bookings-list');
    if (!list) return;
    const items = list.querySelectorAll(':scope > li');

    items.forEach(li => {
        li.addEventListener('click', async () => {
            try {
                const booking_id = li.getAttribute('data-booking-id').split('-')[1];
                const res = await fetch(`http://localhost:3000/api/fields/test/bookings/${booking_id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) {
                    alert('Failed to cancel the booking.');
                    return;
                }
                alert('Booking cancelled successfully!');
            } catch (err) {
                console.error('Request failed:', err);
            }
        });
    });
}

// Renders a list of available slots for booking
export function renderSlotsList(slots, htmlElement) {
    let content = '';
    if (!slots || slots.length === 0) {
        content = '<p>No slots available..</p>';
        htmlElement.innerHTML = content;
        return;
    }

    content += `<h2>Available Slots for [${slots[0].slot_date}]:</h2>`;
    content += '<ul id="slots-list">';
    slots.forEach(slot => {
        content += `<li data-slot-id="slot-${slot._id}"><label>${slot.start_time} - ${slot.end_time}</label><button type="button"">Book Slot</button></li>`;
    });
    content += '</ul>';
    htmlElement.innerHTML = content;
    attachSlotEventListeners(htmlElement);
}

// Renders already booked slots
export function renderBookingsList(bookings, htmlElement) {
    let content = '';
    if (!bookings || bookings.length === 0) {
        content = '<p>No bookings available..</p>';
        htmlElement.innerHTML = content;
        return;
    }

    content += `<h2>Booked Slots:</h2>`;
    content += '<ul id="bookings-list">';
    bookings.forEach(booking => {
        content += `<li data-booking-id="slot-${booking._id}"><label>${booking.slot_date}</label>: <label>${booking.start_time} - ${booking.end_time}</label><button type="button" class="btn-cancel-booking">Cancel Booking</button></li>`;
    });
    content += '</ul>';
    htmlElement.innerHTML = content;
    attachBookingEventListeners(htmlElement);
}