console.log("HTML helper script loaded ");

load_dom_listeners();

function load_dom_listeners() {
// Add event listener for copy icon
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector('.copy-icon').addEventListener('click', function() {
            const accountNumber = document.querySelector('.account-number-text').innerText;
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    alert('Account number copied!');

                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    });

}

function auth_url_generated(auth_url){
    if (auth_url) {
        window.location.href = auth_url;
    } else {
        console.error('No authorization URL provided');
    }
}
