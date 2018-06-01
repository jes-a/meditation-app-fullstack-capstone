"use strict";
let workerName = "";

// Show Admin Landing Screen
function showAdminLandingScreen() {
    $('#login-screen').hide();
    $('html').removeClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').show();
    $('#add-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#edit-job-screen').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
}

// Change date from YYYY-MM-DD format to readable format for Job List header
function setReadableDate(serviceDate) {
    let d = serviceDate.replace(/-/g, "/");
    let readableDate = new Date(d);
    return readableDate.toDateString();
}


// Populate Admin Job List Screen
function populateJobList(jobs) {
    let htmlContent = "";

    $.each(jobs, function(i, item) {
        let serviceDate = setReadableDate(item.serviceDate);
        htmlContent += '<div class="date-header">';
        htmlContent += `<h3 class="js-job-date">${serviceDate}</h3>`;
        htmlContent += '</div>';
        htmlContent += '<div class="job js-job-list">';
        htmlContent += `<i class="far fa-edit edit-btn js-edit-job-link" id="${item._id}""></i>`;
        htmlContent += `<h4 class="js-boat-name boat">${item.jobName}</h4>`;
        htmlContent += `<p class="js-job-address">${item.boatFullAddress}</p>`;
        htmlContent += '<h5>Services</h5>';
        htmlContent += '<ul class="job-list-items">';
        $.each(item.services, function(key, value) {
            htmlContent += `<li class="js-job-service">${value}</li>`;
        });
        htmlContent += '</ul>';
        htmlContent += '<h5>Workers</h5>';
        htmlContent += '<ul>';
        $.each(item.assignTo, function(key, value) {
            htmlContent += `<li class="js-job-worker">${value}</li>`;
        });
        htmlContent += '</ul>';
        htmlContent += '<h5>Notes</h5>';
        htmlContent += `<p class="js-job-notes">${item.jobNotes}</p>`;
        htmlContent += '</div>';
    });

    //use the HTML output to show it in the index.html
    $('.js-job-list-wrapper').html(htmlContent);
}


// Show Job List Screen for Admin
function showAdminJobListScreen() {

    $.getJSON('/get-jobs', function(res) {
        populateJobList(res);
    });

    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').show();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
}

// Show Job List Screen for Admin after updating job
function showUpdatedAdminJobListScreen() {
    $.getJSON('/get-jobs', function(res) {
        populateJobList(res);
    });

    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').show();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
}

// Populate Boat Name drop-down in Add Job Screen
function populateBoatNameDropdown(boats) {
    let htmlContent = "";

    htmlContent += '<option disabled selected value> -- Select a Boat -- </option>';
    $.each(boats, function(i, item) {
        htmlContent += `<option value="${item.boatFullAddress}">${item.boatName}</option>`;
    });

    //use the HTML output to show it in the index.html
    $('.js-select-boat-name').html(htmlContent);
}


// Populate Assign To checkboxes in Add Job Screen
function populateAssignToList(workers) {
    let htmlContent = "";

    $.each(workers, function(i, item) {
        htmlContent += `<li>
                            <input type="checkbox" class="${item.id}" id="assign-to-${item.firstName}" value="${item.fullName}" name="assign-to">
                            <label for="assign-to-${item.firstName}" class="checkbox">${item.fullName}</label>
                        </li>`;
    });

    //use the HTML output to show it in the index.html
    $(".js-assign-to-list").html(htmlContent);
}

// Populate Assign To checkboxes in Edit Job Screen
function populateEditAssignToList(workers) {
    let htmlContent = "";

    $.each(workers, function(i, item) {
        htmlContent += `<li>
                            <input type="checkbox" class="${item.id}" value="${item.fullName}" name="edit-assign-to">
                            <label for="edit-assign-to" class="checkbox">${item.fullName}</label>
                        </li>`;
    });

    //use the HTML output to show it in the assign to list
    $(".js-edit-assign-to-list").html(htmlContent);
}


