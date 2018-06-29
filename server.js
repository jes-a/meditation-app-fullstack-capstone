'use strict';

const User = require('./models/users');
const Session = require('./models/sessions');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();


app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.Promise = global.Promise;


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});



// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server;

function runServer(databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                    console.log(`Listening on localhost:${config.PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}


if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}


function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

// ---------------USER ENDPOINTS------------------------------
// POST
// Create a new user

app.post('/users/create', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    password = password.trim();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error on genSalt'
            });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error on hash'
                });
            }

            User.create({
                email,
                password: hash, 
            }, (err, item) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Error on Create User'
                    });
                }
                if (item) {
                    console.log(`New user with email ${email} was created`);
                    return res.json(item);
                }
            });
        });
    });

});


// User log in 
app.post('/signin', function(req, res) {
    User
        .findOne({
            email: req.body.email
        }, function(err, items) {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            if (!items) {
                //bad email
                return res.status(401).json({
                    message: "Not found"
                });
            } else {
                items.validatePassword(req.body.password, function(err, isValid) {
                    if (err) {
                        console.log('There was an error validating email or password.');
                    }
                    if (!isValid) {
                        return res.status(401).json({
                            message: "Not found"
                        });
                    } else {
                        console.log("user logged in successfully");
                        return res.json(items);
                    }
                });
            };
        });
});


// POST
// Add a session
app.post('/sessions/create', (req, res) => {
    let sessionDate = req.body.sessionDate;
    let sessionDateUnix = req.body.sessionDate;
    let sessionTime = req.body.sessionTime;
    let sessionType = req.body.sessionType;
    let journalEntry = req.body.journalEntry;

    Session.create({
        sessionDate, 
        sessionDateUnix,
        sessionTime,
        sessionType,
        journalEntry
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error on session.add'
            });
        }
        if (item) {
            console.log(`Session added for ${sessionDate}`);
            return res.json(item);
        }
    }); 
}); 


// GET
// Get sessions to populate journal screen
app.get('/sessions-journal', (req, res) => {
    Session
        .find()
        .sort({sessionDate: -1})
        .then((sessions) => {
            let sessionOutput = [];
            sessions.map(function(session) {
                sessionOutput.push(session);
            });
            res.json(sessionOutput);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});


// DELETE 
// Delete Journal entry from journal screen 
app.delete('/sessions/:id', (req, res) => {
    Session
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted entry with id \`${req.params.id}\``);
            res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error deleting entry'
            })
        });
});

// ---------------MISC------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;