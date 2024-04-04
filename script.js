document.addEventListener('DOMContentLoaded', function() {
    const tableContainer = document.getElementById('tableContainer');
    const addTableButton = document.getElementById('addTableButton');
    const addChairButton = document.getElementById('addChairButton');
    let tableCount = 0; // Initialize table count
    

    const undoButton = document.getElementById('undoButton');

    undoButton.addEventListener('click', function() {
        undoLastAction();
    })

//Function for undo to last action
function undoLastAction() {
    const savedPositions = localStorage.getItem('positions');
    if (savedPositions) {
        let positions = JSON.parse(savedPositions);
        if (positions.length > 0) {
            positions.pop(); // Remove last item
            localStorage.setItem('positions', JSON.stringify(positions));
            // Clear the current content in the table container
            tableContainer.innerHTML = '';
            // Recreate tables and chairs based on updated positions
            positions.forEach(item => {
                if (item.type === 'table') {
                    const newTable = createTable(++tableCount); // Increment table count
                    newTable.id = item.id; // Set table id
                    newTable.style.left = item.left;
                    newTable.style.top = item.top;
                    newTable.style.width = item.width;
                    newTable.style.height = item.height;
                    tableContainer.appendChild(newTable);
                } else if (item.type === 'chair') {
                    const newChair = document.createElement('div');
                    newChair.classList.add('chair');
                    newChair.style.position = 'absolute';
                    newChair.style.width = '35px';
                    newChair.style.height = '35px';
                    newChair.style.backgroundColor = '#fff';
                    newChair.style.border = '1px solid #000';
                    newChair.style.borderRadius = '50%';
                    newChair.style.left = item.left;
                    newChair.style.top = item.top;
                    newChair.style.transform = 'translate(-50%, -50%)';
                    tableContainer.appendChild(newChair);
                }
            });
            makeChairsMovable(); // Ensure chairs remain movable after undo
        }
    }
}



// Update time and date every second
    function updateTimeDate() {
        const timeDateElement = document.getElementById('timeDate');
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const dateString = now.toDateString();
            timeDateElement.textContent = timeString + ' - ' + dateString;
        }, 1000);
    }

    updateTimeDate(); // Call the function to start updating time and date


    function handleTableMouseDown(event) {
        event.preventDefault();
        const table = this;
        const rect = table.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        table.style.zIndex = 1000; // Ensure the clicked table is on top
        document.addEventListener('mousemove', handleTableMouseMove);

        function handleTableMouseMove(event) {
            event.preventDefault();
            const newX = event.clientX - offsetX;
            const newY = event.clientY - offsetY;
            table.style.left = newX + 'px';
            table.style.top = newY + 'px';
            checkForOverlaps();
        }

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleTableMouseMove);
            savePositions();
        });
    }

    function handleTableTouchStart(event) {
        event.preventDefault();
        const table = this;
        const rect = table.getBoundingClientRect();
        const touch = event.touches[0];
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        table.style.zIndex = 1000; // Ensure the touched table is on top
        document.addEventListener('touchmove', handleTableTouchMove);

        function handleTableTouchMove(event) {
            event.preventDefault();
            const touch = event.touches[0];
            const newX = touch.clientX - offsetX;
            const newY = touch.clientY - offsetY;
            table.style.left = newX + 'px';
            table.style.top = newY + 'px';
            checkForOverlaps();
        }

        document.addEventListener('touchend', () => {
            document.removeEventListener('touchmove', handleTableTouchMove);
            savePositions();
        });
    }

    function addTable() {
        tableCount++;
        const newTable = createTable(tableCount);
        tableContainer.appendChild(newTable);
        savePositions();
    }

    function createTable(count) {
        const table = document.createElement('div');
        table.classList.add('table');
        table.textContent = 'Table ' + count;
        table.style.position = 'absolute';
        table.style.left = (window.innerWidth / 2) + 'px';
        table.style.top = '50px';
        table.id = 'table' + count;
        table.addEventListener('mousedown', handleTableMouseDown);
        table.addEventListener('touchstart', handleTableTouchStart);
        return table;
    }

    function checkForOverlaps() {
        const tableRects = Array.from(tableContainer.querySelectorAll('.table')).map(table => table.getBoundingClientRect());
        tableRects.forEach((rect, index) => {
            const overlappingTables = tableRects.filter((otherRect, otherIndex) => index !== otherIndex && doRectsOverlap(rect, otherRect));
            if (overlappingTables.length > 0) {
                const mergedRect = getMergedRect(rect, overlappingTables.map(otherRect => otherRect));
                const table = tableContainer.querySelectorAll('.table')[index];
                table.style.left = mergedRect.left + 'px';
                table.style.top = mergedRect.top + 'px';
                table.style.width = mergedRect.width + 'px';
                table.style.height = mergedRect.height + 'px';
                overlappingTables.forEach(otherRect => {
                    const otherTable = tableContainer.querySelectorAll('.table')[tableRects.findIndex(r => r === otherRect)];
                    otherTable.remove();
                });
            }
        });
    }

    function doRectsOverlap(rect1, rect2) {
        return rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top;
    }

    function getMergedRect(baseRect, otherRects) {
        const left = Math.min(baseRect.left, ...otherRects.map(rect => rect.left));
        const top = Math.min(baseRect.top, ...otherRects.map(rect => rect.top));
        const right = Math.max(baseRect.right, ...otherRects.map(rect => rect.right));
        const bottom = Math.max(baseRect.bottom, ...otherRects.map(rect => rect.bottom));
        return {
            left: left,
            top: top,
            width: right - left,
            height: bottom - top
        };
    }

    function savePositions() {
        const tables = tableContainer.querySelectorAll('.table');
        const chairs = tableContainer.querySelectorAll('.chair');
        const positions = [];
        tables.forEach(table => {
            positions.push({
                type: 'table',
                id: table.id,
                left: table.style.left,
                top: table.style.top,
                width: table.style.width,
                height: table.style.height
            });
        });
        chairs.forEach(chair => {
            positions.push({
                type: 'chair',
                left: chair.style.left,
                top: chair.style.top
            });
        });
        localStorage.setItem('positions', JSON.stringify(positions));
    }

    window.addEventListener('load', () => {
        const savedPositions = localStorage.getItem('positions');
        if (savedPositions) {
            const positions = JSON.parse(savedPositions);
            positions.forEach(item => {
                if (item.type === 'table') {
                    const newTable = createTable(++tableCount); // Increment table count
                    newTable.id = item.id; // Set table id
                    newTable.style.left = item.left;
                    newTable.style.top = item.top;
                    newTable.style.width = item.width;
                    newTable.style.height = item.height;
                    tableContainer.appendChild(newTable);
                } else if (item.type === 'chair') {
                    const newChair = document.createElement('div');
                    newChair.classList.add('chair');
                    newChair.style.position = 'absolute';
                    newChair.style.width = '35px';
                    newChair.style.height = '35px';
                    newChair.style.backgroundColor = '#fff';
                    newChair.style.border = '1px solid #000';
                    newChair.style.borderRadius = '50%';
                    newChair.style.left = item.left;
                    newChair.style.top = item.top;
                    newChair.style.transform = 'translate(-50%, -50%)';
                    tableContainer.appendChild(newChair);
                }
            });
        }
        makeChairsMovable();
    });

    function makeChairsMovable() {
        const chairs = tableContainer.querySelectorAll('.chair');

        chairs.forEach(chair => {
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            chair.addEventListener('mousedown', startDrag);
            chair.addEventListener('touchstart', startDrag);

            function startDrag(event) {
                event.preventDefault();
                isDragging = true;
                const chairRect = chair.getBoundingClientRect();
                const touch = event.touches ? event.touches[0] : event;
                offsetX = touch.clientX - chairRect.left;
                offsetY = touch.clientY - chairRect.top;
                window.addEventListener('mousemove', whileDrag);
                window.addEventListener('touchmove', whileDrag);
                window.addEventListener('mouseup', endDrag);
                window.addEventListener('touchend', endDrag);
            }

            function whileDrag(event) {
                if (isDragging) {
                    const touch = event.touches ? event.touches[0] : event;
                    const x = touch.clientX - offsetX;
                    const y = touch.clientY - offsetY;
                    chair.style.left = x + 'px';
                    chair.style.top = y + 'px';
                }
            }

            function endDrag() {
                isDragging = false;
                window.removeEventListener('mousemove', whileDrag);
                window.removeEventListener('touchmove', whileDrag);
                window.removeEventListener('mouseup', endDrag);
                window.removeEventListener('touchend', endDrag);
                savePositions();
            }
        });
    }

    function addChair() {
        const newChair = document.createElement('div');
        newChair.classList.add('chair');
        newChair.style.position = 'absolute';
        newChair.style.width = '35px';
        newChair.style.height = '35px';
        newChair.style.backgroundColor = '#fff';
        newChair.style.border = '1px solid #000';
        newChair.style.borderRadius = '50%';
        newChair.style.left = '50%';
        newChair.style.top = '50%';
        newChair.style.transform = 'translate(-50%, -50%)';
        tableContainer.appendChild(newChair);
        savePositions();
        makeChairsMovable();
    }

    addChairButton.addEventListener('click', addChair);
    addTableButton.addEventListener('click', addTable);
});
