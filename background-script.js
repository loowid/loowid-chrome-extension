﻿//Background script used to interact with desktopCapture API
var session = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(portOnMessageHanlder);
    
    // this one is called for each message from "content-script.js"
    function portOnMessageHanlder(message) {
		
	var extMsg = 'get-sourceId-from-ext-' + chrome.runtime.id;
	if(message == extMsg){
            chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, onAccessApproved);
        }
    }

    // on getting sourceId
    // "sourceId" will be empty if permission is denied.
    function onAccessApproved(sourceId) {
        console.log('sourceId', sourceId);
        
        // if "cancel" button is clicked
        if(!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }
        
        // "ok" button is clicked; share "sourceId" with the
        // content-script which will forward it to the webpage
        port.postMessage({
            sourceId: sourceId
        });
    }
});
