console.log("yourin.site: Tracking script loaded successfully");

// Dynamically load UAParser.js library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/UAParser.js/1.0.2/ua-parser.min.js';
script.onload = function () {
    console.log('yourin.site: UAParser.js loaded successfully');
    
    // Your existing tracking logic that depends on UAParser.js can go here
};
script.onerror = function () {
    console.error('yourin.site: Error loading UAParser.js');
};
document.head.appendChild(script);


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
            console.error("yourin.site: Error anonymizing URL:", error);
            return url;
        }
    }

    // Anonymize referrer URL
    function anonymizeReferrer(referrer) {
        if (!referrer) return '';
        return anonymizeURL(referrer);
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

    // Function to check if cookies are enabled
    function areCookiesEnabled() {
        // Try setting a test cookie
        document.cookie = "test_cookie=1; SameSite=Lax";

        // Check if the cookie exists
        const cookiesEnabled = document.cookie.indexOf("test_cookie=") !== -1;

        // Remove the test cookie
        document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

        return cookiesEnabled;
    }

    // Function to get the public IP address using an external service
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;  // Return the public IP address
        } catch (error) {
            console.error('yourin.site: Error fetching IP address:', error);
            return null;  // Return null in case of error
        }
    }

// Function to get device information using UAParser.js (if available) or basic navigator.userAgent
function getDeviceInfo() {
    let deviceInfo = {};
    try {
        if (typeof UAParser !== 'undefined') {
            const parser = new UAParser();
            const result = parser.getResult();
            deviceInfo = {
                browser: result.browser.name || 'unknown',
                browser_version: result.browser.version || 'unknown',
                os: result.os.name || 'unknown',
                os_version: result.os.version || 'unknown',
                device_type: result.device.type || 'desktop', // mobile, tablet, or desktop
                device_vendor: result.device.vendor || 'unknown',
                device_model: result.device.model || 'unknown'
            };
        } else {
            // Fallback to basic user agent parsing if UAParser is not available
            const userAgent = navigator.userAgent || 'unknown';
            deviceInfo = {
                browser: /firefox/i.test(userAgent) ? 'Firefox' : /chrome|crios/i.test(userAgent) ? 'Chrome' : /safari/i.test(userAgent) ? 'Safari' : /trident|msie/i.test(userAgent) ? 'IE' : 'unknown',
                os: /windows/i.test(userAgent) ? 'Windows' : /macintosh/i.test(userAgent) ? 'Mac OS' : /android/i.test(userAgent) ? 'Android' : /iphone|ipad/i.test(userAgent) ? 'iOS' : 'unknown',
                device_type: /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop'
            };
        }
    } catch (error) {
        console.error('yourin.site: Error getting device info:', error);
        deviceInfo = { browser: 'unknown', os: 'unknown', device_type: 'unknown' };
    }

    return deviceInfo;
}

// Main tracking function
async function t(t, r) {
    console.log("yourin.site: Tracking function 't' started");

    var n = document.getElementById("ZwSg9rf6GA");
    if (!n) {
        console.error("yourin.site: Element with ID 'ZwSg9rf6GA' not found");
        return;
    }

    // Check for Do Not Track settings or user consent
    if ((n.getAttribute("data-dnt") === "true" && navigator.doNotTrack) || navigator.globalPrivacyControl) {
        console.warn("yourin.site: Tracking aborted due to Do Not Track or lack of user consent");
        return !1;
    }

    // An object to hold tracking data
    var a = {};
    a.referrer = r || anonymizeReferrer(document.referrer);
    a.page = anonymizeURL(window.location.href.replace(/#.+$/, ""));
    a.screen_resolution = getObfuscatedScreenResolution();
    a.ip_address = await getUserIP();
    a.session_id = getHashedSessionID();
    a.timestamp = new Date().toISOString();

    // Get device information
    const deviceInfo = getDeviceInfo();
    a.device_info = deviceInfo;
    console.log("yourin.site: Device info:", a.device_info);

    // Check if cookies are enabled
    if (areCookiesEnabled()) {
        const { userId, isNewUser } = getUserId();
        a.user_id = userId;
        a.is_new_user = isNewUser;
    } else {
        a.user_id = null;
        a.is_new_user = false;
    }

    // Determine the correct API URL based on protocol and hostname
    const apiUrl = window.location.protocol === "file:" || window.location.hostname.includes("localhost")
        ? "http://localhost:8080/api/event"
        : "https://yourinsiteserverside-gdd3afe5awgscnak.westeurope-01.azurewebsites.net/api/event";

    // Send the tracking data to the server
    await sendTrackingData(a, apiUrl);
}


// Function to send the data to the server
async function sendTrackingData(data, url) {
    console.log("yourin.site: Sending tracking data to:", url);
    console.log("yourin.site: Payload being sent:", data);
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
        console.log('yourin.site: Event tracked successfully');
    } catch (error) {
        console.error('yourin.site: Error sending tracking data:', error);
    }
}

    // Initialize event tracking on page load and history changes
    try {
        var r = history.pushState;
        history.pushState = function () {
            console.log("yourin.site: History state changed");
            var n = e.location.href.replace(/#.+$/, "");
            r.apply(history, arguments);
            t(null, n);  // Track history changes
        };
        e.onpopstate = function () { 
            console.log("yourin.site: Popstate event detected (back/forward navigation)");
            t(null); 
        };  // Track browser back/forward navigation
        e.pa = {};
        e.pa.track = debounceTrack(t, 500);  // Debounce to avoid excessive tracking
        console.log("yourin.site: Initial page load tracking");
        t(null);  // Initial page load tracking
    } catch (e) {
        console.error("yourin.site: Error initializing tracking:", e.message);
    }

    // Ensure the tracking function is called after the page loads
    window.addEventListener('DOMContentLoaded', function() {
        console.log("yourin.site: DOM fully loaded");
        try {
            var n = document.getElementById("ZwSg9rf6GA");
            if (n) {
                console.log("yourin.site: Triggering the tracking function after DOMContentLoaded");
                t(null);  // Trigger the tracking function
            } else {
                console.error("yourin.site: Tracking element with ID 'ZwSg9rf6GA' not found after DOMContentLoaded");
            }
        } catch (error) {
            console.error('yourin.site: Error initiating tracking after DOMContentLoaded:', error);
        }
    });

}(window);
