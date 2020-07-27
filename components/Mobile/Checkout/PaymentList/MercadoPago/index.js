import React, { Component } from "react";
//THIS CLASS COMPONENT IS JUST FOR TESTING .... donot work on this
class MercadoPago extends Component {
	componentDidMount() {
		this.scriptLoader();
	}

	componentWillUnmount() {
		this.scriptUnloader();
	}

	scriptLoader = () => {
		const script = document.createElement("script");
		console.log(script);

		script.src = "https://www.mercadopago.com.mx/integrations/v1/web-tokenize-checkout.js";
		script.id = "checkout-button-mercadopago";
		script.dataset.publicKey = "TEST-1435ea5e-f432-41a5-b87b-7823f22ab5e6";
		script.dataset.transactionAmount = "100.00";
		// script.async = true;
		document.body.appendChild(script);
		window.addEventListener("load", this.scriptMover); // Runs when all the assets loaded completely
	};

	scriptUnloader = () => {
		document.body.removeChild(document.querySelector("#checkout-button-mercadopago")); // Remove the script element on unmount
	};

	scriptMover = () => {
		const button = document.querySelector(".mercadopago-button"); // Gets the button
		this.buttonContainerRef.current.appendChild(button); // Appends the button to the ref element, in this case form element
	};

	render() {
		return (
			<React.Fragment>
				<form
					action="http://127.0.0.1/swiggy-laravel-react/public/api/payment/mercadopago-payment"
					method="POST"
					ref={this.buttonContainerRef}
				/>
			</React.Fragment>
		);
	}
}

export default MercadoPago;
