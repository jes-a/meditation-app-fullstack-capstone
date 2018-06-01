'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');


const Job = require('../models/jobs');
const Boat = require('../models/boats');
const User = require('../models/users');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const should = chai.should();
chai.use(chaiHttp);


// Populate random type and status values for worker
function generateType() {
	const type = ['worker', 'admin'];
	return type[Math.floor(Math.random() * type.length)];
}

function generateStatus() {
	const status = ['active', 'inactive'];
	return status[Math.floor(Math.random() * status.length)];
}

// Create one user to seed users db and test create user
function generateUser() {
	return {
		    firstName: faker.name.firstName(),
		    lastName: faker.name.lastName(),
		    phoneNumber: faker.phone.phoneNumber(),
		    address: faker.address.streetAddress(),
		    address2: faker.address.secondaryAddress(),
		    city: faker.address.city(),
		    state: faker.address.stateAbbr(),
		    zipCode: faker.address.zipCode(),
		    email: faker.internet.email(),
		    password: faker.internet.password(),
		    type: generateType(),
		    status: generateStatus()
	}
}

// Seed Users database
function seedUserData() {
	console.info('Seeding Admin user data');
	const seedData = [];

	for (let i=1; i<10; i++) {
		seedData.push(generateUser());
	}
	return User.insertMany(seedData);
} 

// Seed random services into jobs 
function generateServices() {
	const services = [
		'Wash', 'Hull Wash', 'Topside Wax', 'Hull Wax', 'Compounding Service', 'Interior Cleaning', 'Teak Cleaning', 'Teak Sealing', 'Engine Room Detailing', 'System Check', 'Bottom Cleaning'];
		return services[Math.floor(Math.random() * services.length)];
}

// Create one job to seed jobs db and test create job
function generateJob() {
	return {
			jobName: faker.lorem.words(),
		    boatFullAddress: faker.address.streetAddress(),
		    services: [generateServices(), generateServices(), generateServices()],
		    otherService: faker.lorem.words(),
		    serviceDate: faker.date.future(),
		    assignTo: [faker.fake("{{name.firstName}} {{name.lastName}}"), faker.fake("{{name.firstName}} {{name.lastName}}")],
		    jobNotes: faker.lorem.words()
	}
}


// Seed Jobs database
function seedJobData() {
	console.info('Seeding Job data');
	const seedJData = [];

	for (let i=1; i<10; i++) {
		seedJData.push(generateJob());
	}
	return Job.insertMany(seedJData);
}

// Create one boat
function generateBoat() {
	return {
			boatName: faker.lorem.words(),
	        boatMake: faker.lorem.words(),
	        boatLength: faker.random.number(),
	        boatAddress: faker.address.streetAddress(),
	        boatAddress2: faker.address.secondaryAddress(),
	        boatCity: faker.address.city(),
	        boatState: faker.address.stateAbbr(),
	        boatZipCode: faker.address.zipCode(),
	        boatNotes: faker.lorem.words(),
	        custFirstName: faker.name.firstName(),
	        custLastName: faker.name.lastName(),
	        custEmail: faker.internet.email(),
	        custPhone: faker.phone.phoneNumber(),
	        custAddress: faker.address.streetAddress(),
	        custAddress2: faker.address.secondaryAddress(),
	        custCity: faker.address.city(),
	        custState: faker.address.stateAbbr(),
	        custZipCode: faker.address.zipCode()
		}
}

// Seed random documents into boats DB
function seedBoatData() {
	console.info('Seeding Boat Data');
	const seedBData = [];

	for (let i=1; i<10; i++) {
		seedBData.push(generateBoat());
	}
	return Boat.insertMany(seedBData);
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

describe('Users API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL)
		.then(console.log('Running server'))
		.catch(err => console.log({err}));
	});

	beforeEach(function() {
		return seedUserData(); 
	});

	// Test user database

	it('should return a list of all users', function() {
		let res;
		return chai.request(app)
			.get('/get-users')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.lengthOf.at.least(1);
				return User.count();
			})
			.then(function(count) {
				res.body.should.have.lengthOf(count);
			});
	});

	it('should return users with right fields', function() {

		let resUser;
		return chai.request(app)
			.get('/get-users')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.lengthOf.at.least(1);

				res.body.forEach(function(user) {
					user.should.be.a('object');
					user.should.include.keys(
						'id', 
						'firstName', 
						'lastName', 
						'fullName', 
						'phoneNumber', 
						'address', 
						'address2', 
						'city', 
						'state', 
						'zipCode', 
						'fullAddress', 
						'email', 
						'type', 
						'status');
				});

				resUser = res.body[0];
				return User.findById(resUser.id);
			})
			.then(function(user) {
				resUser.firstName.should.equal(user.firstName);
				resUser.lastName.should.equal(user.lastName);
				resUser.phoneNumber.should.equal(user.phoneNumber);
			});
	});


	// Test create new user
	
	it('should create a new user', function() {
		const newUser = generateUser();
		return chai.request(app)
			.post('/users/create')
			.send(newUser)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.include.keys(
					'firstName', 
					'lastName', 
					'phoneNumber', 
					'email', 
					'password');
				res.body.firstName.should.equal(newUser.firstName);
				res.body.lastName.should.equal(newUser.lastName);
				res.body.phoneNumber.should.equal(newUser.phoneNumber);
				res.body.email.should.equal(newUser.email);
				res.body.password.should.not.equal(newUser.password);	
				res.body._id.should.not.be.null;				
			});
	});


	// Test update user
	
	it('should update user fields sent over', function() {
		const updateUser = generateUser();

		return User
			.findOne()
			.then(function(user) {
				updateUser.id = user.id;

				return chai.request(app)
					.put(`/update-user/${user.id}`)
					.send(updateUser);
			})
			.then(function(res) {
				res.should.have.status(200);
				return User.findById(updateUser.id);
			})
			.then(function(user) {
				user.firstName.should.equal(updateUser.firstName);
				user.lastName.should.equal(updateUser.lastName);
				user.phoneNumber.should.equal(updateUser.phoneNumber);
				user.email.should.equal(updateUser.email);
			});
	});


	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
});



