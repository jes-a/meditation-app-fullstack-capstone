"use strict";

// Show Log In Screen on Landing Page
function showLogInScreen() {
    $('#landing-screen').hide();
    $('#login-screen').show();
    $('#signup-screen').hide();
    $('#site-nav').hide();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer-section').hide(); 
}

// DASHBOARD ENTRIES: Total Number of sessions
function showTotalNumberDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-total/' + loggedInUserId,
    })
    .done(function (res) {
        console.log(res);
        let htmlContent = `<span>${res}</span>`;
        $('.js-total-number').html(htmlContent);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });  
};

// // DASHBOARD ENTRIES: Days in a row
// function showStreakDashboard(loggedInUserId) {

// };


// DASHBOARD ENTRIES: Last 10 days
function showLastTenDaysDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-ten/' + loggedInUserId,
    })
    .done(function (res) {
        populateLastTenDashboard(res);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });  
};

function populateLastTenDashboard(res) {
    console.log(res);
};

// DASHBOARD ENTRIES: Most used method
function showMethodUsedDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-method/' + loggedInUserId,
    })
    .done(function (res) {
        console.log(res);
        populateMethodDashboard(res);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });      
};

function populateMethodDashboard(res) {
    console.log(res);
};

// DASHBOARD ENTRIES: Average length of sessions
function showAvgLengthDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-avg/' + loggedInUserId,
    })
    .done(function (res) {
        console.log(res);
        let sessionTimes = res.map(a => a.sessionTime);
        populateAvgTimeDashboard(sessionTimes);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    }); 
};

function populateAvgTimeDashboard(sessionTimes) {
    let avgTime = parseInt(sessionTimes.reduce((a,b) => a + b, 0) / sessionTimes.length);
    let htmlContent = `<span class="stat-small">${avgTime} min</span>`;
    $('.js-avg-time').html(htmlContent);
    console.log(avgTime);
};



// JOURNAL ENTRIES

// Change date from YYYY-MM-DD format to readable format for Date headers
// on Journal Entries
function setReadableDate(sessionDate) {
    let d = sessionDate.replace(/-/g, "/");
    let readableDate = new Date(d);
    return readableDate.toDateString();
}

// Populate Latest Journal Entries in Dashboard Screen
function showJournalDashboard(loggedInUserId) {
	$.ajax({
		type: 'GET',
		url: '/sessions-journal-sb/' + loggedInUserId,
	})
	.done(function (res) {
		// console.log(res);
		populateJournalDashboard(res);
	})
	.fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
	});
}

// Populate Entries in Journal Page
function populateJournalDashboard(result) {
	let htmlContent = "";
	// console.log(result);
    if (result.length === 0) {
        htmlContent += '<p>You currently have no Journal Entries</p>';
        $('.js-journal-link').hide();
    } else {
    	$.each(result, function(i, item) {
    		let sessionDate = setReadableDate(item.sessionDate);
    		htmlContent += '<div class="latest-entry">';
            htmlContent += `<h6 class="date">${sessionDate}</h6>`;
            htmlContent += `<p class="latest-text">${item.journalEntry}</p>`;
            htmlContent += '</div>';
    	});
    }

	//Use HTML output to show in index.html
	$('.js-latest-entries').html(htmlContent);
};


function showDashboardScreen() {
	const loggedInUserId = $('.logged-in-user').val();
	showJournalDashboard(loggedInUserId);
	showTotalNumberDashboard(loggedInUserId);
	// showStreakDashboard(loggedInUserId);
	showLastTenDaysDashboard(loggedInUserId);
	showMethodUsedDashboard(loggedInUserId);
	showAvgLengthDashboard(loggedInUserId);
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').show();
    $('.js-nav-title').addClass('nav-title-selected');
    $('#add-session-screen').hide();
    $('.js-add-session').removeClass('nav-selected');
    $('#journal-screen').hide();
    $('.js-journal').removeClass('nav-selected');
    $('#change-password-screen').hide();
    $('.js-settings').removeClass('nav-selected');
    $('#footer').show();	 
};


// Show Add Session Page
function showAddSessionScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('#session-date').valueAsDate = new Date();
    $('#add-session-screen').show();
    $('.js-nav-title').removeClass('nav-title-selected');
    $('.js-add-session').addClass('nav-selected');
    $('#journal-screen').hide();
    $('.js-journal').removeClass('nav-selected');
    $('#change-password-screen').hide();
    $('.js-settings').removeClass('nav-selected');
    $('#footer').show();	
};

