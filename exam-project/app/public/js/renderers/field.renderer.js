import { renderSlotsList } from './booking.renderer.js';

function attachFieldListeners(htmlElement) {
    const list = htmlElement.querySelector('#fields-list');
    if (!list) return;
    const items = list.querySelectorAll(':scope > li');

    items.forEach(li => {
        li.addEventListener('click', async () => {
            try {
                const fieldId = li.getAttribute('data-field-id').split('-')[1];
                const res = await fetch(`http://localhost:3000/api/fields/${fieldId}`, { method: 'GET' });
                const frame = document.querySelector('main');
                if (!res.ok) {
                    frame.innerHTML = `<p>Error loading field details.</p>`;
                    return;
                }
                const fieldDetails = await res.json();
                renderField(fieldDetails.field, frame);
            } catch (err) {
                console.error('Request failed:', err);
            }
        });
    });
}

export function renderFieldsList(data, htmlElement) {
    let content = '';
    if (!data || data.length === 0) {
        content = '<p>No fields found.</p>';
        return content;
    }

    content += '<ul id="fields-list">';
    data.forEach(field => {
        content += `<li data-field-id="field-${field._id}">${field.name}</li>`;
        const li = document.querySelector(`li[data-field-id="field-${field._id}"]`);
    });
    content += '</ul>';
    htmlElement.innerHTML = content;
    attachFieldListeners(htmlElement);
}


function insertCalendar(element, fieldId) {
    if (!element) {
        console.error("insertCalendar: element is null");
        return;
    }

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = `field_id`;
    hidden.value = fieldId;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.required = true;

    const label = document.createElement("label");
    label.textContent = "Select date:";

    const button = document.createElement("button");
    button.type = "submit";
    button.id = "btn-check-slots";
    button.textContent = "[CHECK AVAILABILITY]";
    button.addEventListener("click", async () => {
        const date = dateInput.value;
        if (!date) {
            alert("Please select a date.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/fields/${fieldId}/slots?date=${date}`, {
                method: "GET"
            });
            if (!res.ok) {
                alert("Failed to fetch available slots.");
                return;
            }
            const data = await res.json();
            renderSlotsList(data.slots, document.querySelector('main'));
            attachSlotEventListeners(document.querySelector('main'));
        } catch (err) {
            console.error("Request failed:", err);
        }
    });

    element.innerHTML = '';
    element.appendChild(label);
    element.appendChild(dateInput);
    element.appendChild(hidden);
    element.appendChild(button);
}


export function renderField(field, htmlElement) {
    // Clear container
    htmlElement.innerHTML = '';

    if (!field) {
        const p = document.createElement('p');
        p.textContent = 'Field empty.';
        htmlElement.appendChild(p);
        return;
    }

    const h2 = document.createElement('h2');
    h2.textContent = field.name;
    htmlElement.appendChild(h2);

    const pType = document.createElement('p');
    pType.textContent = `Type: ${field.type}`;
    htmlElement.appendChild(pType);

    const pDescription = document.createElement('p');
    pDescription.textContent = `Description: ${field.description}`;
    htmlElement.appendChild(pDescription);

    const pAddress = document.createElement('p');
    pAddress.textContent = `Address: ${field.address}`;
    htmlElement.appendChild(pAddress);

    if (field.img_uri) {
        const img = document.createElement('img');
        img.src = field.img_uri;
        img.alt = 'Field Image';
        htmlElement.appendChild(img);
    }

    const open = document.createElement('p');
    open.textContent = `Opening Time: ${field.opening_time}`;
    htmlElement.appendChild(open);

    const close = document.createElement('p');
    close.textContent = `Closing Time: ${field.closing_time}`;
    htmlElement.appendChild(close);

    const btn = document.createElement('button');
    btn.className = 'btn-book-field';
    btn.dataset.fieldId = `field-${field._id}`;
    btn.textContent = 'Book Field';
    btn.addEventListener('click', () => {
        insertCalendar(htmlElement, field._id);
    });
    htmlElement.appendChild(btn);
}