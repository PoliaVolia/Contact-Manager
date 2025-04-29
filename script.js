let contactsList = [];

const contactForm = document.getElementById('contact-form');
const firstNameInput = document.getElementById('first-name');
const surnameInput = document.getElementById('surname');
const emailInput = document.getElementById('email');
const telephoneInput = document.getElementById('telephone');
const contactsTable = document.getElementById('contacts-table');
const contactsBody = document.getElementById('contacts-body');
const noContactsMessage = document.getElementById('no-contacts-message');
const tableHeaders = document.querySelectorAll('th[data-sort]');

document.addEventListener('DOMContentLoaded', function() {
    loadContactsFromStorage();
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        createContact();
    });
    
    for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaders[i].addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            sort(column);
        });
    }
});

function loadContactsFromStorage() {
    const savedContacts = localStorage.getItem('contacts');
    
    if (savedContacts) {
        contactsList = JSON.parse(savedContacts);
        showContacts();
    }
}

//array to JSON
function saveContactsToStorage() {
    localStorage.setItem('contacts', JSON.stringify(contactsList));
}

//  creates a contact object and pushes it to the array
function createContact() {
    const newContact = {
        id: Date.now(),
        firstName: firstNameInput.value.trim(),
        surname: surnameInput.value.trim(),
        email: emailInput.value.trim(),
        telephone: telephoneInput.value.trim()
    };
    contactsList.push(newContact);
    saveContactsToStorage();
    showNewContact(newContact);
    contactForm.reset();
}

// display with animation
function showNewContact(contact) {
    if (contactsList.length === 1) {
        noContactsMessage.style.display = 'none';
        contactsTable.style.display = 'table';
    }
    
    const row = makeContactRow(contact);
    row.classList.add('new-contact');
    contactsBody.appendChild(row);
}

// creates a row and attach delete 
function makeContactRow(contact) {
    const row = document.createElement('tr');
    row.dataset.id = contact.id;
    
    row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.surname}</td>
        <td>${contact.email}</td>
        <td>${contact.telephone}</td>
        <td>
            <button class="delete-btn" data-id="${contact.id}">Delete</button>
        </td>
    `;
    
    //  delete button clicking listener
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function() {
        deleteContact(contact.id);
    });
    
    return row;
}

function deleteContact(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    row.classList.add('removing');
    
    setTimeout(function() {
        let newList = [];
        for (let i = 0; i < contactsList.length; i++) {
            if (contactsList[i].id !== id) {
                newList.push(contactsList[i]);
            }
        }
        contactsList = newList;
        saveContactsToStorage();
        showContacts();
    }, 500);
}

function sort(column) {
    contactsTable.classList.add('sorting');
    setTimeout(function() {
        contactsList.sort(function(a, b) {
            let valueA = a[column].toLowerCase();
            let valueB = b[column].toLowerCase();
            if (valueA < valueB) {
                return -1;  
            }
            if (valueA > valueB) {
                return 1;   
            }
            return 0;
        });
        
        showContacts();
        
        contactsTable.classList.remove('sorting');
    }, 300); 
}

function showContacts() {
    contactsBody.innerHTML = '';
    if (contactsList.length === 0) {
        noContactsMessage.style.display = 'block';
        contactsTable.style.display = 'none';
        return; 
    } else {
        noContactsMessage.style.display = 'none';
        contactsTable.style.display = 'table';
    }
    
    for (let i = 0; i < contactsList.length; i++) {
        const row = makeContactRow(contactsList[i]);
        contactsBody.appendChild(row);
    }
}