function populateUpdatedWorkerScreen(result) {
    let updatedWorkerId = result.id;
    $.getJSON('/get-one-user/' + updatedWorkerId, function(res) {
        $(".js-worker-detail").html(
            `<i class="far fa-edit edit-btn js-edit-worker-button" id="${updatedWorkerId}"></i>
            <ul>
                <li><h3 class="js-worker-name">${res.fullName}</h3></li>
                <li class="js-worker-phone">${res.phoneNumber}</li>
                <li class="js-worker-email">${res.email}</li>
                <li class="js-worker-address">${res.fullAddress}</li>
                <li class="js-worker-status"><span>Status:</span>Active</li>
            </ul>`);
    })
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').show();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
}

// Populate Worker Job List Screen for Worker after Log in
function showWorkerJobListScreen(jobs) {
    let htmlContent = "";

    // Find jobs assigned to worker and populate job list
    $.each(jobs, function(i, item) {
        $.each(item.assignTo, function(key, value) {
            let assigned = value;
            if (assigned == workerName) {
                let serviceDate = setReadableDate(item.serviceDate);
                htmlContent += '<div class="date-header">';
                htmlContent += `<h3 class="js-job-date">${serviceDate}</h3>`;
                htmlContent += '</div>';
                htmlContent += '<div class="job js-job-list">';
                htmlContent += `<h4 class="js-boat-name boat">${item.jobName}</h4>`;
                htmlContent += `<p class="js-job-address">${item.boatFullAddress}</p>`;
                htmlContent += '<h5>Services</h5>';
                htmlContent += '<ul class="job-list-items">';
                $.each(item.services, function(key, value) {
                    htmlContent += `<li class="js-job-service">${value}</li>`;
                });
                htmlContent += '</ul>';
                htmlContent += '<h5>Workers</h5>';
                htmlContent += '<ul>';
                $.each(item.assignTo, function(key, value) {
                    htmlContent += `<li class="js-job-worker">${value}</li>`;
                });
                htmlContent += '</ul>';
                htmlContent += '<h5>Notes</h5>';
                htmlContent += `<p class="js-job-notes">${item.jobNotes}</p>`;
                htmlContent += '</div>';
            }
        });
    });

    $('.js-worker-job-list-wrapper').html(htmlContent);

    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').show();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').show();
    $('#worker-profile-screen').hide();
}


function populateWorkerProfileScreen(worker) {
    $('.js-profile').html(
        `<h4 class="js-profile-name">${worker.fullName}</h4>
    <p class="js-profile-phone">${worker.phoneNumber}</p>
    <p class="js-profile-email">${worker.email}</p>
    <p class="js-profile-address">${worker.fullAddress}</p>
    `);

    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('.js-worker-menu-btn').show();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').show();
    $('#js-edit-profile-section').hide();
}


// ----------- DOCUMENT READY FUNCTION ---------------------

$(document).ready(function() {
    $('#landing-screen').show();
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});


// ----------- ADMIN SCREEN TRIGGERS ---------------------

