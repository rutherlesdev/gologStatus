import * as firebase from "firebase/app";

import React, { Component } from "react";

import Meta from "../helpers/meta";
import Orders from "./Orders";
import Atrasado from "./Orders/atrasado";
import Suspenso from "./Orders/suspenso";
import Bloqueado from "./Orders/bloqueado";

import { Redirect } from "react-router";
import { connect } from "react-redux";

import messaging from "../../init-fcm";
import { saveNotificationToken } from "../../services/notification/actions";
import ShareLiveLocation from "./ShareLiveLocation";
import DeliveryDesktop from "./DeliveryDesktop";

class Delivery extends Component {
	async componentDidMount() {
		if (document.querySelector("#mainManifest")) {
			document.querySelector("#mainManifest").setAttribute("href", "/delivery-manifest.json");
		}
		if (document.getElementsByTagName("body")) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey");
		}

		const { delivery_user } = this.props;

		if (delivery_user.success) {
			if (firebase.messaging.isSupported()) {
				let handler = this.props.saveNotificationToken;
				messaging
					.requestPermission()
					.then(async function() {
						const push_token = await messaging.getToken();
						handler(push_token, delivery_user.data.id, delivery_user.data.auth_token);
					})
					.catch(function(err) {
						console.log("Unable to get permission to notify.", err);
					});
				// navigator.serviceWorker.addEventListener("message", message => console.log(message));
			}
		}
	}

	render() {
		if (window.innerWidth > 768) {
			return <DeliveryDesktop />;
		}
		const { delivery_user } = this.props;

		if (!delivery_user.success) {
			return <Redirect to={"/delivery/login"} />;
		}



var carteira = setInterval(verificaValor, 3000);
var bloqueio = setInterval(verificaNome, 3000);
var suspenso = setInterval(verificaTipo, 3000);


console.log(carteira)

function verificaValor() {
  if (delivery_user.data.wallet_balance > 30) {
	  return console.log("teste")
	  
	  
  }
}

function verificaNome() {
	if (delivery_user.data.name.includes("bloqueado")) {
		return "bloqueado"
		
		
	}
  }

  function verificaTipo() {
	if (delivery_user.data.name.includes("suspenso")) {
		return "suspenso"
		
		
	}
  }

  console.log(carteira)
		
if (carteira === "boleto" ) {
	
	return (
		<React.Fragment>
			<Meta
				seotitle="Delivery Orders"
				seodescription={localStorage.getItem("seoMetaDescription")}
				ogtype="website"
				ogtitle={localStorage.getItem("seoOgTitle")}
				ogdescription={localStorage.getItem("seoOgDescription")}
				ogurl={window.location.href}
				twittertitle={localStorage.getItem("seoTwitterTitle")}
				twitterdescription={localStorage.getItem("seoTwitterDescription")}
			/>

			<Atrasado />
			<ShareLiveLocation />
		</React.Fragment>
	);
	
}


if (bloqueio === "bloqueado") {

	return (
		<React.Fragment>
			<Meta
				seotitle="Delivery Orders"
				seodescription={localStorage.getItem("seoMetaDescription")}
				ogtype="website"
				ogtitle={localStorage.getItem("seoOgTitle")}
				ogdescription={localStorage.getItem("seoOgDescription")}
				ogurl={window.location.href}
				twittertitle={localStorage.getItem("seoTwitterTitle")}
				twitterdescription={localStorage.getItem("seoTwitterDescription")}
			/>

			<Bloqueado />
			<ShareLiveLocation />
		</React.Fragment>
	);
	
}

	 
if (suspenso === "suspenso") {

	return (
		<React.Fragment>
			<Meta
				seotitle="Delivery Orders"
				seodescription={localStorage.getItem("seoMetaDescription")}
				ogtype="website"
				ogtitle={localStorage.getItem("seoOgTitle")}
				ogdescription={localStorage.getItem("seoOgDescription")}
				ogurl={window.location.href}
				twittertitle={localStorage.getItem("seoTwitterTitle")}
				twitterdescription={localStorage.getItem("seoTwitterDescription")}
			/>

			<Suspenso />
			<ShareLiveLocation />
		</React.Fragment>
	);
	
}


return (
	<React.Fragment>
		<Meta
			seotitle="Delivery Orders"
			seodescription={localStorage.getItem("seoMetaDescription")}
			ogtype="website"
			ogtitle={localStorage.getItem("seoOgTitle")}
			ogdescription={localStorage.getItem("seoOgDescription")}
			ogurl={window.location.href}
			twittertitle={localStorage.getItem("seoTwitterTitle")}
			twitterdescription={localStorage.getItem("seoTwitterDescription")}
		/>

		<Orders />
		<ShareLiveLocation />
	</React.Fragment>
);





	
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
});

export default connect(
	mapStateToProps,
	{ saveNotificationToken }
)(Delivery);
