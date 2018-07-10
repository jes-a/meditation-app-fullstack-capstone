'use strict';

const User = require('./models/users');
const Session = require('./models/sessions');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const moment = require('moment');
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

// GET
// Check for duplicate email in database for user sign up
app.get('/check-duplicate-email/:inputEmail', (req, res)=>{
    let inputEmail = req.params.inputEmail;
    console.log(inputEmail);
    User
        .find({
            "email": inputEmail
        })
        .then(function (entries) {
            res.json({
                entries
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
    });
})


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
                    return res.status(200).json(item);
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
    let loggedInUserId = req.body.loggedInUserId;
    let sessionDate = req.body.sessionDate;
    let sessionDateUnix = req.body.sessionDateUnix;
    let sessionTime = req.body.sessionTime;
    let sessionType = req.body.sessionType;
    let journalEntry = req.body.journalEntry;

    Session.create({
        loggedInUserId,
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
// Get sessions to populate total days in Dashboard
app.get('/sessions-total/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id})
        .count()
        .then((sessions) => {
            res.json(sessions);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});

// GET
// Get sessions to populate days in a row in Dashboard
app.get('/sessions-streak/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id}, {sessionDateUnix: 1})
        .sort({sessionDateUnix: -1})
        .then((sessions) => {
            res.json(sessions);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});


// GET
// Get sessions to populate last 10 days in Dashboard
app.get('/sessions-ten/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id},{sessionDateUnix: 1})
        .sort({sessionDateUnix: -1})
        .limit(10)
        .then((sessions) => {
            res.json(sessions);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});

// GET
// Get sessions to most used method in Dashboard
app.get('/sessions-method/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id},{sessionType: 1})
        .then((sessions) => {
            res.json(sessions);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});

// GET
// Get sessions to populate avg session length in Dashboard
app.get('/sessions-avg/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id},{sessionTime: 1})
        .then((sessions) => {
            res.json(sessions);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error getting session'
            });
        });
});

// GET
// Get sessions to populate journal sidebar on Home Page
app.get('/sessions-journal-sb/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id})
        .sort({sessionDate: -1})
        .limit(6)
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


// GET
// Get sessions to populate journal screen
app.get('/sessions-journal/:id', (req, res) => {
    console.log(req.params.id);
    Session
        .find({loggedInUserId: req.params.id})
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


// UPDATE
// Update user password
app.put('/user-pw/:id', function(req, res) {
    let password = req.body.pw;
    console.log(password);
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

                User
                    .findByIdAndUpdate(req.params.id, {
                        $set: {password: hash}                    
                    })
                    .then((user) => {
                        return res.json(user);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({
                            message: 'Password was not modified'
                        });
                    });
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