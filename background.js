function log(message) {
    console.info("[%s] %s", (new Date()).toISOString(), message);
}

const alarms = {};

chrome.webNavigation.onCompleted.addListener(function (details) {
    let alarmName = "close-" + details.tabId;
    chrome.alarms.create(alarmName, {
        "delayInMinutes": 1
    });
    alarms[alarmName] = {
        "tabId": details.tabId,
        "url": details.url
    };
    log("Will trigger: " + alarmName);
}, {url: [{hostSuffix: 'zoom.us'}]});

chrome.alarms.onAlarm.addListener(function (alarm) {
    let key = alarm.name;
    if (key in alarms) {
        const details = alarms[key];
        chrome.tabs.remove(details.tabId, function () {
            log("Closed tab: " + details.url);
            delete alarms[key];
        });
    }
});
