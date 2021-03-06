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
        let htmlContent = `<span>${res}</span>`;
        $('.js-total-number').html(htmlContent);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
};

// DASHBOARD ENTRIES: Days in a row
function showStreakDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-streak/' + loggedInUserId,
    })
    .done(function (res) {
        let sessionDays = res.map(a => a.sessionDateUnix);
        populateStreakDashboard(sessionDays);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
};

function populateStreakDashboard(sessionDays) {
    let streak = 0;
    let counter = 0;

    let currentTimeStamp = Math.floor(Date.now() / 1000);
    let dt = new Date();
    let secs = dt.getSeconds() + (60  * (dt.getMinutes() + (60 * dt.getHours())));
    let currentDay = currentTimeStamp - secs;

    let mostRecentSessionTimeStamp = sessionDays[0];

    let timeFromToday = (currentDay - mostRecentSessionTimeStamp);

    // Filter out multiple sessions in one day
    let uniqueDays = Array.from(new Set(sessionDays));

    // Find time difference between sessions using 86400 as 1 day
    let sessionTimeDiff = uniqueDays.slice(1).map((n, i) => {return uniqueDays[i] - n; });

    // Find the first instance where time difference is greater than a day
    let timeIndex = sessionTimeDiff.findIndex(timeDiff => timeDiff > 86400) + 1;

        // If the last session was more than 1 day ago, set counter to 0
        if (timeFromToday > 0) {
            counter = 0;
        // Else if the last session was less than 1 day ago and there are multiple sessions in a day, set counter = 1
        } else if (timeFromToday === 0 && sessionTimeDiff.length === 0) {
            counter = 1;
        // Else if the last session was less than 1 day ago and there are no sessions past 1 day since last session,
        // set counter = 1 plus the number of unique sessions
        } else if (timeFromToday === 0 && timeIndex === 0) {
            counter = 1 + sessionTimeDiff.length;
        // Else if the last session was less than 1 day ago and there are sessions after streak,
        //set counter = index of the last session before time diff is more than a day
        } else if (timeFromToday === 0 && timeIndex > 0) {
            counter = timeIndex;
        // Else if there are no sessions, set counter to 0
        } else {
            counter = 0;
        }

    streak = counter;

    let htmlContent = `<span>${streak}</span>`
    $('.js-streak-number').html(htmlContent);
};

// DASHBOARD ENTRIES: Last 10 days
function showLastTenDaysDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-ten/' + loggedInUserId,
    })
    .done(function (res) {
        let sessionDays = res.map(a => a.sessionDateUnix);
        populateLastTenDashboard(sessionDays);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
};

function populateLastTenDashboard(sessionDays) {
    // Set current day time to midnight GST
    let currentTimeStamp = Math.floor(Date.now() / 1000);
    let dt = new Date();
    let secs = dt.getSeconds() + (60  * (dt.getMinutes() + (60 * dt.getHours())));
    let currentDay = currentTimeStamp - secs;

    // Add array of Timestamps for the past 10 days
    let lastTenDays = [currentDay];
    for (let i=1; i<10; i++) {
        lastTenDays.push(currentDay - (86400*i));
    }

    // Add id = last ten days to Dashboard
    let htmlContent = "";

    $.each(lastTenDays, (i, item) => {
        htmlContent += `<div class="stat-empty" id="${item}"></div>`;
    });

    $('.stat-circles').html(htmlContent);

    let uniqueDays = Array.from(new Set(sessionDays));

    // Go through uniqueDays and if day is within last 10 days, fill circle
    $.each(uniqueDays, (i, item) => {
        $('#' + item).addClass('stat-filled');
    });
};

// DASHBOARD ENTRIES: Most used method
function showMethodUsedDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-method/' + loggedInUserId,
    })
    .done(function (res) {
        let sessionTypes = res.map(a => a.sessionType);
        populateMethodDashboard(sessionTypes);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
};

function populateMethodDashboard(sessionTypes) {
    // Find the most used method in array
    let mostFreq = 1;
    let m = 0;
    let method;

    if (sessionTypes.length === 0) {
        method = '--';
    } else if (sessionTypes.length === 1) {
        method = sessionTypes[0];
    } else {
        for (let i = 0; i < sessionTypes.length; i++) {
          for (let j = i; j < sessionTypes.length; j++) {
            if (sessionTypes[i] == sessionTypes[j]) m++;
                if (mostFreq < m) {
                  mostFreq = m;
                  method = sessionTypes[i];
                }
            }
        }
    }

    let htmlContent = `<span class="stat-small stat-cap">${method}</span>`
    $('.js-method').html(htmlContent);
};

// DASHBOARD ENTRIES: Average length of sessions
function showAvgLengthDashboard(loggedInUserId) {
    $.ajax({
        type: 'GET',
        url: '/sessions-avg/' + loggedInUserId,
    })
    .done(function (res) {
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
    let htmlContent = "";
    if (sessionTimes.length === 0) {
        htmlContent = '<span class="stat-small">--</span>';
    } else {
    let avgTime = parseInt(sessionTimes.reduce((a,b) => a + b, 0) / sessionTimes.length);
    htmlContent = `<span class="stat-small">${avgTime}</span>`;
    }

    $('.js-avg-time').html(htmlContent);
};

// ADD SESSION FORM
// Set default date to today in drop-down
function populateCurrentDate() {

    function twoDigit(n) { return (n < 10 ? '0' : '') + n; };

    let today = new Date();
    let todayFormatted = '' + today.getFullYear() + '-' + twoDigit(today.getMonth() + 1) + '-' + twoDigit(today.getDate());
    return todayFormatted;
}



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
        populateJournalDashboard(res);
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
}

// Populate Entries in Journal Page
function populateJournalDashboard(res) {
    let htmlContent = "";
    if (res.length === 0) {
        htmlContent += '<p>You currently have no Journal Entries</p>';
        $('.js-journal-link').hide();
    } else {
        $.each(res, (i, item) => {
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
    let loggedInUserId = $('.logged-in-user').val();
    showJournalDashboard(loggedInUserId);
    showTotalNumberDashboard(loggedInUserId);
    showStreakDashboard(loggedInUserId);
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
    $('#footer-section').show();
};


// Populate Entries in Journal Page
function populateJournalScreen(result) {
    let htmlContent = "";
    if (result.length === 0) {
        htmlContent += '<p>You currently have no Journal Entries</p>';
    } else {
        $.each(result, (i, item) => {
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
    $('#footer-section').show();
};

// Show Change Password Screen
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
    $('#footer-section').show();
}


// ----------- DOCUMENT READY FUNCTION -----------

$(document).ready(function() {
    $('#js-settings-dropdown').hide();
    $('#landing-screen').show();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').hide();
    $('#dashboard-screen').hide();
    $('#add-session-screen').hide();
    $('#journal-screen').hide();
    $('#change-password-screen').hide();
    $('#footer-section').hide();
});

// Handle Log In link from Landing screen
$(document).on('click', '#js-landing-link', function(event) {
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
    $('#footer-section').hide();
});

// Handle Log In link from Sign Up screen
$(document).on('click', '.js-login', function(event) {
    event.preventDefault();
    showLogInScreen()
});

// Handle Sign Up Information

// Check to see if email is already in database
function checkDuplicateEmail(inputEmail) {
    $.ajax({
        type: 'GET',
        url: `/check-duplicate-email/${inputEmail}`,
        dataType: 'json',
        contentType: 'application/json'
    })
        .done(function (result) {
            if (result.entries.length !== 0){
                alert("Sorry, that email is already in use")
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
    });
}

$(document).on('blur', '#user-signup', function(event) {
    event.preventDefault();
    let email = $('input[name="js-user-signup"]').val();
    checkDuplicateEmail(email);
})


// Send Sign Up Information
$(document).on('click', '#js-signup-button', function(event) {
        event.preventDefault();
        const email = $('input[name="js-user-signup"]').val();
        const password = $('input[name="js-create-pw"]').val();
        const confirmPw = $('input[name="js-reenter-pw"]').val();
        if (password !== confirmPw) {
            alert('Passwords must match!');
        } else if (email == "" ) {
            alert('Please enter an email');
        } else if (password == "") {
            alert('Please enter a password');
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
                $('.js-signin-success').html('Thanks for signing up! Please sign in.');
                $('.js-signin-success').addClass('change-status-success');
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
                $('.logged-in-user').val(result._id);
                showDashboardScreen();
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Invalid username and password combination. Please check your username and password and try again.');
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
    $('#landing-screen').hide();
    $('#login-screen').hide();
    $('#signup-screen').hide();
    $('#site-nav').show();
    $('#js-settings-dropdown').hide();
    $('#dashboard-screen').hide();
    let defaultDate = populateCurrentDate();
    $('input[name="session-date"]').val(defaultDate);
    $('#add-session-screen').show();
    $('.js-nav-title').removeClass('nav-title-selected');
    $('.js-add-session').addClass('nav-selected');
    $('#journal-screen').hide();
    $('.js-journal').removeClass('nav-selected');
    $('#change-password-screen').hide();
    $('.js-settings').removeClass('nav-selected');
    $('#footer-section').show();
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
    let sessionDate = $('#session-date').val();
    let sessionDateUnix = moment(sessionDate).unix();
    let sessionTime = $('#session-time').val();
    let loggedInUserId = $('.logged-in-user').val();
    let sessionType = "";
    let appName = $('#app-type').val().toLowerCase();
    let appRadio = $('input[id="app-used"]:checked').val();
    if (appRadio == "on") {
        sessionType = appName
    } else {
        sessionType = $('input[name="session-type"]:checked').val().toLowerCase();
    }
    let journalEntry = $('#add-entry').val();
    if (sessionDate == "") {
        alert('Please select session date');
    } else if (sessionTime == "") {
        alert('Please select session time');
    } else if (sessionType == "") {
        alert('Please select session type or add App name');
    } else {
        const newSessionObject = {
            loggedInUserId,
            sessionDate,
            sessionDateUnix,
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
        .done(function(res) {
            $('#add-session-form')[0].reset();
            $('.js-add-success').html('<i class="fal fa-thumbs-up"></i> You successfully added a session');
            $('.js-add-success').addClass('change-status-success');
            $('.js-add-success').delay(2000).fadeOut();
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
    let loggedInUserId = $('.logged-in-user').val();
    showJournalScreen(loggedInUserId);
});

$(document).on('click', '.js-journal-link', function(event) {
    event.preventDefault();
    let loggedInUserId = $('.logged-in-user').val();
    showJournalScreen(loggedInUserId);
});

// Delete Journal Entry from Journal Screen
function deleteSession(sessionId) {
    event.preventDefault();
    if (confirm('Are you SURE you want to delete this entry? Your entry will be PERMANENTLY erased.') === true) {
        let loggedInUserId = $('.logged-in-user').val();
        $.ajax({
            method: 'DELETE',
            url: '/sessions/' + sessionId,
        })
        .done(function(res) {
            $('.js-delete-success').html('<i class="fas fa-check-circle"></i> You successfully deleted a session');
            $('.js-delete-success').addClass('change-status-success');
            $('.js-delete-success').delay(2000).fadeOut();
            showJournalScreen(loggedInUserId)
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

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
    let loggedInUserId = $('.logged-in-user').val();
    showChangePasswordScreen();
});


// Handle Sending Update Password Form
$(document).on('submit', '#changePw-form', function(event) {
    event.preventDefault();
    let loggedInUserId = $('.logged-in-user').val();
    const pw = $('input[name="js-new-userPw"]').val();
    const pw2 = $('input[name="js-confirm-userPw"]').val();
        if (pw !== pw2) {
            alert('Passwords do not match, please re-enter password');
        } else if (pw == "") {
            alert('Please enter a password');
        } else {
            const updateUserObject = {
                pw
            };
            $.ajax({
                type: 'PUT',
                url: '/user-pw/' + loggedInUserId,
                dataType: 'json',
                data: JSON.stringify(updateUserObject),
                contentType: 'application/json'
            })
        .done(function (res) {
            $('.logged-in-user').val(res._id);
            $('#changePw-form')[0].reset();
            $('.js-change-pw-status').html('<i class="fas fa-check-circle"></i> You successfully updated your password');
            $('.js-change-pw-status').addClass('change-status-success');
            $('.js-change-pw-status').delay(2000).fadeOut();
            showChangePasswordScreen();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    }
});




