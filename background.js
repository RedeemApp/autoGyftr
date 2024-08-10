// background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("mesage  recvd");

    if (request.action == "openAmazonTab") {
        let URL = request.url;
        chrome.tabs.query({url: URL}, function(tabs) {
            console.log("tabs length " + tabs.length);
            if (tabs.length) {
                processTab(tabs[0], request.code); // process existing tab
            } else {
                chrome.tabs.create({ url: URL}, function (tab) {
                    console.log('New tab opened with id ' + tab.id);
                    // add listener to wait for the tab to finish loading
                    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                        if (info.status === 'complete' && tabId === tab.id) {
                            chrome.tabs.onUpdated.removeListener(listener);
                            // processTab(tab, request.code); // process newly created tab
                        }
                    });
                });
            }
        });
    }
});




// function processTab(tab){
//     console.log(`loaded fully ${tab.id}. URL: ${tab.url}`);
//     // Extract the code from the URL
//     let urlParams = new URLSearchParams(tab.url);
//     let codeKeys = Array.from(urlParams.keys()).filter(key => key.startsWith('code'));
//     for (let codeKey of codeKeys) {
//       let code = urlParams.get(codeKey);
//       // Now you can use 'code' in your script...
      
//       // For example
//       console.log(codeKey + " code: " + code);
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id, allFrames: true },
//         func: () => { 
//           // Your code here, including the usage of 'code'
//           console.log('ExecuteScript is working!'); 
//         }
//       }, (results) => {
//         if (chrome.runtime.lastError) {
//           console.log("eeeeeeeeee");
//           console.error(chrome.runtime.lastError);
//         } else {
//           console.log("done");
//         }
//       });
//     }
//   }

  
// console.log("bg");