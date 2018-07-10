'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');

const Session = require('../models/sessions');
const User = require('../models/users');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const should = chai.should();
chai.use(chaiHttp);


// Create user to seed db and test create user 
function generateUser() {
	return {
		email: faker.internet.email(),
		password: faker.internet.password() 
	}
}

function seedUserData() {
	console.info('Seeding user data');
	const seedData = [];

	for (let i=1; i<10; i++) {
		seedData.push(generateUser());
	}
	return User.insertMany(seedData);
}


function generateType() {
	const type = ['insight', 'headspace', 'timer', 'unassisted'];
	return type[Math.floor(Math.random() * type.length)];
}

const userId = faker.random.word();

function generateSessionData() {

	let sessionDate = moment(faker.date.recent()).format();
	let sessionDateUnix = moment(sessionDate).unix();
	return {
		loggedInUserId: userId,
		sessionDate: sessionDate,
		sessionDateUnix: sessionDateUnix,
		sessionTime: faker.random.number(),
    	sessionType: generateType(),
    	journalEntry: faker.lorem.paragraph()
	}
}

// Seed session Data
function seedSessionData() {
	console.info('Seeding session data');
	const seedData = [];

	for (let i=1; i<=10; i++) {
		seedData.push(generateSessionData());
	}
	console.log(seedData);


	return Session.insertMany(seedData);
}

// Tear down Database after each test
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// --------------- Test User Endpoints ---------------

describe('User API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL)
		.then(console.log('Running server'))
		.catch(err => console.log({err}));
	});

	beforeEach(function() {
		return seedUserData(); 
	});

	// Test create a new user
	it('should create a new user', function() {
		const newUser = generateUser();
		return chai.request(app)
			.post('/users/create')
			.send(newUser)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.include.keys('email', 'password');
				res.body.email.should.equal(newUser.email);
				res.body.password.should.not.equal(newUser.password);	
				res.body._id.should.not.be.null;
			});
	});

	// Change user password
	it('should update user password', function() {
		const updateUser = generateUser();
		const updatePw = {
			pw: faker.random.word()
		}

		return User 
			.findOne()
			.then(function(user) {
				updateUser.id = user._id;

				return chai.request(app)
					.put(`/user-pw/${updateUser.id}`)
					.send(updatePw);
			})
			.then(function(res) {
				res.should.have.status(200);
				return User.findById(updateUser.id);
			})
			.then(function(user) {
				user.password.should.not.be.null;
				user.password.should.not.equal(updatePw);
			})	
	});


	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
});


// --------------- Test Session Endpoints ---------------

describe('Session API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL)
		.then(console.log('Running server'))
		.catch(err => console.log({err}));
	});

	beforeEach(function() {
		return seedSessionData(); 
	});

	// Test create a new session
	it('should create a new session', function() {
		const newSession = generateSessionData();
		return chai.request(app)
			.post('/sessions/create')
			.send(newSession)
			.then(function(res) {
				console.log(res);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.include.keys(
					'loggedInUserId', 
					'sessionDate',
					'sessionDateUnix',
					'sessionTime',
					'sessionType',
					'journalEntry');
				res.body.loggedInUserId.should.equal(newSession.loggedInUserId);
				res.body.sessionDate.should.equal(newSession.sessionDate);
				res.body.sessionDateUnix.should.equal(newSession.sessionDateUnix);
				res.body.sessionTime.should.equal(newSession.sessionTime);
				res.body.sessionType.should.equal(newSession.sessionType);
				res.body.journalEntry.should.equal(newSession.journalEntry);	
				res.body._id.should.not.be.null;
			});
	});

	// Test add total days to dashboard
	it('should add total days to dashboard', function() {
		return chai.request(app)
			.get('/sessions-total/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('number');
			});	
	});

	// Test add streak days to dashboard
	it('should add days in a row to dashboard', function() {
		return chai.request(app)
			.get('/sessions-streak/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});

	// Test add last ten days to dashboard
	it('should add last ten days to dashboard', function() {
		return chai.request(app)
			.get('/sessions-ten/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});

	// Test add most used method to dashboard
	it('should add most used method to dashboard', function() {
		return chai.request(app)
			.get('/sessions-method/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});

	// Test add average session time to dashboard
	it('should add average session time to dashboard', function() {
		return chai.request(app)
			.get('/sessions-avg/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});

	// Test add journal sessions to dashboard
	it('should add journal entries to dashboard', function() {
		return chai.request(app)
			.get('/sessions-journal-sb/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});


	// Test add journal sessions to insight page
	it('should add journal entries to insight page', function() {
		return chai.request(app)
			.get('/sessions-journal/' + userId)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
			});	
	});

	// Test delete journal session on insight page
	it('should delete a journal entry from journal page', function() {

		let session;

		return Session
			.findOne()
			.then(function(_session) {
				session = _session;
				return chai.request(app).delete(`/sessions/${session._id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Session.findById(session._id)
			})
			.then(function(_session) {
				should.not.exist(_session);
			});
	});



	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
});


