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

export function renderField(field, htmlElement) {
    let content = '';
    if (!field) {
        content = '<p>Field empty.</p>';
        return content;
    }
    content += `<h2>${field.name}</h2>`;
    content += `<p>Type: ${field.type}</p>`;
    content += `<p>Description: ${field.description}</p>`;
    content += `<p>Address: ${field.address}</p>`;
    if (field.img_uri) {
        content += `<img src="${field.img_uri}" alt="Field Image">`;
    }
    content += `Opening Time: ${field.opening_time}<br>`;
    content += `Closing Time: ${field.closing_time}<br>`;
    content += `<button id="btn-book-field" data-field-id="field-${field._id}">Book Field</button>`;
    htmlElement.innerHTML = content;
}