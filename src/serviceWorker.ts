// chrome.runtime.onInstalled.addListener(
//     (details) => {
//     }
// )

chrome.runtime.onMessage.addListener(
    (request/*, sender, sendResponse*/) => {
        if (typeof request.action !== 'string') {
            console.error('Received request without mandatory action property.', request);
            return;
        }
        switch (request.action) {
            // case 'get/ban/list':
            //     sendBanList(sendResponse);
            //     return;
            // case 'get/ban/card':
            //     sendBanStatus(request.cardName, sendResponse);
            //     return;
            // case 'get/card/info':
            //     sendCardInfo(request.cardName, sendResponse);
            //     return;
            // case 'get/cards/info':
            //     sendCardsInfo(request.cardNames, sendResponse);
            //     return;
            default:
                console.error('Unknown action "' + request.action + '" in request.', request);
                return;
        }
    },
);
