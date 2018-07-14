export const validation = {
	emptyCheck,
	messages,
	validEmail,
	passwordLenghtCheck,
};

function emptyCheck(data) {
	if (data && data.length > 0) {
		return true;
	}
}

function validEmail(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	} else {
		return false;
	}
}
function passwordLenghtCheck(password) {
	if (password.length < 8) {
		return false;
	} else {
		return true;
	}
}

function messages() {
	return {
		emailEmpty: 'Mail address should not be empty!',
		passEmpty: 'Password should not be empty!',
		passwordLength: 'Password should be at least 8 characters',
		loginSuccess: 'You are successfully logged in',
		notValidEmail: 'Mail address is not valid!',
		invalidUser: 'Invalid user',
	};
}