// Populate Entries in Journal Page
function populateJournalScreen(result) {
	let htmlContent = "";
	console.log(result);
    if (result.length === 0) {
        htmlContent += '<p>You currently have no Journal Entries</p>';
    } else {
    	$.each(result, function(i, item) {
    		let sessionDate = setReadableDate(item.sessionDate);
    		htmlContent += '<div class="entry-header">';
            htmlContent += `<h6 class="date">${sessionDate}</h6>`;
            htmlContent += `<i class="far fa-trash-alt delete-entry js-delete-entry" onClick="deleteSession('${item._id}')"></i>`;
            htmlContent += '</div>';
    		htmlContent += '<div class="entry">';
            htmlContent += `<p>I meditated for ${item.sessionTime} minutes using ${item.sessionType}</p>`;
            htmlContent += `<p>${item.journalEntry}</p>`;
            htmlContent += '</div>';
    	});
    }

	//Use HTML output to show in index.html
	$('.journal-entries').html(htmlContent);

};

// Show Journal Page for Logged In User
function showJournalScreen(loggedInUserId) {

	$.ajax({
		type: 'GET',
		url: '/sessions-journal/' + loggedInUserId,
	})
	.done(function (res) {
		// console.log(res);
		populateJournalScreen(res);
	})
	.fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
	});

    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('.js-nav-title').removeClass('nav-title-selected');
    $('#add-session-screen').hide();
    $('.js-add-session').removeClass('nav-selected');
    $('#journal-screen').show();
    $('.js-journal').addClass('nav-selected');
    $('#change-password-screen').hide();
    $('.js-settings').removeClass('nav-selected');
    $('#footer').show();	
};


// Show Change Password Page
function showChangePasswordScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('.js-nav-title').removeClass('nav-title-selected');
    $('#add-session-screen').hide();
    $('.js-add-session').removeClass('nav-selected');
    $('#journal-screen').hide();
    $('.js-journal').removeClass('nav-selected');
    $('#change-password-screen').show();
    $('.js-settings').addClass('nav-selected');
    $('#footer').show();	
};


// ******* FOR TESTING ********
// $(document).ready(function() {
//     $('#landing-screen').hide();
//     $('#login-screen').hide();
//     $('#signup-screen').hide();
//     $('#site-nav').show();
//     $('.js-settings-dropdown').hide();
//     $('#dashboard-screen').hide();
//     $('.js-nav-title').addClass('nav-title-selected');
//     $('#add-session-screen').hide();
//     $('#journal-screen').show();
//     $('#change-password-screen').hide();
//     $('#footer-section').show();    
// });

// ----------- DOCUMENT READY FUNCTION -----------

$(document).ready(function() {
    $('#landing-screen').show();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').hide();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer-section').hide();    
});

// Handle Log In link from Landing screen
$('#js-landing-link').on('click', function(event) {
    event.preventDefault();
    showLogInScreen();
});

// Handle Sign Up link from Landing screen
$(document).on('click', '.js-signup', function(event) {
    event.preventDefault();
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').show();
    $('#site-nav').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer').hide();
});

// Handle Log In link from Sign Up screen
$(document).on('click', '.js-login', function(event) {
    event.preventDefault();
    showLogInScreen()
});

// Handle Sign Up Information
$(document).on('click', '#js-signup-button', function(event) {
		event.preventDefault();
		const email = $('input[name="js-user-signup"]').val();
		const password = $('input[name="js-create-pw"]').val();
		const confirmPw = $('input[name="js-reenter-pw"]').val();
		// console.log(email);
		if (password !== confirmPw) {
			alert('Passwords must match!');
		} else {
			const newUserObject = {
				email: email,
				password: password
			};
			$.ajax({
				type: 'POST',
				url: '/users/create',
				dataType: 'json',
				data: JSON.stringify(newUserObject),
				contentType: 'application/json'
			})
			.done(function (result) {
				// console.log(result);
				alert('Thanks for signing up! Please sign in.');
				showLogInScreen();
			})
			.fail(function (jqXHR, error, errorThrown) {
	            console.log(jqXHR);
	            console.log(error);
	            console.log(errorThrown);
			});
		};
});

