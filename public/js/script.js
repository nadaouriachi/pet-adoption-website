// Updating the time every second
displayTime();
setInterval(displayTime, 1000);

function displayTime(){
    document.getElementById("time").innerHTML = setTime();
}

function setTime(){
    let today = new Date();
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if(hours < 10){
        hours = "0" + hours;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }   
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    return day[today.getDay()] + ", " + month[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear() + " &nbsp | &nbsp " + hours + ":" + minutes + ":" + seconds;
}

// Check if the "Find a Pet" form exists and attach the event listener
const findPetForm = document.getElementById("find-pet-form");
if (findPetForm) {
    findPetForm.addEventListener("submit", verifyFindInputs);
}

// Check if the "Giveaway Pet" form exists and attach the event listener
const giveawayPetForm = document.getElementById("giveaway-pet-form");
if (giveawayPetForm) {
    giveawayPetForm.addEventListener("submit", verifyGiveawayInputs);
}

// Verification function for "Find a Pet" form
function verifyFindInputs(event) {
    const errors = [];
    
    // Pet type verification
    let petType1 = document.getElementById("pet-type1");
    let petType2 = document.getElementById("pet-type2");
    if (!petType1.checked && !petType2.checked) {
        errors.push("Please select a pet type option.");
        event.preventDefault();
    }

    // Breed verification
    let breed1 = document.getElementById("breed1").value;
    let breed2 = document.getElementById("breed2");
    if (!breed2.checked && breed1 == "") {
        errors.push("Please select a breed option.");
        event.preventDefault();
    }
    if (breed2.checked && breed1 !== "") {
        errors.push("Please only select one breed option.");
        event.preventDefault();
    }

    // Age verification
    let age = document.getElementById("age").value;
    if (age == "") {
        errors.push("Please select an age.");
        event.preventDefault();
    }

    // Gender verification
    const genderOptions = document.querySelectorAll('input[name="gender"]');
    let checked = false;
    for (const option of genderOptions) {
        if (option.checked) {
            checked = true;
            break;
        }
    }
    if (!checked) {
        errors.push("Please select a gender.");
        event.preventDefault();
    }

    // Gets along with verification
    const getsAlongWithOptions = document.querySelectorAll('input[name="gets-along-with"]');
    checked = false;
    for (const option of getsAlongWithOptions) {
        if (option.checked) {
            checked = true;
            break;
        }
    }
    if (!checked) {
        errors.push("Please select an option for \"Gets along with\".");
        event.preventDefault();
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
    }
}

// Verification function for "Giveaway Pet" form
function verifyGiveawayInputs(event) {
    const errors = [];
    
    // Pet type verification
    let petType1 = document.getElementById("pet-type1");
    let petType2 = document.getElementById("pet-type2");
    if (!petType1.checked && !petType2.checked) errors.push("Please select a pet type option.");

    // Breed verification    
    let breed1 = document.getElementById("breed1").value;
    let breed2 = document.getElementById("breed2");
    if (!breed2.checked && breed1 == "") errors.push("Please select a breed option.");

    if (breed2.checked && breed1 !== "") errors.push("Please only select one breed option.");

    // Age verification
    let age = document.getElementById("age").value;
    if (age == "") errors.push("Please select an age.");

    // Gender verification
    const genderOptions = document.querySelectorAll('input[name="gender"]');
    let checked = false;
    for (const option of genderOptions) {
        if (option.checked) {
            checked = true;
            break;
        }
    }
    if (!checked) errors.push("Please select a gender.");

    // Owner information verification
    let ownerFirstName = document.getElementById("owner-first-name").value;
    let ownerLastName = document.getElementById("owner-last-name").value;
    let ownerEmail = document.getElementById("owner-email").value;

    if (ownerFirstName == "") errors.push("Please enter the owner's first name.");
    
    if (ownerLastName == "") errors.push("Please enter the owner's last name.");
    
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; 
    if (!emailPattern.test(ownerEmail)) errors.push("Please enter a valid email.");
    
    // Pet name verification
    let petName = document.getElementById("pet-name").value;
    if (petName == "") errors.push("Please enter the pet's name.");
   
    if (errors.length > 0) {
        alert(errors.join("\n"));
        event.preventDefault();
    }
}

// Check if the "Sign Up" form exists and attach the event listener
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", verifySignupInputs);
}

// Verification function for the "Sign Up" form
function verifySignupInputs(event) {
    const errors = [];

    // Username and Password verification
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate username format (letters and digits only)
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(username) || username === "") {
        errors.push("Username can only contain letters and digits.");
        event.preventDefault();
    }

    // Validate password format
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
    if (!passwordPattern.test(password)) {
        errors.push("Password must be at least 4 characters long and contain at least one letter and one digit.");
    }

    // If there are any errors, prevent form submission and display errors
    if (errors.length > 0) {
        alert(errors.join("\n"));
        event.preventDefault();
    }
}