document.addEventListener('DOMContentLoaded', function() {
    const tableContainer = document.getElementById('tableContainer');
    const addTableButton = document.getElementById('addTableButton');
    const addChairButton = document.getElementById('addChairButton');
    let tableCount = 0; // Initialize table count
    let mergedTables = []; // Store information about merged tables

    const undoButton = document.getElementById('undoButton');

    undoButton.addEventListener('click', function() {
        undoLastAction();
        updateTimeDate(); // Update time and date after undo
    });

    function undoLastAction() {
        const savedPositions = localStorage.getItem('positions');
        if (savedPositions) {
            let positions = JSON.parse(savedPositions);
            if (positions.length > 0) {
                const lastAction = positions.pop(); // Remove last item and get the action
                localStorage.setItem('positions', JSON.stringify(positions));
                // Clear the current content in the table container
                tableContainer.innerHTML = '';
                // Recreate tables and chairs based on updated positions
                positions.forEach(item => {
                    if (item.type === 'table') {
                        const newTable = createTable(item.id); // Create table based on its previous ID
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
                if (lastAction && lastAction.type === 'merge') {
                    unmergeTables(lastAction.ids); // Unmerge tables if the last action was a merge
                }
                makeChairsMovable(); // Ensure chairs remain movable after undo
            }
        }
    }
    
    function unmergeTables(ids) {
        console.log("IDs received for unmerging:", ids);
        ids.forEach(id => {
            const table = document.getElementById(id);
            console.log("Table found for ID:", id, table);
            if (table) {
                const rect = table.getBoundingClientRect();
                const newTable = createTable(); // Create a new table
                newTable.style.left = rect.left + 'px';
                newTable.style.top = rect.top + 'px';
                newTable.style.width = rect.width + 'px';
                newTable.style.height = rect.height + 'px';
                tableContainer.appendChild(newTable);
            }
        });
        // Remove merged tables from the mergedTables array
        mergedTables = mergedTables.filter(tableIds => !ids.every(id => tableIds.includes(id)));
        console.log("Remaining merged tables:", mergedTables);
    }
    
    function addTable() {
        tableCount++;
        const newTable = createTable();
        tableContainer.appendChild(newTable);
        savePositions();
    }

    function createTable(id) {
        const table = document.createElement('div');
        table.classList.add('table');
        table.textContent = 'Table ' + (tableContainer.querySelectorAll('.table').length + 1);
        table.style.position = 'absolute';
        table.style.left = (window.innerWidth / 2) + 'px';
        table.style.top = '50px';
        table.id = id || 'table' + (tableContainer.querySelectorAll('.table').length + 1);
        table.addEventListener('mousedown', handleTableMouseDown);
        table.addEventListener('touchstart', handleTableTouchStart);
        return table;
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
                    const newTable = createTable(item.id); // Create table based on its previous ID
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
        updateTimeDate(); // Update time and date on page load
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

    function handleTableMouseDown(event) {
        event.preventDefault();
        const table = event.target; // Define table as the target of the event
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

    function checkForOverlaps() {
        const tableRects = Array.from(tableContainer.querySelectorAll('.table')).map(table => table.getBoundingClientRect());
        tableRects.forEach((rect, index) => {
            const overlappingTables = tableRects.filter((otherRect, otherIndex) => index !== otherIndex && doRectsOverlap(rect, otherRect));
            if (overlappingTables.length > 0) {
                const mergedRect = getMergedRect(rect, overlappingTables.map(otherRect => otherRect));
                const table = tableContainer.querySelectorAll('.table')[index];
    
                // Add debugging statements here
                console.log("Index:", index);
                console.log("Tables:", tableContainer.querySelectorAll('.table'));
                console.log("Table:", table);
    
                // Check if table is found
                if (!table) {
                    console.log("Table not found at index", index);
                    console.log("Current table rects:", tableRects);
                    console.log("Overlapping tables:", overlappingTables);
                    console.log("Merged rect:", mergedRect);
                    return;
                }
    
                table.style.left = mergedRect.left + 'px';
                table.style.top = mergedRect.top + 'px';
                table.style.width = mergedRect.width + 'px';
                table.style.height = mergedRect.height + 'px';
                // Store information about merged tables
                const mergedTableIds = overlappingTables.map(otherRect => tableContainer.querySelectorAll('.table')[tableRects.findIndex(r => r === otherRect)].id);
                mergedTables.push(mergedTableIds);
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

    function updateTimeDate() {
        const timeDateElement = document.getElementById('timeDate');
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toDateString();
        timeDateElement.textContent = timeString + ' - ' + dateString;
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