// Handle log in information
$(document).on('click', '#js-login-button', function(event) {
    event.preventDefault();
    const inputEmail = $('input[name="js-userName"]').val();
    const inputPw = $('input[name="js-userPw"]').val();
    // console.log(inputEmail, inputPw);
    // check for spaces, undefined
    if ((!inputEmail) || (inputEmail.length < 1) || (inputEmail.indexOf(' ') > 0)) {
        alert('Invalid Email')
    } else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {
        alert('Invalid password')
    } else {
        const loginObject = {
            email: inputEmail,
            password: inputPw
        };
        $.ajax({
                type: 'POST',
                url: '/signin',
                dataType: 'json',
                data: JSON.stringify(loginObject),
                contentType: 'application/json'
            })
            .done(function(result) {
            	// console.log(result);
            	$('.logged-in-user').val(result._id);
				showDashboardScreen(); 
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Invalid username and password combination. Pleae check your username and password and try again.');
            });
    }
});

// Sign out and refresh page
$(document).on('click', '.js-logout-link', function(event) {
    location.reload();
});

// Handle open Dashboard Screen
$(document).on('click', '.js-nav-title', function(event) {
    event.preventDefault();
	showDashboardScreen();
});

// Handle open Add Session Screen
$(document).on('click', '.js-add-session', function(event) {
    event.preventDefault();
	showAddSessionScreen();
});

// Select App radio button if text field is focused 
$(document).on('click', '#app-type', function(event) {
	$('#app-used').prop("checked", true);
});

$(document).on('click', '#timer, #unassisted', function(event) {
	$('#app-type').val("");
});


// Add Session Form to Database
$(document).on('click', '#js-save-session', function(event) {
	event.preventDefault();
	const sessionDate = $('#session-date').val();
	const sessionTime = $('#session-time').val();
	const loggedInUserId = $('.logged-in-user').val();
	let sessionType = "";
	let appName = $('#app-type').val();
	let appRadio = $('input[id="app-used"]:checked').val();
	if (appRadio == "on") {
		sessionType = appName
	} else {
		sessionType = $('input[name="session-type"]:checked').val();
	}
	const journalEntry = $('#add-entry').val();
	// console.log(sessionDate, sessionTime, sessionType, journalEntry)
    if (sessionDate == "") {
        alert('Please select session date');
    } else if (sessionTime == "") {
        alert('Please select session time');
    } else if (sessionType == "") {
        alert('Please select session type');
    } else {
		const newSessionObject = {
			loggedInUserId,
			sessionDate, 
			sessionTime,
			sessionType,
			journalEntry
		};
		$.ajax({
			type: 'POST',
			url: '/sessions/create',
			dataType: 'json',
			data: JSON.stringify(newSessionObject),
			contentType: 'application/json'
		})
		.done(function(result) {
			alert('You successfully added a session');
			$('#add-session-form')[0].reset();
			showDashboardScreen();
		})
	    .fail(function(jqXHR, error, errorThrown) {
	        console.log(jqXHR);
	        console.log(error);
	        console.log(errorThrown);
	    });
	}
});

// Handle open Journal Screen
$(document).on('click', '.js-journal', function(event) {
    event.preventDefault();
	const loggedInUserId = $('.logged-in-user').val();
	showJournalScreen(loggedInUserId);
});

$(document).on('click', '.js-journal-link', function(event) {
    event.preventDefault();
	const loggedInUserId = $('.logged-in-user').val();
	showJournalScreen(loggedInUserId);
});

// Delete Journal Entry from Journal Screen
function deleteSession(sessionId) {
    event.preventDefault();
	const loggedInUserId = $('.logged-in-user').val();
    // console.log(sessionId);
    if (confirm('Are you SURE you want to delete this entry? Your entry will be PERMANENTLY erased.') === true) {
        $.ajax({
            method: 'DELETE',
            url: '/sessions/' + sessionId,
            success: showJournalScreen(loggedInUserId)
        })
    }
};

// Handle Open Settings Drop-Down
$(document).on('click', '.js-settings', function(event) {
    event.stopPropagation();
    $('.js-settings-dropdown').show();
});

// Handle Close Settings Drop-Down
$(document).on('click', '.js-settings-close', function(event) {
    event.stopPropagation();
    $('.js-settings-dropdown').hide();
});

// Hide Settings menu when clicked outside nav menu
$(document).on('click', function() {
    $('.js-settings-dropdown').hide();
})

// Handle open Change Password Screen
$(document).on('click', '.js-change-pw', function(event) {
    event.preventDefault();
	const loggedInUserId = $('.logged-in-user').val();
	showChangePasswordScreen(loggedInUserId);
});




