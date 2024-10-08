// popup.js
document.getElementById('startExtraction').addEventListener('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'startExtraction');
    });
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action == 'log') {
        document.getElementById('logArea').innerText += request.text + '\n';
    }
});


document.getElementById('clearStorage').addEventListener('click',clearStorage);

function clearStorage(){
    chrome.storage.sync.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else {
            console.log("Storage cleared");
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const actionButton = document.getElementById('startExtraction');

    // Function to update button image based on current tab URL
    function updateButtonImage(url) {
        if (url.includes('mail.google.com')) {
            actionButton.src = 'icons/extract.svg';
        } else if (url.includes('amazon.in')) {
            actionButton.src = 'icons/apply.svg';
        } else {
            actionButton.src = 'icons/extract.svg'; // Set a default image here
        }
    }

    // Get the current tab's URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let currentTab = tabs[0];
        updateButtonImage(currentTab.url);
    });

    // Add click event listener to the action button
    actionButton.addEventListener('click', function() {
        // Here you can add the logic for what happens when the button is clicked
        console.log('Action button clicked');
    });

    // Add click event listener to the clear storage button
    document.getElementById('clearStorage').addEventListener('click', function() {
        // Add logic for clearing storage
        console.log('Clear storage button clicked');
    });
});