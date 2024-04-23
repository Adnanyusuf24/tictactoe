document.addEventListener('DOMContentLoaded', function() {
    const startForm = document.getElementById('startForm');

    startForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        // Get the username from the menu page
        const username = document.getElementById('username').value.trim();

        // Get the difficulty from the menu page
        const difficulty = document.getElementById('difficulty').value;
        
        // Store the username in localStorage to use later in the game
        localStorage.setItem('username', username);

        //Store the difficulty in localStorage to use later in the game
        localStorage.setItem('difficulty', difficulty);

        // Redirect to the game page
        window.location.href = '/game';
    });
});
