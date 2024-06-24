let callback_url = "http://localhost/dumsa/dues_transaction_verification.html";
let home_url =  "http://localhost/dumsa/api/";
let paystack_home_url = home_url + "paystack_api/";
let get_authorisation_end_point = paystack_home_url + "get_paystack_auth_url.php";
let add_auth_details = paystack_home_url + "add_generated_url_details.php";
let get_prices_url = home_url + "get_dumsa_dues_prices.php";
let confirmed_button_clicked = false;
let standard_dues = 0;
let fresher_dues = 0;
let classes_loaded = false;
let class_list = "";
let authorisation_url = ""

load_classes();
get_dues_prices();
initial_dom_build();

function initial_dom_build(){
    //confirm button clicked code, a bit tied, but todo : rework when using react or a reasonable framework
    document.addEventListener('DOMContentLoaded', function () {
        const confirm_button = document.querySelector('.confirm-button');
        document.querySelector('.confirm-button').addEventListener('click', function () {
            if (confirmed_button_clicked) {
                console.log("already clicked");
                //todo: is there a better way ?
                return;
            }
            console.log("confirm button clicked");
            confirm_button.classList.add('disabled-button');
            confirm_button.classList.remove('confirm-button');
            // Get form data
            //todo : ensure it checks for errors
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const userClass = document.getElementById('class').value;

            const data = {
                name: name,
                email: email,
                level: userClass,
                callback_url: callback_url
            };
            confirmed_button_clicked = true;
            get_payment_url(data);
        });
    });

}

//todo : PREPARE FOR CASES WHERE FOR SOME REASONS DATA FAILS TO LOAD FROM SERVER, BEFORE PUSHING TO PROD

function load_classes() {
    let endpoint = home_url + "get_all_level_list.php"
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status) {
                const classes = result.data;
                console.log('Classes:', classes);
                class_list = classes;
                classes_loaded = true;
                fill_class_form();
            } else {
                console.log('Error:', result.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function get_dues_prices(){
    let data_result = "";
    const payload = {
        random: "change this abeg"
    }
    fetch(get_prices_url, {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => response.json())
        .then(result => {
            console.log(result)
            result.data.forEach(item => {
                if (item.key_ === 'fresher_dues') {
                    fresher_dues = item.value_;
                } else if (item.key_ === 'standard_dues') {
                    standard_dues = item.value_;
                }
            });
            console.log('Fresher Dues:', fresher_dues);
            console.log('Standard Dues:', standard_dues);
            if (fresher_dues  === 0|| standard_dues ===0){
                console.log("could not load dues;")
            }
        });
}
function get_payment_url(data) {
    let result_paystack = "";
    let user_data = data;//may be redundant,but let's do it this way first
    fetch(get_authorisation_end_point, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if(result.status){
                console.log("Authorization created successfully")
                //todo : show circular progress bar
                //read data
                let access_code = result.data.access_code;
                authorisation_url = result.data.authorization_url;
                let reference = result.data.reference;
                const upload_auth_details_json = {
                    ...data,
                    access_code: access_code,
                    amount: 1000,
                    user_hash: "rand",
                    authorisation_url: authorisation_url,
                    reference: reference,
                    callback: callback_url,
                    transaction_date: getDateAsString()
                }
                //upload data to server
                fetch(add_auth_details, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(upload_auth_details_json)
                })
                    .then(uploadResponse => uploadResponse.json())
                    .then(uploadResult => {
                        console.log('Upload Result:', uploadResult);
                        // Handle the result as needed, e.g., show a success message
                        console.log(authorisation_url)
                        auth_url_generated(authorisation_url); // Add this line here to call the function after the upload
                    })
                    .catch(uploadError => {
                        console.error('Upload Error:', uploadError);
                    });
            }
            else{
                console.log("Authorization unsuccessful")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fill_class_form(){
    const classList = class_list;
    const classSelect = document.getElementById('class');

    classList.sort((a, b) => a - b);//sorting numerically, smart right?
    classList.forEach(cls => {
        const formattedClass = cls.slice(0, 2) + '/' + cls.slice(2);
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = formattedClass;
        classSelect.appendChild(option);
    });
}

function getDateAsString(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let day = String(currentDate.getDate()).padStart(2, '0');
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

