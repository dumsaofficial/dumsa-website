console.log("pending payment script loaded")

const home_url = "http://localhost/dumsa/api/";
const verify_transact_url = home_url + "verify_paystack_payment.php"
let percent_progress = 0;
let max_percent = 30;
let timeout = 150;//in milisecs

verifyTransaction();

// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const trxref = params.get('trxref');
    const reference = params.get('reference');
    console.log("ref is " + trxref + " <> " + reference)
    return {trxref, reference};
}


function startCountdown() {

}

function change_max_percent(number) {
    max_percent = 100;

}

function change_rate_increase(number) {
    timeout = number;
}

function transactionResult(status) {
    if (status === "success") {//maybe not hardcoded?
        console.log("Transaction Successful ");
        change_max_percent(100);
        change_rate_increase(20)
        changeMessage("Payment Successful, Thank you");
        changeSubMessage("")
    }
}

function verifyTransaction() {
    const {trxref, reference} = getQueryParams();
    if (trxref && reference) {
        console.log(`Verifying transaction with trxref: ${trxref} and reference: ${reference}`);
        progressivelyIncreaseRate();
        startCountdown();
        fetch(verify_transact_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({trxref, reference})
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status) {//note: According to paystack docs, this is the status of the API call not the status of the transaction
                    transactionResult(data.data.status);
                }
            })
            .catch(error => {
                console.error('Error verifying transaction:', error);
            });
    } else {
        console.error('Transaction reference or reference is missing');
        //todo handle appropriatelu
    }
    console.log("Waiting for fetch")
}


function changeProgressText(percentage_increase) {
    if (percent_progress > max_percent) {
        percent_progress--;//dumb, maybe
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
    // Logic to navigate to the home page
    window.location.href = 'home.html'; // Change this to your actual home page URL
}

function getHelp() {
    // Logic to show help information
    alert('Help information will be displayed here.');
}

