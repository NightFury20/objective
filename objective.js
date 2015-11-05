if (Meteor.isClient) {
	// This code only runs on the client (meant for the interface)
	// Trim helper
	var trimInput = function(val) {
		return val.replace(/^\s*|\s*$/g, "");
	};

	Template.login.events({	// Responds to login submit event
 		'submit #login-form': function(event, t) {	//When form is submitted
 			event.preventDefault();
 			// Retrieve the input field values
 			var email = document.getElementById('loginEmail').value,
 				password = document.getElementById('loginPassword').value;

			// Trim and validation your fields here....
			email = trimInput(email);

			// If validation passes, supply the appropriate fields to the Meteor.loginWithPassword() function.
			Meteor.loginWithPassword(email, password, function(err) {
				if (err) {
					// The user might not have been found, or their password could be incorrect.  Inform the user that their login attempt has failed
					alert("Login failed");
					console("Login failed");
				}
				else {
					// The user has been logged in.
					console.log("Login sucessful");
				}
			});
 			return false; // Stops page from reloading
 		},
 		'submit #signup-form': function(event) { // When form is submitted
 			event.preventDefault();
 			var validated = true,
 				email = trimInput(document.getElementById('signupEmail').value),
		    	name = trimInput(document.getElementById('signupDisplayName').value),
		    	password = document.getElementById('signupPassword').value,
		    	password2 = document.getElementById('signupConfirmPassword').value;

		    // Validate Input
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
	});

	Template.passwordRecovery.events({
		'submit #recovery-form': function(event) {
			event.preventDefault();
			var validated = true;
				email = trimInput(document.getElementById('recoveryEmail').value);

			if (validated) {
				Session.set('loading', true);
				Account.forgotPassword({email: email}, function(err) {
					if (err) {
						alert("Password Reset Failed");
						console.log("Password Reset Failed");
					} else {
						alert("Email sent");
						console.log("Email sent, check email");
					}
					Session.set('loading', false);
				});
			}
			return false; // Stops page from reloading
		},

		'submit #new-password-form' : function(event) {
			event.preventDefault();
			var validated = true,
				password = document.getElementById('newPassword').value,
		    	password2 = document.getElementById('confirmNewPassword').value;

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

	if (Accounts._resetPasswordToken) {
		Session.set('resetPassword', Accounts._resetPasswordToken);
	}

	Template.passwordRecovery.helpers({
		resetPassword : function(t) {
			return Session.get('resetPassword');
		}
	});

 	Template.dashboard.events({
 		'click #logout': function(event) {
 			Meteor.logout();
 		}
 	});
}

if (Meteor.isServer) {
	// This code only runs on the server
  	Meteor.startup(function () {
    	// code to run on server at startup
  	});
  	Accounts.config({
  		sendVerificationEmail: true
  	});
}