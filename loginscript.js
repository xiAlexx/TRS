document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the username and password from the form
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Perform basic client-side validation
    if (username === "Admin" && password === "Sammas") {
        // Redirect to the TRS page if the username and password are correct
        window.location.href = "trs.html"; 
    } else {
        // Display an error message if the username or password is incorrect
        alert("Invalid username or password. Please try again.");
    }
});

// Simulate loading time 
setTimeout(function() {
    // Hide the loading screen and show the login container after loading
    document.querySelector('.loading-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
}, 5000); // Replace '5000' with the desired loading time in milliseconds e.g., 5 seconds