document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('.table');

    // Retrieve and apply saved positions from local storage
    tables.forEach(table => {
        const savedPosition = localStorage.getItem(`${table.id}_position`);
        if (savedPosition) {
            const [left, top] = savedPosition.split(',');
            table.style.left = left;
            table.style.top = top;
        }
    });

    // Add event listeners for table movement
    tables.forEach(table => {
        table.addEventListener('mousedown', handleMouseDown);
        table.addEventListener('touchstart', handleTouchStart);
    });

    // Variable to track mouse/touch position and dragging state
    let activeTable = null;
    let startXOffset = 0;
    let startYOffset = 0;

    // Functions to handle mouse events
    function handleMouseDown(event) {
        event.preventDefault();
        activeTable = this;
        startXOffset = event.clientX - activeTable.getBoundingClientRect().left;
        startYOffset = event.clientY - activeTable.getBoundingClientRect().top;
        activeTable.style.zIndex = 1000; // Ensure the clicked table is on top
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event) {
        event.preventDefault();
        if (activeTable) {
            const newX = event.clientX - startXOffset;
            const newY = event.clientY - startYOffset;
            activeTable.style.left = newX + 'px';
            activeTable.style.top = newY + 'px';
        }
    }

    function handleMouseUp(event) {
        event.preventDefault();
        if (activeTable) {
            // Save position to local storage
            localStorage.setItem(`${activeTable.id}_position`, `${activeTable.style.left},${activeTable.style.top}`);
            activeTable = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }

    // Functions to handle touch events
    function handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        activeTable = this;
        startXOffset = touch.clientX - activeTable.getBoundingClientRect().left;
        startYOffset = touch.clientY - activeTable.getBoundingClientRect().top;
    }

    function handleTouchMove(event) {
        event.preventDefault();
        if (activeTable) {
            const touch = event.touches[0];
            const newX = touch.clientX - startXOffset;
            const newY = touch.clientY - startYOffset;
            activeTable.style.left = newX + 'px';
            activeTable.style.top = newY + 'px';
        }
    }

    function handleTouchEnd(event) {
        event.preventDefault();
        if (activeTable) {
            // Save position to local storage
            localStorage.setItem(`${activeTable.id}_position`, `${activeTable.style.left},${activeTable.style.top}`);
            activeTable = null;
        }
    }

    // Add event listeners for mouse and touch events for each table
    tables.forEach(table => {
        table.addEventListener('touchmove', handleTouchMove);
        table.addEventListener('touchend', handleTouchEnd);
    });
});
