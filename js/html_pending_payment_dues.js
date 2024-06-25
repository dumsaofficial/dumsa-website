console.log("pending payment script loaded");
const home_url = base+"/api/";
const verify_transact_url = home_url + "verify_paystack_payment.php";
 const transaction_details_url = home_url + "get_transaction_details_from_ref.php"; // New endpoint to get transaction details
const receipt_url = home_url + "generate_receipt.php";
let percent_progress = 0;
let max_percent = 30;
let timeout = 150; // in milliseconds
let debug = false; // todo turn off in production
verifyTransaction();

// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    let trxref = params.get('trxref');
    let reference = params.get('reference');
    console.log("ref is " + trxref + " <> " + reference);
    if (debug) {
        reference = "l3okxkt9b9";
        trxref = reference;
    }
    return { trxref, reference };
}

function startCountdown() {}

function change_max_percent(number) {
    max_percent = number;
}

function change_rate_increase(number) {
    timeout = number;
}

function goHome() {
    window.location.href = 'index.html'; // Change this to your actual home page URL
}

function fetchTransactionDetails(reference) {
    return fetch(transaction_details_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({reference: reference })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                console.log(data)
                return data.data; // Assuming the response contains the transaction details under 'data'
            } else {
                throw new Error('Failed to fetch transaction details');
            }
        })
        .catch(error => {
            console.error('Error fetching transaction details:', error);
            throw error;
        });
}

function downloadReceipt(transactionDetails) {
    changeMessage("Downloading Receipt");
    const payload = {
        name: transactionDetails.name,
        amountPaid: transactionDetails.amount,
        sessionPaid:"2023/2024",//todo: fetch this from database
        reference: transactionDetails.reference
    }
    console.log(payload)

    fetch(receipt_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `receipt_${transactionDetails.reference}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            console.log('Receipt downloaded successfully');
            goHome();
        })
        .catch(error => {
            console.error('Error downloading receipt:', error);
        });
}

function transactionResult(status) {
    if (status === "success") {
        console.log("Transaction Successful ");
        change_max_percent(100);
        change_rate_increase(20);
        changeMessage("Payment Successful, Thank you");
        changeSubMessage("Please wait while your receipt is being downloaded");
        const { reference } = getQueryParams();
        fetchTransactionDetails(reference)
            .then(transactionDetails =>downloadReceipt(transactionDetails))
            .catch(error => console.error('Error processing receipt:', error));
    }
}

function verifyTransaction() {
    const { trxref, reference } = getQueryParams();
    if (trxref && reference) {
        console.log(`Verifying transaction with trxref: ${trxref} and reference: ${reference}`);
        progressivelyIncreaseRate();
        startCountdown();
        fetch(verify_transact_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference: reference })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status) {
                    transactionResult(data.data.status);
                }
            })
            .catch(error => {
                console.error('Error verifying transaction:', error);
            });
    } else {
        console.error('Transaction reference or reference is missing');
        // todo handle appropriately
    }
    console.log("Waiting for fetch");
}

function changeProgressText(percentage_increase) {
    if (percent_progress > max_percent) {
        percent_progress--; // decrement to max_percent
        percentage_increase = percent_progress;
    }
    document.getElementById('progress-text').innerText = `${percentage_increase}%`;
}

function progressivelyIncreaseRate() {
    changeProgressText(percent_progress++);
    setTimeout(progressivelyIncreaseRate, timeout);
}

function changeMessage(text) {
    document.getElementById('message').innerText = text;
}

function changeSubMessage(text) {
    document.getElementById('sub-message').innerText = text;
}

function navigateHome() {
 //   window.location.href = 'home.html'; // Change this to your actual home page URL
}

function getHelp() {
    alert('Help information will be displayed here.');
}
