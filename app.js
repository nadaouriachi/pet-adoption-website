const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files 
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to handle form data
app.use(express.urlencoded({ extended: true })); 

// Set up express-session
app.use(session({
    secret: 'yourSecretKey',  
    resave: false,            
    saveUninitialized: false, 
    cookie: { 
        secure: false,       
        maxAge: 1000 * 60 * 60 * 24  // 1 day
    }
}));

// Route for the home page
app.get('/', (req, res) => {
    res.render('home-page'); 
});

// Route for the find a dog/cat page
app.get('/find-pet', (req, res) => {
    res.render('find-pet');  
});

// Route for the dog care page
app.get('/dog-care', (req, res) => {
    res.render('dog-care');
});

// Route for the cat care page
app.get('/cat-care', (req, res) => {
    res.render('cat-care');
});

// Route for the contact us page
app.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

// Route for the disclaimer page
app.get('/disclaimer', (req, res) => {
    res.render('disclaimer');
});

// Serve the login page
app.get('/login', (req, res) => {
    res.render('login'); 
});

// Define the path to the login file
const loginFilePath = path.join(__dirname, 'login.txt');

// Function to verify login credentials
function verifyLogin(username, password, callback) {
    fs.readFile(loginFilePath, 'utf-8', (err, data) => {
        if (err) return callback("Error reading login file.");

        const users = data.split('\n').map(line => line.split(':')); // Split file by lines and then by colon
        const user = users.find(user => user[0] === username && user[1] === password);

        if (user) {
            callback(null);
        } else {
            callback("Invalid username or password.");
        }
    });
}

// Route to handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    verifyLogin(username, password, (err) => {
        if (err) {
            return res.render('login', { error: err });
        }
        req.session.user = { username };
        res.redirect('/giveaway-pet');
    });
});

// Route to handle sign up form submission
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    fs.readFile(loginFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading login file.");

        const users = data.split('\n').map(line => line.split(':')); // Split file by lines and then by colon
        const userExists = users.some(user => user[0] === username);

        if (userExists) {
            return res.render('create-account', { error: "Username already exists. Please choose another." });
        }

        // If username is unique, append username and password to login.txt (other verification is handled by script.js)
        const newUser = `${username}:${password}\n`;
        fs.appendFile(loginFilePath, newUser, 'utf-8', (err) => {
            if (err) return res.status(500).send("Error writing to login file.");

            // Set up session and redirect
            req.session.user = { username };
            res.redirect('/giveaway-pet');
        });
    });
});

// Route for the create account page
app.get('/create-account', (req, res) => {
    res.render('create-account'); 
});

// Route for find pet page
app.get('/find-pet', (req, res) => {
    res.render('find-pet');  
});
// Define the path to the pets data file
const petsFilePath = path.join(__dirname, 'available-pet-information.txt');

// Route to handle giveaway pet form submission
app.post('/giveaway-pet', (req, res) => {
    const {
        'pet-type': petType, 
        breed, 
        age, 
        gender, 
        'gets-along-with': getsAlongWith, 
        'additional-info': additionalInfo, 
        'owner-first-name': ownerFirstName, 
        'owner-last-name': ownerLastName, 
        'owner-email': ownerEmail,
        'pet-name': petName,
    } = req.body;

    // Generate a unique pet ID
    fs.readFile(petsFilePath, 'utf-8', (err, data) => {
        // Set default ID
        let newPetId = 1;
        
        // Process existing data if available
        if (!err && data) {
            const petEntries = data.split('\n').filter(Boolean);
            if (petEntries.length > 0) {
                const lastEntry = petEntries[petEntries.length - 1];
                const lastId = parseInt(lastEntry.split(':')[0]);
                newPetId = lastId + 1;
            }
        }

        const formattedBreed = (breed == ',mixed' ? 'mixed' : breed);
        const petData = `${newPetId}:${req.session.user.username}:${petType}:${formattedBreed}:${age}:${gender}:${getsAlongWith}:${additionalInfo}:${ownerFirstName}:${ownerLastName}:${ownerEmail}:${petName}\n`;

        // Append the new pet data to the pets file
        fs.appendFile(petsFilePath, petData, (err) => {
            if (err) {
                console.error('Error writing to pets file:', err);
                res.status(500).send('Error saving pet data.');
            } else {
                return res.render('giveaway-pet', { message: "Pet data saved successfully!" });
            }
        });
    });
});

// Route for the giveaway pet page (if logged in)
app.get('/giveaway-pet', (req, res) => {
    if (req.session.user) {
        res.render('giveaway-pet'); 
    } else {
        // If no session exists, render the login page
        res.redirect('/login');
    }
});

// Route to handle find pet form submission
app.post('/find-pet', (req, res) => {
    console.log(req.body);
    const {  
        'pet-type': petType,
        breed,
        age,
        gender,
        'gets-along-with': getsAlongWith,
    } = req.body;

    const matches = [];

    // Convert breed and getsAlongWith to arrays if they're not
    const breedArray = Array.isArray(breed) ? breed : [breed];
    const getsAlongWithArray = Array.isArray(getsAlongWith) ? getsAlongWith : [getsAlongWith];

    // Read the pets file
    fs.readFile(petsFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading pet data file:', err);
            return res.status(500).send('Error reading pet data.');
        }

        // Split file data into individual pet entries and remove empty lines
        const petEntries = data.split('\n').filter(Boolean);

        // Loop through each pet entry to check for matches
        petEntries.forEach(petEntry => {
            const petInfo = petEntry.split(':');    

            // Check if gets-along-with matches
            const petAttributes = petInfo[6].split(',');
            const getsAlongWithMatch = getsAlongWithArray.every(attr => 
                attr === 'doesnt-matter' || petAttributes.includes(attr)
            );

            // Check if the pet matches the user's search criteria
            if (
                (petType === petInfo[2]) &&
                (breedArray[0].toLowerCase() === petInfo[3].toLowerCase() || breedArray[1] == 'doesnt-matter') &&
                (age === petInfo[4] || age === 'doesnt-matter') &&
                (gender === petInfo[5] || gender === 'doesnt-matter') &&
                getsAlongWithMatch
            ) {
                matches.push(petInfo); 
            }
        });

        // After loop, render page with matched pets
        if (matches.length > 0) {
            res.render('pets', { matches });
        } else {
            res.render('find-pet', { message: 'No pets found matching your criteria.' });
        }
    });
});

// Route for the find pet page
app.get('/pets', (req, res) => {
    res.render('pets');  
});

// Route for logging out
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('logout', { message: 'You have been successfully logged out!' });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});