// Handle demo sign in link from Landing screen
$('#js-landing-link').on('click', function(event) {
    event.preventDefault();
    $('#landing-screen').hide();
    $('#login-screen').show();
    $('html').removeClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide(); 
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
                if (result.type == 'worker') {
                    workerName = result.fullName;
                    let workerId = result.id;
                    $('.js-profile-link').attr('id', `${workerId}`);
                    $('.js-edit-profile-btn').attr('id', `${workerId}`);
                    $('.js-edit-profile-form').attr('id', `${workerId}`);
                    $.getJSON('/get-jobs', function(res) {
                        showWorkerJobListScreen(res);
                    });
                } else {
                    showAdminLandingScreen();
                }
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


// Open admin landing screen when home is clicked on
$('.js-admin-home').on('click', function(event) {
    showAdminLandingScreen();
});

// Open nav menu from headers
$('.js-menu-btn').on('click', function(event) {
    event.stopPropagation();
    $('.js-menu').toggle();
});

// Hide nav menu when clicked outside nav menu
$(document).on('click', function() {
    $('.js-menu').hide();
})


// Go to Admin Landing Screen when cancel is clicked
$('.js-cancel-button').on('click', function(event) {
    showAdminLandingScreen();
});


// Open Add Job Screen
$('.js-add-job').on('click', function(event) {
    event.preventDefault();
    $.getJSON('/get-users', function(res) {
        populateAssignToList(res);
    });
    $.getJSON('/get-boats', function(res) {
        populateBoatNameDropdown(res);
    });
    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').show();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});

//Add Job Data to database
$('#add-job-form').on('submit', function(event) {
    event.preventDefault();
    const jobName = $('#add-job-name option:selected').text();
    const boatFullAddress = $('#add-job-name option:selected').val();
    const services = [];
    $('input[name="add-service"]:checked').each(function(i, item) {
        services.push($(item).attr('value'))
    });
    const otherService = $('#add-other-service').val();
    if (otherService !== "") {
        services.push(otherService);
    }
    const serviceDate = $('#date-select').val();
    const assignTo = [];
    $('input[name="assign-to"]:checked').each(function(i, item) {
        assignTo.push($(item).attr('value'))
    });
    const jobNotes = $('#add-notes').val();
    if (jobName == "") {
        alert('Please select boat');
    } else if (services == "") {
        alert('Please select service');
    } else if (serviceDate == "") {
        alert('Please select service date');
    } else if (assignTo == "") {
        alert('Please select workers');
    } else {
        const newJobObject = {
            jobName,
            boatFullAddress,
            services,
            otherService,
            serviceDate,
            assignTo,
            jobNotes
        };
        $.ajax({
                type: 'POST',
                url: '/jobs/create',
                dataType: 'json',
                data: JSON.stringify(newJobObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert('You successfully added a new job');
                $('#add-job-form')[0].reset();
                showAdminJobListScreen(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

// Open Job list screen from landing page or nav
$('.js-job-list-admin').on('click', function(event) {
    $.getJSON('/get-jobs', function(res) {
        populateJobList(res);
    });

    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').show();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});

// Open edit job form and fill in with worker values based on Id
$('.js-job-list-wrapper').on('click', '.js-edit-job-link', function(event) {
    event.preventDefault();
    $.getJSON('/get-users', function(res) {
        populateEditAssignToList(res);
    });
    let jobId = $(this).attr('id');
    $.getJSON('/get-one-job/' + jobId, function(res) {
        // add in pre-filled values based on job id
        let htmlContent = "";
        htmlContent += `<h3 class="js-boat-name boat">${res.jobName}</h3>`;
        $('.edit-boat-name').html(htmlContent);
        $.each(res.services, function(key, value) {
            $('input[value="' + value + '"]').prop('checked', true);
        });
        $('#edit-other-service').text(res.otherService);
        $('#edit-date-select').val(res.serviceDate);
        $.each(res.assignTo, function(key, value) {
            $('input[value="' + value + '"]').prop('checked', true);
        });
        $('#edit-notes').val(res.jobNotes);
        $('.edit-job-form').attr('id', jobId);

    });
    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('.js-menu-btn').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').show();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
});


//Send Edit Job form to update job information 
$('.edit-job-form').on('submit', function(event) {
    event.preventDefault();
    let jobId = $(this).attr('id');
    const services = [];
    $('input[name="edit-service"]:checked').each(function(i, item) {
        services.push($(item).attr('value'))
    });
    const otherService = $('#edit-other-service').val();
    if (otherService !== "") {
        services.push(otherService);
    }
    const serviceDate = $('#edit-date-select').val();
    const assignTo = [];
    $('input[name="edit-assign-to"]:checked').each(function(i, item) {
        assignTo.push($(item).attr('value'))
    });
    const jobNotes = $('#edit-notes').val();
    if (services == "") {
        alert('Please select service');
    } else if (serviceDate == "") {
        alert('Please select service date');
    } else if (assignTo == "") {
        alert('Please select workers');
    } else {
        const updateJobObject = {
            services,
            otherService,
            serviceDate,
            assignTo,
            jobNotes
        };
        $.ajax({
                type: 'PUT',
                url: '/jobs/' + jobId,
                dataType: 'json',
                data: JSON.stringify(updateJobObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert(`You successfully updated this job`);
                $('.edit-job-form')[0].reset();
                showUpdatedAdminJobListScreen();
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

// Delete job from Edit Job Form
$('.edit-job-form').on('click', '#js-delete-job', function(event) {
    event.preventDefault();
    let jobId = event.delegateTarget.id;
    if (confirm('Are you SURE you want to delete this job? Your data will be PERMANENTLY erased.') === true) {
        $.ajax({
            method: 'DELETE',
            url: '/jobs/' + jobId,
            success: showAdminLandingScreen()
        })
    }

});

// Add worker data to database
$('#add-worker-form').on('submit', function(event) {
    event.preventDefault();
    const firstName = $('#add-first-name').val();
    const lastName = $('#add-last-name').val();
    const phoneNumber = $('#add-phone-number').val();
    const address = $('#add-address').val();
    const address2 = $('#add-address-2').val();
    const city = $('#add-city').val();
    const state = $('#add-state').val();
    const zipCode = $('#add-zip-code').val();
    const email = $('#add-email').val();
    const password = $('#add-initial-pw').val();
    const password2 = $('#add-initial-pw2').val();
    const type = $('input[class="add-type"]:checked').val();
    const status = $('input[class="add-status"]:checked').val();
    if (firstName == "") {
        alert('Please input first name');
    } else if (lastName == "") {
        alert('Please input last name');
    } else if (phoneNumber == "") {
        alert('Please input phone number');
    } else if (address == "") {
        alert('Please input address');
    } else if (city == "") {
        alert('Please input city');
    } else if (state == "") {
        alert('Please input state');
    } else if (zipCode == "") {
        alert('Please input zip code');
    } else if (email == "") {
        alert('Please input email');
    } else if (password == "") {
        alert('Please input password');
    } else if (password != password2) {
        alert('Passwords do not match, please re-enter password');
    } else if (type == "") {
        alert('Please input type');
    } else if (status == "") {
        alert('Please input status');
    } else {
        const newUserObject = {
            firstName,
            lastName,
            phoneNumber,
            address,
            address2,
            city,
            state,
            zipCode,
            email,
            password,
            type,
            status
        };
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert('You successfully added a new user');
                $('#add-worker-form')[0].reset();
                showAdminLandingScreen();
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

// Open add worker screen from landing page or nav
$(document).on('click', '.js-add-worker', function(event) {
    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').show();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').hide();
});

// Open worker list screen from landing page or nav
$('.js-workers-screen').on('click', function(event) {
    event.preventDefault();
    //create an empty variable to store one LI for each one the results
    let htmlContent = "";

    $.getJSON('/get-users', function(res) {
        $.each(res, function(i, item) {
            htmlContent += '<div class="worker">';
            htmlContent += '<ul class="js-worker-list-details">';
            htmlContent += `<li class="js-worker-name" id="${item.id}"><h4>${item.fullName}</h4></li>`;
            htmlContent += `<li class="js-worker-phone">${item.phoneNumber}</li>`;
            htmlContent += `<li class="js-worker-email">${item.email}</li>`;
            htmlContent += `<li class="js-worker-fullAddress">${item.fullAddress}</li>`;
            htmlContent += '</ul>';
            htmlContent += '</div>';
        });
        $(".js-worker-detail-wrapper").html(htmlContent);
        $('*').scrollTop(0);
        $('#login-screen').hide();
        $('html').addClass('white-bg');
        $('.js-menu-btn').show();
        $('.js-menu').hide();
        $('#admin-home').hide();
        $('#add-job-screen').hide();
        $('#edit-job-screen').hide();
        $('#job-list-screen-admin').hide();
        $('#add-worker-screen').hide();
        $('#worker-list-screen').show();
        $('#worker-detail-screen').hide();
        $('#edit-worker-screen').hide();
        $('#add-boat-details').hide();
        $('.js-worker-menu-btn').hide();
        $('.js-worker-menu').hide();
        $('#job-list-screen-worker').hide();
        $('#worker-profile-screen').hide();
    });
});

// Open worker detail screen from worker list screen    
$('.js-worker-detail-wrapper').on('click', '.js-worker-name', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    $.getJSON('/get-one-user/' + workerId, function(res) {
        $(".js-worker-detail").html(
            `<i class="far fa-edit edit-btn js-edit-worker-button" id="${workerId}"></i>
            <ul>
                <li><h3 class="js-worker-name">${res.fullName}</h3></li>
                <li class="js-worker-phone">${res.phoneNumber}</li>
                <li class="js-worker-email">${res.email}</li>
                <li class="js-worker-address">${res.fullAddress}</li>
                <li class="js-worker-status"><span>Status:</span>Active</li>
            </ul>`);
    });
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').show();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});

// Open edit worker form from Admin screen and fill in with worker values
$('.js-worker-detail').on('click', '.js-edit-worker-button', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    $.getJSON('/get-one-user/' + workerId, function(res) {
        // add in pre-filled values based on worker id
        $('#edit-first-name').val(res.firstName);
        $('#edit-last-name').val(res.lastName);
        $('#edit-phone-number').val(res.phoneNumber);
        $('#edit-address').val(res.address);
        $('#edit-address-2').val(res.address2);
        $('#edit-city').val(res.city);
        $('#edit-state').val(res.state);
        $('#edit-zip-code').val(res.zipCode);
        $('#edit-email').val(res.email);
        $('#edit-email').val(res.email);
        $('input[value="' + res.type + '"]').prop('checked', 'checked');
        $('input[value="' + res.status + '"]').prop('checked', 'checked');
        $('.edit-worker-form').attr('id', workerId);
    });
    $('*').scrollTop(0);
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').hide();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').hide();
    $('#edit-worker-screen').show();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});

//Send Edit Worker form to update worker information 
$('.edit-worker-form').on('submit', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    const firstName = $('#edit-first-name').val();
    const lastName = $('#edit-last-name').val();
    const phoneNumber = $('#edit-phone-number').val();
    const address = $('#edit-address').val();
    const address2 = $('#edit-address-2').val();
    const city = $('#edit-city').val();
    const state = $('#edit-state').val();
    const zipCode = $('#edit-zip-code').val();
    const email = $('#edit-email').val();
    const password = $('#edit-initial-pw').val();
    const type = $('input[class="edit-type"]:checked').val();
    const status = $('input[class="edit-status"]:checked').val();
    if (firstName == "") {
        alert('Please input first name');
    } else if (lastName == "") {
        alert('Please input last name');
    } else if (phoneNumber == "") {
        alert('Please input phone number');
    } else if (address == "") {
        alert('Please input address');
    } else if (city == "") {
        alert('Please input city');
    } else if (state == "") {
        alert('Please input state');
    } else if (zipCode == "") {
        alert('Please input zip code');
    } else if (email == "") {
        alert('Please input email');
    } else if (type == "") {
        alert('Please input type');
    } else if (status == "") {
        alert('Please input status');
    } else {
        const updateUserObject = {
            firstName,
            lastName,
            phoneNumber,
            address,
            address2,
            city,
            state,
            zipCode,
            email,
            password,
            type,
            status
        };
        $.ajax({
                type: 'PUT',
                url: '/update-user/' + workerId,
                dataType: 'json',
                data: JSON.stringify(updateUserObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert(`You successfully updated ${firstName}`);
                populateUpdatedWorkerScreen(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});

$('.js-edit-worker-cancel').on('click', function(event) {
    event.preventDefault();
    let workerId = $('.edit-worker-form').attr('id');
    $.getJSON('/get-one-user/' + workerId, function(res) {
        $(".js-worker-detail").html(
            `<i class="far fa-edit edit-btn js-edit-worker-button" id="${workerId}"></i>
            <ul>
                <li><h3 class="js-worker-name">${res.fullName}</h3></li>
                <li class="js-worker-phone">${res.phoneNumber}</li>
                <li class="js-worker-email">${res.email}</li>
                <li class="js-worker-address">${res.fullAddress}</li>
                <li class="js-worker-status"><span>Status:</span>Active</li>
            </ul>`);
    });
    $('#login-screen').hide();
    $('html').addClass('white-bg');
    $('.js-menu-btn').show();
    $('.js-menu').hide();
    $('#admin-home').hide();
    $('#add-job-screen').hide();
    $('#edit-job-screen').hide();
    $('#job-list-screen-admin').hide();
    $('#add-worker-screen').hide();
    $('#worker-list-screen').hide();
    $('#worker-detail-screen').show();
    $('#edit-worker-screen').hide();
    $('#add-boat-details').hide();
    $('.js-worker-menu-btn').hide();
    $('.js-worker-menu').hide();
    $('#job-list-screen-worker').hide();
    $('#worker-profile-screen').hide();
});

// Open Add Boat Details form
$('.js-add-boat').click(function(event) {
    event.preventDefault();
    $('#admin-home').hide();
    $('html').addClass('white-bg');
    $('#add-boat-details').show();
    $('#js-customer-address').hide();
});

// Open Customer Address section when checkbox unchecked
$('#customer-address-same').on('click', function() {
    $('#js-customer-address').toggle();
});

// Add boat data to database
$('#add-boat-details-form').on('submit', function(event) {
    event.preventDefault();
    let boatName = $('#add-boat-name').val();
    let boatMake = $('#add-boat-make').val();
    let boatLength = $('#add-boat-length').val();
    let boatAddress = $('#add-boat-address').val();
    let boatAddress2 = $('#add-boat-address-2').val();
    let boatCity = $('#add-boat-city').val();
    let boatState = $('#add-boat-state').val();
    let boatZipCode = $('#add-boat-zip-code').val();
    let boatNotes = $('#add-boat-notes').val();
    let custFirstName = $('#add-customer-first-name').val();
    let custLastName = $('#add-customer-last-name').val();
    let custEmail = $('#add-customer-email').val();
    let custPhone = $('#add-customer-phone-number').val();
    let sameAddress = $('#customer-address-same').is(':checked');
    let custAddress = $('#add-customer-address').val();
    let custAddress2 = $('#add-customer-address-2').val();
    let custCity = $('#add-customer-city').val();
    let custState = $('#add-customer-state').val();
    let custZipCode = $('#add-customer-zip-code').val();
    if (boatName == "") {
        alert('Please input boat name');
    } else if (boatMake == "") {
        alert('Please input boat make');
    } else if (boatLength == "") {
        alert('Please input boat length');
    } else if (boatAddress == "") {
        alert('Please input boat address');
    } else if (boatCity == "") {
        alert('Please input boat city');
    } else if (boatState == "") {
        alert('Please input boat state');
    } else if (boatZipCode == "") {
        alert('Please input boat zip code');
    } else if (custFirstName == "") {
        alert('Please input customer first name');
    } else if (custLastName == "") {
        alert('Please input customer last name');
    } else if (custEmail == "") {
        alert('Please input customer email');
    } else if (custPhone == "") {
        alert('Please input customer phone number');
    } else {
        const newBoatObject = {
            boatName,
            boatMake,
            boatLength,
            boatAddress,
            boatAddress2,
            boatCity,
            boatState,
            boatZipCode,
            boatNotes,
            custFirstName,
            custLastName,
            custEmail,
            custPhone,
            custAddress,
            custAddress2,
            custCity,
            custState,
            custZipCode
        };
        $.ajax({
                type: 'POST',
                url: '/boats/create',
                dataType: 'json',
                data: JSON.stringify(newBoatObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert('You successfully added a new boat');
                $('#add-boat-details-form')[0].reset();
                showAdminLandingScreen();
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});


// -------------- WORKER SCREEN TRIGGERS ---------------

// Open worker nav menu from headers
$('.js-worker-menu-btn').on('click', function(event) {
    event.stopPropagation();
    $('.js-worker-menu').toggle();
});

$(document).on('click', function() {
    $('.js-worker-menu').hide();
});

// Open Job List Screen from nav or header
$('.js-job-list-link').on('click', function(event) {
    event.preventDefault();
    $.getJSON('/get-jobs', function(res) {
        showWorkerJobListScreen(res);
    });
});

// Open Profile screen from nav
$('.js-worker-menu').on('click', '.js-profile-link', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    $.getJSON('/get-one-user/' + workerId, function(res) {
        populateWorkerProfileScreen(res);
    });
});

// Open Edit Profile section in Profile and fill in with values based on Id
$('.js-edit-profile-btn').on('click', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    $('#js-edit-profile-section').show();
    $('#js-profile').hide();
    $('#edit-profile-phone-number').focus();

    $.getJSON('/get-one-user/' + workerId, function(res) {
        // add in pre-filled values based on worker id
        $('#edit-profile-phone-number').val(res.phoneNumber);
        $('#edit-profile-email').val(res.email);
        $('#edit-profile-address').val(res.address);
        $('#edit-profile-address-2').val(res.address2);
        $('#edit-profile-city').val(res.city);
        $('#edit-profile-state').val(res.state);
        $('#edit-profile-zip-code').val(res.zipCode);
    });
});

// Hide Edit Profile section when cancel is clicked
$('.js-profile-cancel-button').on('click', function(event) {
    $('#js-edit-profile-section').hide();
    $('.js-edit-profile-form')[0].reset();
    $('#js-profile').show();
});

//Send Edit Profile form to update worker information 
$('.js-edit-profile-form').on('submit', function(event) {
    event.preventDefault();
    let workerId = $(this).attr('id');
    const phoneNumber = $('#edit-profile-phone-number').val();
    const email = $('#edit-profile-email').val();
    const address = $('#edit-profile-address').val();
    const address2 = $('#edit-profile-address-2').val();
    const city = $('#edit-profile-city').val();
    const state = $('#edit-profile-state').val();
    const zipCode = $('#edit-profile-zip-code').val();
    const password = $('#profile-change-pw').val();
    const password2 = $('#profile-retype-pw').val();
    const type = $('input[class="edit-type"]:checked').val();
    const status = $('input[class="edit-status"]:checked').val();
    if (phoneNumber == "") {
        alert('Please input phone number');
    } else if (email == "") {
        alert('Please input email');
    } else if (address == "") {
        alert('Please input address');
    } else if (city == "") {
        alert('Please input city');
    } else if (state == "") {
        alert('Please input state');
    } else if (zipCode == "") {
        alert('Please input zip code');
    } else if (password !== password2) {
        alert('Passwords do not match, please re-enter password');
    } else if (password == "") {
        const updateUserObject = {
            phoneNumber,
            address,
            address2,
            city,
            state,
            zipCode,
            email
        };
    } else {
        const updateUserObject = {
            phoneNumber,
            address,
            address2,
            city,
            state,
            zipCode,
            email,
            password
        };
        $.ajax({
                type: 'PUT',
                url: '/update-user/' + workerId,
                dataType: 'json',
                data: JSON.stringify(updateUserObject),
                contentType: 'application/json'
            })
            .done(function(result) {
                alert('You successfully updated your profile');
                populateWorkerProfileScreen(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }
});