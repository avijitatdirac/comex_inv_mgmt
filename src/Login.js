import React, { Component } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import './css/index.css';
import './css/main.css';
import LOGO from './assets/ce_logo.gif';
import { validation } from './Classes';
import { history } from './_helpers';
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			submitted: false,
			usernameError: false,
			passwordError: false,
			usernameErrorText: '',
			passwordErrorText: '',
			successText: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		localStorage.removeItem('user');
		localStorage.removeItem('token');
	}
	handleChange(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
		if (name == 'username' && name.length > 0) {
			this.setState({ usernameError: false, usernameErrorText: '', successText: '' });
		}
		if (name == 'password' && name.length > 0) {
			this.setState({ passwordError: false, passwordErrorText: '', successText: '' });
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ submitted: true });
		const { username, password } = this.state;
		let isValid = true;
		if (!username) {
			this.setState({ usernameError: true, usernameErrorText: validation.messages().emailEmpty });
			isValid = false;
		}
		if (validation.validEmail(username)) {
			this.setState({ usernameError: false });
		} else {
			this.setState({ usernameError: true, usernameErrorText: validation.messages().notValidEmail });
			isValid = false;
		}
		if (password) {
			if (!validation.passwordLenghtCheck(password)) {
				isValid = false;
				this.setState({ passwordError: true, passwordErrorText: validation.messages().passwordLength });
			}
		} else {
			this.setState({ passwordError: true, passwordErrorText: validation.messages().passEmpty });
			isValid = false;
		}
		if (isValid) {
			fetch('/check_login', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: username, password })
			}).then(r => r.json())
				.then(data => {
					if (data.is_success) {
						localStorage.setItem('user', JSON.stringify(data))
						localStorage.setItem('token', 'afsjbgdkghdfhfhfhjflhjfjsbfdhgkdghdghfkgffhnbgvgkf');
						history.push('/dashboard');
						this.setState({ successText: validation.messages().loginSuccess });
					} else {
						this.setState({ passwordError: true, passwordErrorText: validation.messages().invalidUser });
					}
				})


			// if (username == 'admin@yopmail.com' && password == '12345678') {
			// 	localStorage.setItem(
			// 		'user',
			// 		JSON.stringify({
			// 			username: 'admin@yopmail.com',
			// 			username: 'admin',
			// 			role: 'admin',
			// 			branch: 'Kolkata',
			// 		})
			// 	);
			// 	localStorage.setItem('token', 'afsjbgdkghdfhfhfhjflhjfjsbfdhgkdghdghfkgffhnbgvgkf');
			// 	history.push('/dashboard');
			// 	this.setState({ successText: validation.messages().loginSuccess + 'kalkk' });
			// } else if (username == 'user@yopmail.com' && password == '87654321') {
			// 	localStorage.setItem(
			// 		'user',
			// 		JSON.stringify({ username: 'user@yopmail.com', username: 'sanjeet', role: 'user', branch: 'Pune' })
			// 	);
			// 	localStorage.setItem('token', 'trerergtbfvfkdhbdfnvksfhksfhsfnsfskfsfjs');
			// 	history.push('/dashboard');
			// 	this.setState({ successText: validation.messages().loginSuccess });
			// } else {
			// 	this.setState({ passwordError: true, passwordErrorText: validation.messages().invalidUser });
			// }
		}
	}

	render() {
		const { from } = { from: { pathname: '/' } };
		const {
			redirectToReferrerm,
			usernameError,
			passwordError,
			submitted,
			usernameErrorText,
			passwordErrorText,
			successText,
		} = this.state;

		/*if (this.state.isLoggedIn) {
			return <App />;
		}
		if (redirectToReferrer) {
			return <Redirect to={from} />;
		}*/
		return (
			<div className="login-form">
				<style>
					{`
					body > div,
					body > div > div,
					body > div > div > div.login-form {
					height: 100%;
					}
				`}
				</style>
				<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as="h2" color="teal" textAlign="center">
							<img style={{ width: 353 }} src={LOGO} alt="computer-exchange_logo" />
						</Header>
						<Form size="large" onSubmit={this.handleSubmit}>
							<Segment stacked>
								<Form.Input
									name="username"
									fluid
									icon="user"
									iconPosition="left"
									placeholder="Email address"
									error={usernameError}
									onChange={this.handleChange}
								/>
								<Form.Input
									fluid
									icon="lock"
									iconPosition="left"
									placeholder="Password"
									type="password"
									name="password"
									onChange={this.handleChange}
									error={passwordError}
								/>
								<Button color="blue" fluid size="large">
									Login
								</Button>
							</Segment>
						</Form>
						{submitted && usernameErrorText && <Message error header="Error" content={usernameErrorText} />}

						{submitted && passwordErrorText && <Message error header="Error" content={passwordErrorText} />}
						{submitted && successText && <Message success header="Success" content={successText} />}
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}
export default Login;
