if (Meteor.isServer) {
	// This code only runs on the server
  	Meteor.startup(function () {
    	// code to run on server at startup
    	/*
    	process.env.MAIL_URL = "smtp://" +
    		encodeURIComponent("postmaster@sandbox59f188a92d4a4ce7be6496425618e5dc.mailgun.org") + ":" +
    		encodeURIComponent("94ebf534e001ded9927127134259afa8") + '@' +
    		encodeURIComponent("smtp.mailgun.org") + ":" + 587;
		*/
		process.env.MAIL_URL = "smtp://" +
			encodeURIComponent("barrydoyle18@gmail.com") + ":" + 
			encodeURIComponent("malbec32") + "@" + 
			encodeURIComponent("smtp.gmail.com") + ":" + 465;
		Accounts.emailTemplates.from = "Barry Michael Doyle";
		Accounts.emailTemplates.siteName = "Objective";
		Accounts.emailTemplates.verifyEmail.subject = function(user) {
			return 'Confirm Your Email Address for Objective';
		};
		Accounts.emailTemplates.verifyEmail.text = function(user, url) {
		    return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
		};	

		Accounts.config({
	  		sendVerificationEmail: true,
	  		loginExpirationInDays: 30
	  	});
  	});
}

if (Meteor.isClient) {
	// This code only runs on the client (meant for the interface)
	
	// Trim helper
	var trimInput = function(val) {
		return val.replace(/^\s*|\s*$/g, "");
	};

	// Verify email address format function
	function isEmail(email) {
	  	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  	return regex.test(email);
	}

	Accounts.onEmailVerificationLink(function(token, done) {
		//Login automatically
		Accounts.verifyEmail(token, function(err) {
				Session.set('notification', true);
			if(err) {
				$('#notificationText').removeClass();
				$('#notificationText').addClass("text-danger");
				$('#notificationText').text("An error occured while verifying email: " + err);
			} else {
				$('#notificationText').removeClass();
				$('#notificationText').addClass("text-success");
				$('#notificationText').text("Your password reset was successful");
			}
		});
		//Start notification Session
	});

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
			} else if (!isEmail(email)) {
				validated = false;
				$('#login-email-message').text("Email is not valid");
				$('#loginEmailGroup').addClass('has-error');
				console.log("Email is not valid");
			}

			if (password === "") {
				validated = false;
				$('#login-password-message').text("Password field is empty");
				$('#loginPasswordGroup').addClass('has-error');
				console.log("Password field is empty");
			}

			// If validation passes, supply the appropriate fields to the Meteor.loginWithPassword() function.
			if (validated) {
				//Session.set('loading', true);
				$('#loginbtn').addClass('disabled');
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
							$('#login-email-message').text("Login failed: " + err.message);
							console("Login failed: " + err.message);
						}
					}
					else {
						// The user has been logged in.
						console.log("Login successful");
					}
					//Session.set('loading', false);
					$('#loginbtn').removeClass('disabled');
				});
			} else {
				// Not validated, informed user above
				console.log("Not validated, not logged in");
			}
 			return false; // Stops page from reloading
 		},
 		'submit #signup-form': function(event, template) { // When form is submitted
 			event.preventDefault();

 			// Reset validations
 			$('#signup-email-message').text("");
 			$('#signup-password-message').text("");
 			$('#signup-confirm-password-message').text("");
 			$('#signupEmailGroup').removeClass('has-error');
 			$('#signupPasswordGroup').removeClass('has-error');
 			$('#signupConfirmPasswordGroup').removeClass('has-error');

 			var validated = true,
 				email = trimInput(template.find('#signupEmail').value),
		    	name = trimInput(template.find('#signupDisplayName').value),
		    	password = template.find('#signupPassword').value,
		    	password2 = template.find('#signupConfirmPassword').value;

		    // Validate Input
		    if (email === "") {
				validated = false;
				$('#signup-email-message').text("Email field is empty");
				$('#signupEmailGroup').addClass('has-error');
				console.log("Email field is empty");
			} else if (!isEmail(email)) {
				validated = false;
				$('#login-email-message').text("Email is not valid");
				$('#loginEmailGroup').addClass('has-error');
				console.log("Email is not valid");
			}

		    if(password === "") {
				validated = false;
				$('#signup-password-message').text("Password field is empty")
				$('#signupPasswordGroup').addClass('has-error');
				console.log("Password field is empty");
			} else if (password.length < 6) {
				validated = false;
				$('#signup-password-message').text("Password must be at least 6 characters long");
				$('#signupPasswordGroup').addClass('has-error');
				console.log("Password must be at least 6 characters long");
			}

			if(password2 === "") {
				validated = false;
				$('#signup-confirm-password-message').text("Confirm field is empty");
				$('#signupConfirmPasswordGroup').addClass('has-error');
			}

			if(validated && password !== password2) {
		    	validated = false;
		    	$('#signup-password-message').text("Passwords don't match");
		    	$('#signupPasswordGroup').addClass('has-error');
		    	$('#signupConfirmPasswordGroup').addClass('has-error');
		    	console.log("Passwords don't match");
		    }

		    if (validated) {
		    	//Session.set('loading', true);
		    	$('#signupbtn').addClass('disabled');
			    Accounts.createUser({username: email, email: email, password : password, profile:{name: name}}, function(err){
			        if (err) {
			    	    // Inform the user that account creation failed
			    	    if(err.message === "Email already exists. [403]") {
				    	    $('#signup-email-message').text("User already exists");
				    	    $('#signupEmailGroup').addClass('has-error');
				    	    console.log("User already exists");
				    	} else if (err.message === "Username already exists. [403]") {
				    		$('#signup-email-message').text("User already exists");
				    	    $('#signupEmailGroup').addClass('has-error');
				    	    console.log("User already exists");
				    	} else {
				    		$('#signup-email-message').text("Account creation failed: " + err.message);
							console.log("Account creation failed: " + err.message);
				    	}
			        } else {
			            // Success. Account has been created and the user has logged in successfully. 
			            console.log("Account created");
			        }
			        //Session.set('loading', false);
			        $('#signupbtn').removeClass('disabled');
			    });
			} else {
				// Not validated, informed user above
				console.log("Not validated, account not created");
			}
		    return false; // Stops page from reloading
		},

		'submit #recovery-form': function(event, template) {
			event.preventDefault();
			
			// Reset Validations
			$('#recovery-email-message').text("");
 			$('#recoveryEmailGroup').removeClass('has-error');

			var validated = true;
				email = trimInput(template.find('#recoveryEmail').value);

			if (email === "") {
				validated = false;
				$('#recovery-email-message').text("Email field is empty");
				$('#recoveryEmailGroup').addClass('has-error');
				console.log("Email field is empty");
			} else if (!isEmail(email)) {
				validated = false;
				$('#login-email-message').text("Email is not valid");
				$('#loginEmailGroup').addClass('has-error');
				console.log("Email is not valid");
			}

			if (validated) {
				//Session.set('loading', true);
				$('#sendResetInstructionbtn').addClass('disabled');
				Accounts.forgotPassword({email: email}, function(err) {
					if (err) {
						if (err.message === "User not found [403]") {
							$('#recovery-email-message').text("User does not exist");
							$('#recoveryEmailGroup').addClass('has-error');
							console.log("User does not exist")
						}
						else {
							$('#recovery-email-message').text("Password Reset Failed: " + err.message);
							console.log("Password Reset Failed: " + err);
						}					
					} else {
						$('#recovery-form').addClass('hidden');
						$('#email-sent-message').text("Email sent to: " + email);
						$('#email-sent-message').removeClass('hidden');
						$('#check-email-message').removeClass('hidden');
						console.log("Email sent to " + email + ", please check your email for further instructions");
					}
					//Session.set('loading', false);
					$('#sendResetInstructionbtn').removeClass('disabled');
				});
			}
			else {
				// Not validated, informed user above
				console.log("Not validated, password reset failed");
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
				$('#new-password-message').text("Password field is empty")
				$('#newPasswordGroup').addClass('has-error');
				console.log("Password field is empty");
			} else if (password.length < 6) {
				validated = false;
				$('#new-password-message').text("Password must be at least 6 characters long");
				$('#newPasswordGroup').addClass('has-error');
				console.log("Password must be at least 6 characters long");
			}

			if(password2 === "") {
				validated = false;
				$('#onfirm-new-password-message').text("Confirm field is empty");
				$('#confirmNewPasswordGroup').addClass('has-error');
			}

			if(validated && password !== password2) {
		    	validated = false;
		    	$('#new-password-message').text("Passwords don't match");
		    	$('#newPasswordGroup').addClass('has-error');
		    	$('#confirmNewPasswordGroup').addClass('has-error');
		    	console.log("Passwords don't match");
		    }

		    if (validated) {
		    	//Session.set('loading', true);
		    	$('#changePasswordbtn').addClass('disabled');
		    	Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
		    		if (err) {
		    			$('#new-password-message').text("Password Reset Failed: " + err);
		    			console.log("Password Reset Failed: " + err);
		    		} else {
		    			/* Do password reset functions */
		    			Session.set('resetPassword', null);

		    			$('#notificationText').removeClass();
						$('#notificationText').addClass("text-success");
		    			$('#notificationText').text("Your password reset was successful");
		    			Session.get('notification');
		    		}
		    		//Session.set('loading', false);
		    		$('#changePasswordbtn').removeClass('disabled');
		    	});
		    }
		    return false;	// Stops page from reloading
		}
	});

	Template.login.helpers({
		resetPassword : function(template) {
			if (Accounts._resetPasswordToken) {
				Session.set('resetPassword', Accounts._resetPasswordToken);
			}
			return Session.get('resetPassword');
		}
	});

	Template.notifier.events({
		'submit #notifier-form' : function(event) {
			event.preventDefault();
			Session.set('notification', null);
			return false;	// Stops page from reloading
		}
	})

 	Template.dashboard.events({
 		'click #logout': function(event) {
 			event.preventDefault();
 			Meteor.logout(function(err) {
 				if(err) {
 					console.log("Unable to logout from application: " + err);
 				}
 			});
 		}
 	});
}