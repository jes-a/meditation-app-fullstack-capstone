"use strict";

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

function showDashboardScreen() {
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

function showAddSessionScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').show();
    $('.js-nav-title').removeClass('nav-title-selected');
    $('.js-add-session').addClass('nav-selected');
    $('#journal-screen').hide();
    $('.js-journal').removeClass('nav-selected');
    $('#change-password-screen').hide();
    $('.js-settings').removeClass('nav-selected');
    $('#footer').show();	
};

function showJournalScreen() {
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
$(document).ready(function() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('.js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    $('.js-nav-title').addClass('nav-title-selected');
    $('#add-session-screen').hide();
    $('#journal-screen').show();
    $('#change-password-screen').hide();
    $('#footer-section').show();    
});

// ----------- DOCUMENT READY FUNCTION -----------

// $(document).ready(function() {
//     $('#landing-screen').show();
//     $('#login-screen').hide();
//     $('#signup-screen').hide();
//     $('#site-nav').hide();
//     $('#js-settings-dropdown').hide();
//     $('#dashboard-screen').hide();
//     $('#add-session-screen').hide();
//     $('#journal-screen').hide();
//     $('#change-password-screen').hide();
//     $('#footer-section').hide();    
// });

// Handle sign in link from Landing screen
$('#js-landing-link').on('click', function(event) {
    event.preventDefault();
    $('#landing-screen').hide();
    $('#login-screen').show();
    $('#signup-screen').hide();
    $('#site-nav').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer').hide();
});

// Handle Sign Up link from Landing screen
$('.js-signup').on('click', function(event) {
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
$('.js-login').on('click', function(event) {
    event.preventDefault();
    $('#landing-screen').hide();
    $('#login-screen').show();
    $('#signup-screen').hide();
    $('#site-nav').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer').hide();
});

// Handle Sign Up Information
$('#js-signup-button').on('click', function(event) {
		const form = document.body.querySelector('#signup-form');
		if (form.checkValidity && !form.checkValidity()) {
			return;
		}
		const email = $('input[name="js-user-signup"]').val();
		const pw = $('input[name="js-create-pw"]').val();
		const confirmPw = $('input[name="js-reenter-pw"]').val();
		if (pw !== confirmPw) {
			event.preventDefault();
			alert('Passwords must match!');
		} else {
			event.preventDefault();
			const newUserObject = {
				email: email,
				password: pw
			};
			// will assign a value to variable 'user' in signin step below
			// AJAX call to send form data up to server/DB and create new user
			$.ajax({
				type: 'POST',
				url: '/users/create',
				dataType: 'json',
				data: JSON.stringify(newUserObject),
				contentType: 'application/json'
			})
			.done(function (result) {
				event.preventDefault();
				newUserToggle = true;
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
$('#js-login-button').on('click', function(event) {
    event.preventDefault();
    const inputEmail = $('input[name="js-userName"]').val();
    const inputPw = $('input[name="js-userPw"]').val();
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
$('.js-logout-link').on('click', function(event) {
    location.reload();
});

// Handle open Dashboard Screen
$('.js-nav-title').on('click', function(event) {
    event.preventDefault();
	showDashboardScreen();
});

// Handle open Add Section Screen
$('.js-add-session').on('click', function(event) {
    event.preventDefault();
	showAddSessionScreen();
});

// Handle open Journal Screen
$('.js-journal').on('click', function(event) {
    event.preventDefault();
	showJournalScreen();
});

$('.js-journal-link').on('click', function(event) {
    event.preventDefault();
	showJournalScreen();
});

// Handle Open Settings Drop-Down
$('.js-settings').on('click', function(event) {
    event.stopPropagation();
    $('.js-settings-dropdown').show();
});

// Handle Close Settings Drop-Down
$('.js-settings-close').on('click', function(event) {
    event.stopPropagation();
    $('.js-settings-dropdown').hide();
});

// Hide Settings menu when clicked outside nav menu
$(document).on('click', function() {
    $('.js-settings-dropdown').hide();
})

// Handle open Change Password Screen
$('.js-change-pw').on('click', function(event) {
    event.preventDefault();
	showChangePasswordScreen();
});




