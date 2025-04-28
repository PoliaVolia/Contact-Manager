// Contacts Manager JavaScript
// This script allows us to add, display, delete, and sort contacts

// Create a variable to store all our contacts
let contactsList = [];

// Track which column we're sorting by and whether it's ascending or descending
let sortBy = 'firstName'; // Start by sorting on first name
let sortOrder = 'asc'; // 'asc' means A to Z, 'desc' means Z to A

// Get all the HTML elements we need to work with
const contactForm = document.getElementById('contact-form');
const firstNameInput = document.getElementById('first-name');
const surnameInput = document.getElementById('surname');
const emailInput = document.getElementById('email');
const telephoneInput = document.getElementById('telephone');
const contactsTable = document.getElementById('contacts-table');
const contactsBody = document.getElementById('contacts-body');
const noContactsMessage = document.getElementById('no-contacts-message');
const tableHeaders = document.querySelectorAll('th[data-sort]');

// This runs when the page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    // First, load any saved contacts
    loadContactsFromStorage();
    
    // Set up what happens when the form is submitted
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the page from refreshing
        addNewContact();
    });
    
    // Set up what happens when table headers are clicked (for sorting)
    for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaders[i].addEventListener('click', function() {
            // Get which column was clicked (firstName, surname, etc)
            const column = this.getAttribute('data-sort');
            sortContactsList(column);
        });
    }
});

// This function loads contacts from localStorage when the page loads
function loadContactsFromStorage() {
    // Check if we have saved contacts
    const savedContacts = localStorage.getItem('contacts');
    
    // If we have saved contacts, load them
    if (savedContacts) {
        // Convert the saved string back to an array of contacts
        contactsList = JSON.parse(savedContacts);
        // Show the contacts on the page
        displayAllContacts();
    }
}

// This function saves contacts to localStorage
function saveContactsToStorage() {
    // Convert our contacts array to a string and save it
    localStorage.setItem('contacts', JSON.stringify(contactsList));
}

// This function adds a new contact when the form is submitted
function addNewContact() {
    // Create a new contact object with the form values
    const newContact = {
        // Use the current time as a unique ID
        id: Date.now(),
        // Get the values from the form inputs
        firstName: firstNameInput.value.trim(),
        surname: surnameInput.value.trim(),
        email: emailInput.value.trim(),
        telephone: telephoneInput.value.trim()
    };
    
    // Add the new contact to our list
    contactsList.push(newContact);
    
    // Save all contacts to localStorage
    saveContactsToStorage();
    
    // Display the new contact with animation
    showNewContact(newContact);
    
    // Clear the form for the next entry
    contactForm.reset();
    // Put the cursor back in the first field
    firstNameInput.focus();
}

// This function displays a newly added contact with animation
function showNewContact(contact) {
    // If this is our first contact, hide the "no contacts" message
    if (contactsList.length === 1) {
        noContactsMessage.style.display = 'none';
        contactsTable.style.display = 'table';
    }
    
    // Create a new row for this contact
    const row = makeContactRow(contact);
    // Add the animation class for fade-in effect
    row.classList.add('new-contact');
    // Add the row to the table
    contactsBody.appendChild(row);
}

// This function creates a table row for a contact
function makeContactRow(contact) {
    // Create a new table row
    const row = document.createElement('tr');
    // Store the contact ID in the row for easy reference later
    row.dataset.id = contact.id;
    
    // Fill the row with the contact's information
    row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.surname}</td>
        <td>${contact.email}</td>
        <td>${contact.telephone}</td>
        <td>
            <button class="delete-btn" data-id="${contact.id}">Delete</button>
        </td>
    `;
    
    // Set up what happens when the delete button is clicked
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function() {
        deleteContact(contact.id);
    });
    
    return row;
}

// This function deletes a contact
function deleteContact(id) {
    // Find the row for this contact
    const row = document.querySelector(`tr[data-id="${id}"]`);
    
    // Add the animation class for fade-out effect
    row.classList.add('removing');
    
    // Wait for the animation to finish before actually removing the contact
    setTimeout(function() {
        // Remove the contact from our list
        // We keep all contacts EXCEPT the one with this ID
        let newList = [];
        for (let i = 0; i < contactsList.length; i++) {
            if (contactsList[i].id !== id) {
                newList.push(contactsList[i]);
            }
        }
        contactsList = newList;
        
        // Save the updated list to localStorage
        saveContactsToStorage();
        
        // Update the display
        displayAllContacts();
    }, 500); // 500 milliseconds = 0.5 seconds (animation duration)
}

// This function sorts the contacts list by a column
function sortContactsList(column) {
    // Add a class to show sorting animation
    contactsTable.classList.add('sorting');
    
    // Wait a moment to show the animation
    setTimeout(function() {
        // If we click the same column again, reverse the sort order
        if (sortBy === column) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // If it's a new column, default to ascending order
            sortBy = column;
            sortOrder = 'asc';
        }
        
        // Sort the contacts array
        contactsList.sort(function(a, b) {
            // Get the values to compare (make them lowercase for fair comparison)
            let valueA = a[column].toLowerCase();
            let valueB = b[column].toLowerCase();
            
            // Compare the values
            if (valueA < valueB) {
                // If sortOrder is 'asc', return -1, otherwise return 1
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                // If sortOrder is 'asc', return 1, otherwise return -1
                return sortOrder === 'asc' ? 1 : -1;
            }
            // If they're equal, don't change positions
            return 0;
        });
        
        // Update the display with the sorted list
        displayAllContacts();
        
        // Remove the sorting animation class
        contactsTable.classList.remove('sorting');
    }, 300); // 300 milliseconds = 0.3 seconds
}

// This function displays all contacts in the table
function displayAllContacts() {
    // Clear the current table
    contactsBody.innerHTML = '';
    
    // Check if we have contacts to show
    if (contactsList.length === 0) {
        // If no contacts, show the message and hide the table
        noContactsMessage.style.display = 'block';
        contactsTable.style.display = 'none';
        return; // Stop here, no need to go further
    } else {
        // If we have contacts, hide the message and show the table
        noContactsMessage.style.display = 'none';
        contactsTable.style.display = 'table';
    }
    
    // Add each contact to the table
    for (let i = 0; i < contactsList.length; i++) {
        const row = makeContactRow(contactsList[i]);
        contactsBody.appendChild(row);
    }
}