
console.log("pending payment script loaded")





function changeProgressText(percentage) {
    document.getElementById('progress-text').innerText = `${percentage}%`;
}

function changeMessage(text) {
    document.getElementById('message').innerText = text;
}

function changeSubMessage(text) {
    document.getElementById('sub-message').innerText = text;
}

function navigateHome() {
    // Logic to navigate to the home page
    window.location.href = 'home.html'; // Change this to your actual home page URL
}

function getHelp() {
    // Logic to show help information
    alert('Help information will be displayed here.');
}

