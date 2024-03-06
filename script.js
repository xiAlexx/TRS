// Implement table linking and movement logic
// Example: Listen for clicks on tables and handle linking/unlinking

// Fetch reservation data from the backend (AJAX or fetch API)
// Example: GET request to /api/reservations

// Update table availability based on reservations
// Example: Mark occupied tables with a different color


// script.js

const tables = document.querySelectorAll('.table');
let ghostTable; // Reference to the ghost table element

tables.forEach((table) => {
    table.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', table.id);

        // Create a ghost table (clone of the original table)
        ghostTable = table.cloneNode(true);
        ghostTable.classList.add('ghost-table');
        document.body.appendChild(ghostTable);
    });

    table.addEventListener('dragend', () => {
        // Remove the ghost table when dragging ends
        if (ghostTable) {
            document.body.removeChild(ghostTable);
            ghostTable = null;
        }
    });
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (ghostTable) {
        ghostTable.style.left = `${e.clientX}px`;
        ghostTable.style.top = `${e.clientY}px`;
    }
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    const tableId = e.dataTransfer.getData('text/plain');
    const table = document.getElementById(tableId);
    table.style.left = `${e.clientX}px`;
    table.style.top = `${e.clientY}px`;
});



