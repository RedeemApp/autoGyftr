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
            function sendKey(key, input) {
                // Create a new 'KeyboardEvent' instance.
                const keyboardEvent = new KeyboardEvent('keydown', {key: key});

                // Dispatch the event, it makes the input element "believe" a user is typing on the keyboard
                input.dispatchEvent(keyboardEvent);
            }
            // Check for 'claim-Code-input-box' first
            // Unfortunately, the code is not getting populated from the extension.
            // The same might work in console but somehow extension is not able to do it.
            // Must be a permission thing. 
            // Need to find a way as below doesn't work.
            var apayInput = document.getElementById('claim-Code-input-box');
            if (apayInput) {
                console.log("Found APAY balance page claim-Code-input-box");
                apayInput.click();
                setTimeout(function(){
                    apayInput.value = 'YourCalue';
                    $('#claim-Code-input-box').val('33PEH99MM71111').trigger('change');
                    // // For each character in the code at the current index, send the key to the apayInput box
                    alert(codes[index] + " --- code added" 
                        + apayInput.value
                    );
                }, 600);


                setTimeout(function(){
                    console.log("Done waiting. Submitting.")
                    // Code to execute after 2 secs
                    var button = document.querySelector('tux-button.add-gift-card-button');
                    if (button) {
                        button.click();
                    }
                    processedCodes.push(code);  // Store code as processed
                    chrome.storage.sync.set({processedCodes}, function(){
                        console.log(`Code ${code} has been marked as processed.`);
                        setTimeout( function(){
                            window.location.href = 'https://www.amazon.in/apay-products/gc/claim';  // need to go back
                            processTheCode(++index); //increment index (this wont run as page will reload, remove it.)
                            console.log("Sleep for index " + index);
                        }, 5000);
                    });
                }, 2000);


            } else {
                alert("Apay box not found!")
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

                if(input){
                    console.log("----- VVV setting ---")
                    input.value = codes[index];
                    for (var i = 0; i < codes[index].length; i++) {
                        sendKey(codes[index][i], input);
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
            }
        };
        processTheCode(0); //start processing - pass the starting index.
    });

}, 3000);
