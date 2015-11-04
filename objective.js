Objectives = new Mongo.Collection("objectives");

if (Meteor.isServer) {
	// This code only runs on the server
  	Meteor.startup(function () {
    	// code to run on server at startup
  	});
}

if (Meteor.isClient) {
	// This code only runs on the client (meant for the interface)

 	Template.signup.events({	// Responds to sign up submit event
 		'submit form': function(event) {
 			event.preventDefault(); // No default behaviour
 			var emailVar = event.target.signupEmail.value; // Store email value from form
 			var passwordVar = event.target.signupPassword.value; // Store password value from form
 			console.log("Sign up form submitted."); // Output message in console

 			Accounts.createUser({
 				email: emailVar,
 				password: passwordVar
 			});
 		}
 	});

 	Template.login.events({	// Responds to login submit event
 		'submit form': function(event) {
 			event.preventDefault();	// No default behaviour
 			var emailVar = event.target.loginEmail.value;	// Store email value from form
 			var passwordVar = event.target.loginPassword.value;	// Store password value from form
 			console.log("Login form submitted")	// Output message in console

 			Meteor.loginWithPassword(emailVar, passwordVar);
 		}
 	});

 	Template.dashboard.events({
 		'click .logout': function(event) {
 			event.preventDefault();	//	No default behaviour
 			Meteor.logout();	// Call meteors logout method
 		}
 	})
}