// --------------- Test Job Endpoints ---------------

describe('Jobs API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL)
		.then(console.log('Running server'))
		.catch(err => console.log({err}));
	});

	beforeEach(function() {
		return seedJobData(); 
	});

	// Test job database
	it('should return a list of all jobs', function() {
		let res;
		return chai.request(app)
			.get('/get-jobs')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.lengthOf.at.least(1);
				return Job.count();
			})
			.then(function(count) {
				res.body.should.have.lengthOf(count);
			});
	});

	it('should return job with right fields', function() {
		return chai.request(app)
			.get('/get-jobs')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.lengthOf.at.least(1);

				res.body.forEach(function(job) {
					job.should.be.a('object');
					job.should.include.keys(
						'_id', 
						'jobName',
						'boatFullAddress',
						'services',
						'otherService',
						'serviceDate',
						'assignTo',
						'jobNotes');
				});
			});
	});


	// Test create new job
	it('should create a new job', function() {
		const newJob = generateJob();
		return chai.request(app)
			.post('/jobs/create')
			.send(newJob)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.include.keys(
					'jobName','boatFullAddress','services','otherService','serviceDate','assignTo','jobNotes');
				res.body.jobName.should.equal(newJob.jobName);
				res.body.boatFullAddress.should.equal(newJob.boatFullAddress);
				res.body.services.should.be.a('array');
				res.body.otherService.should.equal(newJob.otherService);
				res.body.serviceDate.should.not.be.null;	
				res.body.assignTo.should.be.a('array');
				res.body.jobNotes.should.equal(newJob.jobNotes);
				res.body._id.should.not.be.null;				
			});
	});


	// Test update job	
	it('should update job fields sent over', function() {
		const updateJob = generateJob();

		return Job
			.findOne()
			.then(function(job) {
				updateJob.id = job._id;

				return chai.request(app)
					.put(`/jobs/${job.id}`)
					.send(updateJob);
			})
			.then(function(res) {
				res.should.have.status(200);
				return Job.findById(updateJob.id);
			})
			.then(function(job) {
				job.services.should.be.a('array');
				job.otherService.should.equal(updateJob.otherService);
				job.serviceDate.should.not.be.null;
				job.assignTo.should.be.a('array');
				job.jobNotes.should.equal(updateJob.jobNotes);
			});
	});

	// Test delete a job
	it('should delete a job by id', function() {
		let job;
      
		return Job
			.findOne()
			.then(function(_job) {
				job = _job;
				return chai.request(app).delete(`/jobs/${job._id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Job.findById(job._id);
			})
			.then(function(_job) {
				should.not.exist(_job);
			});
      
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
});



// --------------- Test Boat Endpoints ---------------

describe('Boats API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL)
		.then(console.log('Running server'))
		.catch(err => console.log({err}));
	});

	beforeEach(function() {
		return seedBoatData(); 
	});

	// Test boat database

	it('should return a list of all boats', function() {
		let res;
		return chai.request(app)
			.get('/get-boats')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.lengthOf.at.least(1);
				return Boat.count();
			})
			.then(function(count) {
				res.body.should.have.lengthOf(count);
			});
	});

	it('should return boats with right fields', function() {

		let resBoat;
		return chai.request(app)
			.get('/get-boats')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.lengthOf.at.least(1);

				res.body.forEach(function(boat) {
					boat.should.be.a('object');
					boat.should.include.keys(
						'id', 
						'boatName', 
						'boatMake', 
						'boatLength', 
						'boatFullAddress', 
						'boatNotes', 
						'customerFullName',  
						'custEmail', 
						'custPhone', 
						'custFullAddress');
				});

				resBoat = res.body[0];
				return Boat.findById(resBoat.id);
			})
			.then(function(boat) {
				resBoat.boatName.should.equal(boat.boatName);
				resBoat.boatMake.should.equal(boat.boatMake);
				resBoat.boatLength.should.equal(boat.boatLength);
				resBoat.boatFullAddress.should.equal(boat.boatFullAddress);
				resBoat.boatNotes.should.equal(boat.boatNotes);
				resBoat.customerFullName.should.equal(boat.customerFullName);
				resBoat.custEmail.should.equal(boat.custEmail);
				resBoat.custPhone.should.equal(boat.custPhone);
				resBoat.custFullAddress.should.equal(boat.custFullAddress);
			});
	});


	// // Test create new boat
	
	it('should create a new boat', function() {
		const newBoat = generateBoat();
		return chai.request(app)
			.post('/boats/create')
			.send(newBoat)
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.include.keys(
					'boatName', 
					'boatMake', 
					'boatLength', 
					'boatAddress', 
					'boatAddress2', 
					'boatCity', 
					'boatState', 
					'boatZipCode', 
					'boatNotes', 
					'custFirstName', 
					'custLastName', 
					'custEmail', 
					'custPhone', 
					'custAddress',
			        'custAddress2',
			        'custCity',
			        'custState',
			        'custZipCode');
				res.body.boatName.should.equal(newBoat.boatName);
				res.body.boatAddress.should.equal(newBoat.boatAddress);
				res.body.custFirstName.should.equal(newBoat.custFirstName);
				res.body.custLastName.should.equal(newBoat.custLastName);
				res.body._id.should.not.be.null;				
			});
	});


	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});
});