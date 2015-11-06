if (Meteor.isServer) {
	// This code only runs on the server
  	Meteor.startup(function () {
    	// code to run on server at startup
    	Accounts.emailTemplates.from = "Verification Link";
  	});
  	Accounts.config({
  		sendVerificationEmail: true,
  		loginExpirationInDays: 30
  	});
}

if (Meteor.isClient) {
	// This code only runs on the client (meant for the interface)
	
	// Trim helper
	var trimInput = function(val) {
		return val.replace(/^\s*|\s*$/g, "");
	};

	// This runs if the resetPasswordToken is present (aka clicked from email)
	if (Accounts._resetPasswordToken) {
		Session.set('resetPassword', Accounts._resetPasswordToken);
	}

	Template.login.events({	// Responds to login submit event
 		'submit #login-form': function(event, template) {	//When form is submitted
 			event.preventDefault();
 			// Reset validations
 			$('#login-email-message').text("");
 			$('#login-password-message').text("");
 			$('#loginEmailGroup').removeClass('has-error');
 			$('#loginPasswordGroup').removeClass('has-error');

 			// Retrieve the input field values
 			var validated = true,
 				email = trimInput(template.find('#loginEmail').value),
 				password = template.find('#loginPassword').value;

			// Validation your fields here
			if (email === "") {
				validated = false;
				$('#login-email-message').text("Email field is empty");
				$('#loginEmailGroup').addClass('has-error');
				console.log("Email field is empty");
			}

			if (password === "") {
				validated = false;
				$('#login-password-message').text("Password field is empty");
				$('#loginPasswordGroup').addClass('has-error');
				console.log("Password field is empty");
			}

			// If validation passes, supply the appropriate fields to the Meteor.loginWithPassword() function.
			if (validated)
				Meteor.loginWithPassword(email, password, function(err) {
					if (err) {
						// The user might not have been found, or their password could be incorrect.  Inform the user that their login attempt has failed
						if(err.message === "User not found [403]") {
							$('#login-email-message').text("User does not exist");
							$('#loginEmailGroup').addClass('has-error');
							console("Login failed: " + err.message);
						} else if(err.message === "Incorrect password [403]") {
							$('#login-password-message').text("Incorrect password");
							$('#loginPasswordGroup').addClass('has-error');
							console("Login failed: " + err.message);
						} else {
							alert("Login failed " + err.message);
							console("Login failed: " + err.message);
						}
					}
					else {
						// The user has been logged in.
						console.log("Login successful");
					}
				});
 			return false; // Stops page from reloading
 		},
 		'submit #signup-form': function(event, template) { // When form is submitted
 			event.preventDefault();

 			// Reset validations
 			$('#signup-email-message').text("");
 			$('#signup-password-message').text("");
 			$('#signupEmailGroup').removeClass('has-error');
 			$('#signupPasswordGroup').removeClass('has-error');
 			$('#signupConfirmPasswordGroup').removeClass('has-error');

 			var validated = true,
 				email = trimInput(template.find('#signupEmail').value),
		    	name = trimInput(template.find('#signupDisplayName').value),
		    	password = template.find('#signupPassword').value,
		    	password2 = template.find('#signupConfirmPassword').value;

		    // Validate Input
		    if(password === "") {
				validated = false;
				$('#signup-password-message').text("Password field is empty")
				console.log("Password field is empty");
			} else if (password.length < 6) {
				validated = false;
				alert("Password is too short (must be at least 6 characters long");
				console.log("Password too short (must be at least 6 characters long");
			} else if(password !== password2) {
		    	validated = false;
		    	alert("Passwords don't match");
		    	console.log("Passwords don't match");
		    }

		    if (validated) {
			    Accounts.createUser({username: email, email: email, password : password, profile:{name: name}}, function(err){
			        if (err) {
			    	    // Inform the user that account creation failed
			    	    alert("Account creation failed");
			    	    console.log("Account creation failed");
			        } else {
			            // Success. Account has been created and the user has logged in successfully. 
			            console.log("Account has successfully been created");
			        }
			    });
			} else {
				// Not validated, inform user
				console.log("Not validated");
			}
		    return false; // Stops page from reloading
		},

		'submit #recovery-form': function(event, template) {
			event.preventDefault();
			var validated = true;
				email = trimInput(template.find('#recoveryEmail').value);

			if(email === "") {
				alert("Email is empty");
				console.log("Email is empty");
			}

			if (validated) {
				Session.set('loading', true);
				Accounts.forgotPassword(email, function(err) {
					if (err) {
						alert("Password Reset Failed");
						console.log("Password Reset Failed" + err);
					} else {
						alert("Email sent");
						console.log("Email sent, check email");
					}
					Session.set('loading', false);
				});
			}
			return false; // Stops page from reloading
		},

		'submit #new-password-form' : function(event, template) {
			event.preventDefault();
			var validated = true,
				password = template.find('#newPassword').value,
		    	password2 = template.find('#confirmNewPassword').value;

		    // Validate input
		    if(password === "") {
				validated = false;
				alert("Please enter a password");
				console.log("Password field is empty");
			}

		    if (password.length < 6) {
				validated = false;
				alert("Password is too short (must be at least 6 characters long");
				console.log("Password too short (must be at least 6 characters long");
			}

		    if(password !== password2) {
		    	validated = false;
		    	alert("Passwords don't match");
		    	console.log("Passwords don't match");
		    }

		    if (validated) {
		    	Session.set('loading', true);
		    	Accounts.resetPassword(Session.get('resetPassword'), pw, function(err) {
		    		if (err) {
		    			alert("Password Reset Error &amp; Sorry");
		    			console.log("Password Reset Failed");
		    		} else {
		    			Session.set('resetPassword', null);
		    		}
		    		Session.set('loading', false);
		    	});
		    }
		    return false;
		}
	});

	Template.login.helpers({
		resetPassword : function(t) {
			if (Accounts._resetPasswordToken) {
				Session.set('resetPassword', Accounts._resetPasswordToken);
			}
			return Session.get('resetPassword');
		}
	});

 	Template.dashboard.events({
 		'click #logout': function(event) {
 			event.preventDefault();
 			Meteor.logout(function(err) {
 				if(err) {
 					alert("Unable to logout from application");
 				}
 			});
 		}
 	});
}