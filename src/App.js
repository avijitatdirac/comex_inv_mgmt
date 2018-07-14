import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Login from './Login';
import { Route, Router, Switch } from 'react-router-dom';
import { DefaultLayout } from './containers';
import { history } from './_helpers';
import { PrivateRoute } from './_components';

class App extends Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/login" name="Login Page" component={Login} />
					<PrivateRoute path="/" name="Home" component={DefaultLayout} />
				</Switch>
			</Router>
		);
	}
}

export default App;
