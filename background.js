// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//         console.log('The color is green.');
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [new chrome.declarativeContent.PageStateMatcher({
//                 pageUrl: {hostEquals: 'developer.chrome.com'},
//             })
//             ],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    });
    new chrome.declarativeContent.ShowPageAction();
});