let callback_url = "http://localhost/dumsa/dues_transaction_verification.html";
let home_url = "http://localhost/dumsa/api/";
let paystack_home_url = home_url + "paystack_api/";
let get_authorisation_end_point = paystack_home_url + "get_paystack_auth_url.php";
let add_auth_details = paystack_home_url + "add_generated_url_details.php";
let get_prices_url = home_url + "get_dumsa_dues_prices.php";
let confirm_student_url = home_url + "confirm_student_name.php";
let is_confirmed_button_clicked = false;
let standard_dues = 0;
let fresher_dues = 0;
let classes_loaded = false;
let class_list = "";
let authorisation_url = ""
let amount = 0;
let confirm_button = "";
let input_error = true;
let error_message = "Please Fill In necessary items";

load_classes();
get_dues_prices();
initial_dom_build();

function updateDuesAmount(duesAmount) {
    const duesElement = document.querySelector('.payment-header p:nth-child(3)');
    duesElement.textContent = `₦ ${duesAmount}`;
}

function enableConfirmButton(b) {
    if (b) {
        confirm_button.classList.remove('disabled-button');
        confirm_button.classList.add('confirm-button');
    } else {
        confirm_button.classList.add('disabled-button');
        confirm_button.classList.remove('confirm-button');
    }

}

function confirmed_button_clicked() {
    // Validate name field
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
        nameInput.classList.add('error-input');
        nameError.textContent = 'Name is required';
        nameInput.focus();
        return;
    } else if (/\d/.test(nameInput.value)) {
        nameInput.classList.add('error-input');
        nameError.textContent = 'Name cannot contain numbers';
        nameInput.focus();
        return;
    } else if (nameInput.value.trim().split(/\s+/).length < 2) {
        nameInput.classList.add('error-input');
        nameError.textContent = 'Please enter at least two words for the name';
        nameInput.focus();
        return;
    } else {
        nameInput.classList.remove('error-input');
        nameError.textContent = '';
    }

    // Validate email field
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add('error-input');
        emailError.textContent = 'Invalid email address';
        emailInput.focus();
        return;
    } else {
        emailInput.classList.remove('error-input');
        emailError.textContent = '';
    }

    // Validate class field
    const classInput = document.getElementById('class');
    const classError = document.getElementById('class-error');
    if (!classInput.value.trim()) {
        classInput.classList.add('error-input');
        classError.textContent = 'Class is required';
        classInput.focus();
        return;
    } else {
        classInput.classList.remove('error-input');
        classError.textContent = '';
    }

    // Proceed with the rest of the function if all fields are valid
    if (is_confirmed_button_clicked) {
        console.log("already clicked");
        return;
    }

    enableConfirmButton(false);
    console.log("confirm button clicked");

    const data = {
        name: nameInput.value,
        email: emailInput.value,
        level: classInput.value,
        callback_url: callback_url,
        amount: amount * 100
    };
    is_confirmed_button_clicked = true;

    // Add fetch request to send name and class to PHP script
    fetch(confirm_student_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nameInput.value, class: classInput.value })
    })
        .then(response => response.json())
        .then(result => {
            // Handle the response as needed
            console.log(result);
            if (result.status) {
                const matches = result.matches;
                if (matches.length === 0) {
                    no_match_found();
                } else if (matches.length === 1) {
                    const matchedName = matches[0];
                    if (confirm(`Please confirm that you are paying dues for ${matchedName} in ${classInput.value}.`)) {
                        // Proceed with getting the payment URL
                        get_payment_url(data);
                    } else {
                        enableConfirmButton(true);
                        is_confirmed_button_clicked = false;
                    }
                } else {
                    const suggestions = matches.join(' or ');
                    nameError.textContent = `Did you mean ${suggestions}?`;
                    enableConfirmButton(true);
                    is_confirmed_button_clicked = false;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            enableConfirmButton(true);
            is_confirmed_button_clicked = false;
        });
}

function no_match_found() {
    const nameError = document.getElementById('name-error');
    nameError.textContent = 'No such name in class, please try again or contact support';
    enableConfirmButton(true);
    is_confirmed_button_clicked = false;
}


function initial_dom_build() {
    //confirm button clicked code, a bit tied, but todo : rework when using react or a reasonable framework
    confirm_button = document.querySelector('.confirm-button');
    document.addEventListener('DOMContentLoaded', function () {
        const classSelect = document.getElementById('class');
        classSelect.addEventListener('change', function () {
            const selectedIndex = classSelect.selectedIndex;
            console.log("index selected is " + selectedIndex);
            let duesAmount = standard_dues;
            if (selectedIndex === 1) {
                duesAmount = fresher_dues;
            }
            amount = duesAmount;
            updateDuesAmount(duesAmount);
        });
        document.querySelector('.confirm-button').addEventListener('click', function () {
            confirmed_button_clicked();

        });
        const namePattern = /^[a-zA-Z\s]+$/; // Only allows letters and spaces
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
        validateInput('name', 'name-error', namePattern, 'Invalid name. Only letters and spaces allowed.');
        validateInput('email', 'email-error', emailPattern, 'Invalid email address.');
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

function get_dues_prices() {
    let data_result = "";
    const payload = {
        random: "change this abeg"
    }
    fetch(get_prices_url, {
        method: 'POST',
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
            if (fresher_dues === 0 || standard_dues === 0) {
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
            if (result.status) {
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
            } else {
                console.log("Authorization unsuccessful")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fill_class_form() {
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

function validateInput(id, errorId, pattern, errorMessage) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    input.addEventListener('input', function () {
        input_error = false;
        if (!pattern.test(input.value)) {
            input.classList.add('error-input');
            error.textContent = errorMessage;
            error_message = errorMessage;
            input_error = true;
        } else if (id === 'name' && input.value.trim().split(/\s+/).length < 2) {
            input.classList.add('error-input');
            error.textContent = 'At least two names please.';
            error_message = error.textContent;
            input_error = true;
        } else {
            input.classList.remove('error-input');
            error.textContent = '';
            input_error = false;
        }
        if (!input_error) {//if valid, authenticate
            console.log(input.value + " is a valid input from element " + id)
            if (id === "name") {
                let name_var = input.value;
            }
        }
    });
}

function getDateAsString() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let day = String(currentDate.getDate()).padStart(2, '0');
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}