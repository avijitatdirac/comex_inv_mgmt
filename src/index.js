import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { history } from './_helpers';
const fakeAuth = {
	isAuthenticated: false,
	authenticate(cb) {
		this.isAuthenticated = true;
		setTimeout(cb, 100); // fake async
	},
	signout(cb) {
		this.isAuthenticated = false;
		setTimeout(cb, 100);
	},
};

function LandingPage(props) {
	const isLoggedIn = props.isLoggedIn;
	if (isLoggedIn) {
		return <App />;
	}
	return <Login />;
}

/*ReactDOM.render(
	// Try changing to isLoggedIn={true}:
	<LandingPage isLoggedIn={false} />,
	document.getElementById('root')
);*/

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);
// registerServiceWorker();
/*(function(seconds) {
    var refresh,       
        intvrefresh = function() {
			
            clearInterval(refresh);
            refresh = setTimeout(function() {
              history.push('/login')
            }, seconds * 1000);
        };

    window.document.addEventListener('keypress click', function() { intvrefresh() });
    intvrefresh();

}(30));*/
