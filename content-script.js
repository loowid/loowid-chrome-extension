// this content-script plays role of medium to publish/subscribe messages from webpage to the background script

// this object is used to make sure our extension isn't conflicted with irrelevant messages!



var instMsg = 'is-installed-' + chrome.runtime.id;
var extMsg = 'get-sourceId-from-ext-' + chrome.runtime.id; 

var allowedMessages = {};
allowedMessages[extMsg] = true;
allowedMessages[instMsg] = true;

// this port connects with background script
var port = chrome.runtime.connect();

// if background script sent a message
port.onMessage.addListener(function (message) {
    // get message from background script and forward to the webpage
    window.postMessage(message, '*');
});


// this event handler watches for messages sent from the webpage
// it receives those messages and forwards to background script
window.addEventListener('message', function (event) {

    // if invalid source
    if (event.source != window)
        return;
        
    // if message is not own
    if(!allowedMessages[event.data]) return;
        
    // if browser is asking whether extension is already installed
    if(event.data == instMsg) {
        return window.postMessage('loowid-extension-loaded', '*');
    }

    // if it is something that need to be shared with background script
    if(event.data == extMsg) {
        // forward message to background script
        port.postMessage(event.data);
    }
});

// inform browser that you're available!
window.postMessage('loowid-extension-loaded', '*');
