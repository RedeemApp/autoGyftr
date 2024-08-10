// // content.js
// let count = 0;

// chrome.runtime.onMessage.addListener(function(request) {
//     if (request == 'startExtraction') {
//         extractAmazonCode();
//     }
// });

// function extractAmazonCode() {
//     // Test if any content script works in amazon
//     let input = document.querySelector('input[name="claimCode"]');
//     console.log(input);
//     // End of test
//     const emails = document.querySelectorAll('.adn.ads');
//     for (let email of emails) {
//         const body = email.innerText;
//         if (body.toLowerCase().includes('gift') && body.toLowerCase().includes('amazon')) {
//             // codes like AAAA-AAAAAA-AAAA and stuff.
//             const match = body.match(/(\b[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{4}\b)|(\b[A-Z0-9]{14}\b)|(\b[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{3}\b)/);
//             if (match) {
//                 const code = match[0];
    
//                 // saving code to storage
//                 const codeKey = 'code' + (++count);

//                 // Sending the code in a unique message
//                 // let URL = "https://www.amazon.in/apay-products/apv/landing?ref_=apay_deskhome_AmazonVouchers/ref=in-apay_allgc_halo&" + codeKey + "=" + code;
//                 let URL = "https://www.amazon.in/gp/buy/payselect/handlers/display.html?_from=cheetah&" + codeKey + "=" + code;
//                 chrome.runtime.sendMessage({action: "openAmazonTab", url: URL}, function(response) {
//                 console.log(response);
//                 });

//             }
//         }
//     }
// }

// // https://www.amazon.in/gp/buy/payselect/handlers/display.html?hasWorkingJavascript=1


let count = 0;
let myCodes = [];  // Array to hold your codes

chrome.runtime.onMessage.addListener(function(request) {
    if (request == 'startExtraction') {
        extractAmazonCode();
    }
});

function extractAmazonCode() {
    // Test if any content script works in amazon
    let input = document.querySelector('input[name="claimCode"]');
    console.log(input);
    // End of test
    let URL = "https://www.amazon.in/gp/buy/payselect/handlers/display.html?_from=cheetah&"
    const emails = document.querySelectorAll('.adn.ads');
    for (let email of emails) {
        const body = email.innerText;

        if (body.toLowerCase().includes('gift') && body.toLowerCase().includes('amazon')) {
            // codes like AAAA-AAAAAA-AAAA and stuff.
            const match = body.match(/(\b[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{4}\b)|(\b[A-Z0-9]{14}\b)|(\b[A-Z0-9]{4}-[A-Z0-9]{6}-[A-Z0-9]{3}\b)/);
            if (match) {
                const code = match[0];
                // adding code to codes array
                myCodes.push(code);

                // saving code to storage
                const codeKey = 'code' + (++count);
                
                URL = "https://www.amazon.in/gp/buy/payselect/handlers/display.html?_from=cheetah&" + codeKey + "=" + code;
                if (code.includes("-") && code.length == 15)
                {
                    URL = "https://www.amazon.in/apay-products/apv/landing?ref_=apay_deskhome_AmazonVouchers/ref=in-apay_allgc_halo&" + codeKey + "=" + code;
                }
                

            }
        }
    }

    saveCodesToLocalStorage();
    chrome.runtime.sendMessage({action: "openAmazonTab", url: URL}, function(response) {
        console.log(response);
    });
}

// Function to save codes to localStorage
function saveCodesToLocalStorage() {
    // localStorage.setItem('myCodes', JSON.stringify(myCodes));
    chrome.storage.sync.set({myCodes: myCodes}, function() {});
}