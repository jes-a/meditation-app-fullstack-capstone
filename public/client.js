"use strict";

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
    $('#dashboard-screen').show();
    $('.js-nav-title').addClass('nav-title-selected');
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
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

// Handle log in information
$('#js-login-button').on('click', function(event) {
    event.preventDefault();
	showDashboardScreen(); 
//     const inputUser = $('input[name="js-userName"]').val();
//     const inputPw = $('input[name="js-userPw"]').val();
//     // check for spaces, undefined
//     if ((!inputUser) || (inputUser.length < 1) || (inputUser.indexOf(' ') > 0)) {
//         alert('Invalid Email')
//     } else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {
//         alert('Invalid password')
//     } else {
//         const loginObject = {
//             email: inputUser,
//             password: inputPw
//         };
//         $.ajax({
//                 type: 'POST',
//                 url: '/signin',
//                 dataType: 'json',
//                 data: JSON.stringify(loginObject),
//                 contentType: 'application/json'
//             })
//             .done(function(result) {
//                     showDashboardScreen();
//             })
//             .fail(function(jqXHR, error, errorThrown) {
//                 console.log(jqXHR);
//                 console.log(error);
//                 console.log(errorThrown);
//                 alert('Invalid username and password combination. Pleae check your username and password and try again.');
//             });
//     }
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




