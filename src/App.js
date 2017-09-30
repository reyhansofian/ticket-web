import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
    super(props);

    this.state = {
      isSuccessfulLogin:false,
      token:"",
      userId:""
    };
  }

  // phone form submission handler
  smsLogin = () => {
		window.AccountKit.login(
		  'PHONE',
		  {countryCode: '', phoneNumber: ''}, // will use default values if not specified
		  this.loginCallback
		);
  }

  // email form submission handler
  emailLogin = () => {
		//var emailAddress = document.getElementById("email").value;
		window.AccountKit.login(
		  'EMAIL',
		  {emailAddress: 'computecoholic@gmail.com'},
		  this.loginCallback
		);
  }

  fetchUserData = (url) => {
    fetch(url, {
      method: 'GET'
      })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
      })
      .then((resp) => {
        this.setState({isSuccessfulLogin:true,token:resp.access_token,userId:resp.id});
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // login callback
  loginCallback = (response) => {
    console.log('[DEBUG] response', response);
		if (response.status === "PARTIALLY_AUTHENTICATED") {
		  const code = response.code;
      const account_kit_api_version = 'v1.1';
      const app_id = process.env.REACT_APP_APP_ID;
      const app_secret = process.env.REACT_APP_APP_SECRET;
      const token_exchange_base_url = `https://graph.accountkit.com/${account_kit_api_version}/access_token`;

      const app_access_token = ['AA', app_id, app_secret].join('|');
      const params = {
        grant_type: 'authorization_code',
        code,
        access_token: app_access_token
      };

      function toQueryString(paramsObject) {
        return Object
          .keys(paramsObject)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
          .join('&')
        ;
      }

      const token_exchange_url = token_exchange_base_url + '?' + toQueryString(params);
      this.fetchUserData(token_exchange_url);
		}
		else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
      console.log('[DEBUG] response', response);

		}
		else if (response.status === "BAD_PARAMS") {
		  // handle bad parameters

      console.log('[DEBUG] response', response);
		}
  }

  render() {
    return (
        <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p className="App-intro">
          Untuk melanjutkan checkout, silahkan login
        </p>
        <div>
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.smsLogin}>Login via SMS</button>
        </div>
        <div>atau</div>
        <div>
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={this.emailLogin}>Login via Email</button>
        </div>
        <div className={(!this.state.isSuccessfulLogin)?'App-inVisible':''}>
          <div><code>User Token:</code> {this.state.token}</div>
          <div><code>User Id:</code> {this.state.userId}</div>
        </div>
      </div>
    );
  }
}

export default App;
