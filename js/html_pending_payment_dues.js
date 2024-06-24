console.log("pending payment script loaded");

const home_url = "http://localhost/dumsa/api/";
const verify_transact_url = home_url + "verify_paystack_payment.php";
const receipt_url = home_url + "generate_receipt.php";
let percent_progress = 0;
let max_percent = 30;
let timeout = 150; // in milliseconds
let debug = true; // todo turn off in production
verifyTransaction();

// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    let trxref = params.get('trxref');
    let reference = params.get('reference');
    console.log("ref is " + trxref + " <> " + reference);
    if (debug) {
        reference = "hqdtpyfdbn";
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

}

function downloadReceipt(reference) {
    changeMessage("Downloading Receipt");

    fetch(receipt_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reference })
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `receipt_${reference}.pdf`;
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
    if (status === "success") { // maybe not hardcoded?
        console.log("Transaction Successful ");
        change_max_percent(100);
        change_rate_increase(20);
        changeMessage("Payment Successful, Thank you");
        changeSubMessage("Please wait while your receipt is being downloaded");
        const { reference } = getQueryParams();
        downloadReceipt(reference);
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
            body: JSON.stringify({ trxref, reference })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status) { // note: According to Paystack docs, this is the status of the API call, not the status of the transaction
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
    window.location.href = 'home.html'; // Change this to your actual home page URL
}

function getHelp() {
    alert('Help information will be displayed here.');
}
