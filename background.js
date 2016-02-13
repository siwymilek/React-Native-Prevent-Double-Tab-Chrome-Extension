var enabled = false;
var RNDebuggerWatcher = function() {
    chrome.tabs.query({
        currentWindow: true
    }, function(tabs) {
        var RNPattern = new RegExp(/http\:\/\/localhost:8081/);
        var RNTabs = [];

        for(var i = 0, count = tabs.length; i < count; i++) {
            if(RNPattern.test(tabs[i].url)) {
                RNTabs.push(tabs[i]);
            }
        }

        if(RNTabs.length > 1) {
            var MainTab = RNTabs[0];
            var TabsToRemove = [];

            for(var i = 0, count = RNTabs.length; i < count; i++) {
                if(MainTab.id != RNTabs[i].id) {
                    TabsToRemove.push(RNTabs[i].id);
                }
            }

            chrome.tabs.remove(TabsToRemove);
            chrome.tabs.reload(MainTab.id);
        }
    });
};

chrome.browserAction.onClicked.addListener(function() {
    enabled = !enabled;

    if(enabled) {
        chrome.browserAction.setIcon({path: 'icon.png'});
        chrome.tabs.onCreated.addListener(RNDebuggerWatcher);
    } else {
        chrome.browserAction.setIcon({path: 'iconOff.png'});
        chrome.tabs.onCreated.removeListener(RNDebuggerWatcher);
    }
});
