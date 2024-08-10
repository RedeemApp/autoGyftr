setTimeout(function() {

    // Fetch the codes from local storage
    chrome.storage.sync.get(['myCodes', 'processedCodes'], function(data) {
        let codes = data.myCodes || [];
        let processedCodes = data.processedCodes || [];

        var processTheCode = function(index) {
            if( index >= codes.length ) return; //exit condition
            
            const code = codes[index];

            //Skip this code if it's already processed
            if(processedCodes.includes(code)) {
                console.log(`Skipping code ${code} as it's already processed.`);
                processTheCode(++index); //increment index 
                return;
            }

            console.log("Processing code " + code);

            // your existing code here...
                     // Query for the input 
            var input = document.querySelector('input[name="voucherCode"]');

            // if original input not found, try to find the new input box
            if (!input) {
                input = document.querySelector('input[name="ppw-claimCode"]');
            }

            console.log(input);
            console.log(input ? "found" : "not found");

            // Create a new 'KeyboardEvent' instance.
            var keyboardEvent = new KeyboardEvent('keydown');
            function sendKey(key) {
                keyboardEvent.key = key;
                input.dispatchEvent(keyboardEvent);
            }
            if(input){
                console.log("----- VVV setting ---")
                input.value = codes[index];
                for (var i = 0; i < codes[index].length; i++) {
                    sendKey(codes[index][i]);
                }
                console.log(input)
            }
            if (input) {
                var button = document.querySelector('input[name="addVoucher"]');
                var buttonNew = document.querySelector('input[name="ppw-claimCodeApplyPressed"]');
 
                if (button) {
                     button.click();  // Shopping Voucher Button
                }
                else if (buttonNew){
                     buttonNew.click(); // Amazon Pay Voucher Button
                }
             }

                processedCodes.push(code);  // Store code as processed
                chrome.storage.sync.set({processedCodes}, function(){
                    console.log(`Code ${code} has been marked as processed.`);
                    
                    setTimeout( function(){
                        processTheCode(++index); //increment index
                        console.log("Sleep for index " + index);
                    }, 5000);
                });
            
        };
        processTheCode(0); //start processing - pass the starting index.
    });

}, 3000);
