"use strict";

function showDashboardScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#dashboard-screen').show();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer').show();	
};

function showAddSessionScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#dashboard-screen').hide();
    $('#add-session-screen').show();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer').show();	
};

function showJournalScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').show();
    $('#change-password-screen').hide();
    $('#footer').show();	
};

function showChangePasswordScreen() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').show();
    $('#footer').show();	
};


// ******* FOR TESTING ********
$(document).ready(function() {
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').show();
    $('#dashboard-screen').show();
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
    // $('#js-settings-dropdown').hide();
//     $('#dashboard-screen').hide();
//     $('#add-session-screen').hide();
//     $('#journal-screen').hide();
//     $('#change-password-screen').hide();
//     $('#footer').hide();    
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
    const inputUser = $('input[name="js-userName"]').val();
    const inputPw = $('input[name="js-userPw"]').val();
    // check for spaces, undefined
    if ((!inputUser) || (inputUser.length < 1) || (inputUser.indexOf(' ') > 0)) {
        alert('Invalid Email')
    } else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {
        alert('Invalid password')
    } else {
        const loginObject = {
            email: inputUser,
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

