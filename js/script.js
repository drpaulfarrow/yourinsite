!function(e){"use strict";

    // Main tracking function
    async function t(t, r) {
        var n = document.getElementById("ZwSg9rf6GA");
    
        // Check for Do Not Track settings or user consent
        if ((n && n.getAttribute("data-dnt") === "true" && navigator.doNotTrack) || 
            navigator.globalPrivacyControl || !checkUserConsent()) return !1;
    
        var a = {};
        a.referrer = r || anonymizeReferrer(document.referrer);
        a.page = anonymizeURL(window.location.href.replace(/#.+$/, ""));
        a.screen_resolution = getObfuscatedScreenResolution();
        a.ip_address = anonymizeAndHashIP(await getUserIP());  // Ensure IP retrieval is awaited
        a.session_id = getHashedSessionID();
        a.timestamp = new Date().toISOString();
    
        // Send the tracking data to the correct server
        await sendTrackingData(a, "https://yourinsiteserverside-gdd3afe5awgscnak.westeurope-01.azurewebsites.net/api/event");
    
        // Join Privacy Sandbox Interest Group (optional, ensure it is implemented)
        await joinInterestGroup();
    
        // Optionally set partitioned cookie
        setPartitionedCookie('example_partitioned_cookie', 'cookie_value', 7);
    }

    // Function to send the data to the server
    async function sendTrackingData(data, url) {
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
            var n = e.location.href.replace(/#.+$/, "");
            r.apply(history, arguments);
            t(null, n);  // Track history changes
        };
        e.onpopstate = function () { t(null); };  // Track browser back/forward navigation
        e.pa = {};
        e.pa.track = debounceTrack(t, 500);  // Debounce to avoid excessive tracking
        t(null);  // Initial page load tracking
    } catch (e) {
        console.log(e.message);
    }

    // Ensure the tracking function is called after the page loads
    window.addEventListener('DOMContentLoaded', function() {
        try {
            var n = document.getElementById("ZwSg9rf6GA");
            if (n) {
                t(null);  // Trigger the tracking function
            } else {
                console.error("Tracking element with ID ZwSg9rf6GA not found");
            }
        } catch (error) {
            console.error('Error initiating tracking:', error);
        }
    });

}(window);
