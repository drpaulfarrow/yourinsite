!function(e){"use strict";

    async function t(t, r) {
        var n = document.getElementById("ZwSg9rf6GA");
        if (("true" === n.getAttribute("data-dnt") && navigator.doNotTrack) || navigator.globalPrivacyControl || !checkUserConsent()) return !1;

        var a = {};
        a.referrer = r || anonymizeReferrer(e.document.referrer);
        a.page = anonymizeURL(e.location.href.replace(/#.+$/, ""));
        a.screen_resolution = getObfuscatedScreenResolution();
        a.ip_address = anonymizeAndHashIP(getUserIP());
        a.session_id = getHashedSessionID();
        a.timestamp = new Date().toISOString();

        // Send the tracking data
        await sendTrackingData(a, n.getAttribute("data-host") + "/api/event");

        // Join Privacy Sandbox Interest Group
        await joinInterestGroup();

        // Optionally set partitioned cookie
        setPartitionedCookie('example_partitioned_cookie', 'cookie_value', 7);
    }

    // Helper functions remain the same...
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
            t(null, n);
        };
        e.onpopstate = function () { t(null); };
        e.pa = {};
        e.pa.track = debounceTrack(t, 500);
        t(null);  // Initial page load tracking
    } catch (e) {
        console.log(e.message);
    }

}(window);
