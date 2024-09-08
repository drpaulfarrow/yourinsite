console.log("Tracking script loaded successfully");

!function(e){"use strict";

    // Debounce function to avoid excessive tracking calls
    function debounceTrack(fn, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Anonymize URL by stripping query parameters
    function anonymizeURL(url) {
        try {
            const parsedUrl = new URL(url);
            return `${parsedUrl.origin}${parsedUrl.pathname}`;
        } catch (error) {
            console.error("Error anonymizing URL:", error);
            return url;
        }
    }

    // Anonymize referrer URL
    function anonymizeReferrer(referrer) {
        if (!referrer) return '';
        return anonymizeURL(referrer);
    }

    // Mock function to get user's IP address (can be replaced with a real service)
    async function getUserIP() {
        return "192.168.1.1";  // Mock IP address for demonstration purposes
    }

    // Hash and anonymize the IP address
    function anonymizeAndHashIP(ip) {
        let hashedIP = btoa(ip);  // Base64 encoding as a mock hash
        return hashedIP;
    }

    // Function to get a hashed session ID
    function getHashedSessionID() {
        return btoa("session_" + Math.random().toString(36).substring(2));
    }

    // Function to obfuscate screen resolution
    function getObfuscatedScreenResolution() {
        return `${window.screen.width}x${window.screen.height}`;
    }

    // Function to set a third-party cookie
    function setUserCookie(userId) {
        const cookieName = 'user_id';
        const daysToExpire = 365; // Set the cookie to expire in 1 year
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${cookieName}=${userId}; ${expires}; path=/; Secure; SameSite=None`;
    }

    // Function to generate or get a user ID (mocked for now)
    function getUserId() {
        let userId = getCookie('user_id');
        let isNewUser = false;

        if (!userId) {
            // If user_id doesn't exist, it's a new user
            isNewUser = true;
            // Generate a new user ID
            userId = 'user_' + Math.random().toString(36).substring(2);
            setUserCookie(userId);
        }

        // Return both the userId and isNewUser flag
        return { userId, isNewUser };
    }

    // Helper function to retrieve a cookie value by name
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Call this in your tracking function to set or retrieve the user ID
    const { userId, isNewUser } = getUserId();
    console.log("User ID:", userId);
    console.log("Is new user:", isNewUser);

    // Main tracking function
    async function t(t, r) {
        console.log("Tracking function 't' started");

        var n = document.getElementById("ZwSg9rf6GA");
        if (!n) {
            console.error("Element with ID 'ZwSg9rf6GA' not found");
            return;
        }
        console.log("Found tracking element 'ZwSg9rf6GA'", n);

        // Check for Do Not Track settings or user consent
        if ((n.getAttribute("data-dnt") === "true" && navigator.doNotTrack) || 
            navigator.globalPrivacyControl) {
            console.warn("Tracking aborted due to Do Not Track or lack of user consent");
            return !1;
        }

        var a = {};
        a.referrer = r || anonymizeReferrer(document.referrer);
        console.log("Referrer:", a.referrer);
        a.page = anonymizeURL(window.location.href.replace(/#.+$/, ""));
        console.log("Page URL:", a.page);
        a.screen_resolution = getObfuscatedScreenResolution();
        console.log("Screen resolution:", a.screen_resolution);
        
        // Get and anonymize the user's IP
        try {
            a.ip_address = anonymizeAndHashIP(await getUserIP());
            console.log("IP address:", a.ip_address);
        } catch (error) {
            console.error("Error retrieving IP address:", error);
        }
        
        a.session_id = getHashedSessionID();
        console.log("Session ID:", a.session_id);
        
        // Include user ID and new user flag in the tracking data
        a.user_id = userId;
        a.is_new_user = isNewUser;
        console.log("User ID:", a.user_id);
        console.log("Is new user:", a.is_new_user);

        a.timestamp = new Date().toISOString();
        console.log("Timestamp:", a.timestamp);

        // Send the tracking data to the server
        await sendTrackingData(a, "https://yourinsiteserverside-gdd3afe5awgscnak.westeurope-01.azurewebsites.net/api/event");
    }

    // Function to send the data to the server
    async function sendTrackingData(data, url) {
        console.log("Sending tracking data to:", url);
        console.log("Payload being sent:", data);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Event tracked successfully');
        } catch (error) {
            console.error('Error sending tracking data:', error);
        }
    }

    // Initialize event tracking on page load and history changes
    try {
        var r = history.pushState;
        history.pushState = function () {
            console.log("History state changed");
            var n = e.location.href.replace(/#.+$/, "");
            r.apply(history, arguments);
            t(null, n);  // Track history changes
        };
        e.onpopstate = function () { 
            console.log("Popstate event detected (back/forward navigation)");
            t(null); 
        };  // Track browser back/forward navigation
        e.pa = {};
        e.pa.track = debounceTrack(t, 500);  // Debounce to avoid excessive tracking
        console.log("Initial page load tracking");
        t(null);  // Initial page load tracking
    } catch (e) {
        console.error("Error initializing tracking:", e.message);
    }

    // Ensure the tracking function is called after the page loads
    window.addEventListener('DOMContentLoaded', function() {
        console.log("DOM fully loaded");
        try {
            var n = document.getElementById("ZwSg9rf6GA");
            if (n) {
                console.log("Triggering the tracking function after DOMContentLoaded");
                t(null);  // Trigger the tracking function
            } else {
                console.error("Tracking element with ID 'ZwSg9rf6GA' not found after DOMContentLoaded");
            }
        } catch (error) {
            console.error('Error initiating tracking after DOMContentLoaded:', error);
        }
    });

}(window);
