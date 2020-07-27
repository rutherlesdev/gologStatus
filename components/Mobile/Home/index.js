import * as firebase from "firebase/app";

import React, { Component } from "react";

import Footer from "../Footer";
import Meta from "../../helpers/meta";
import Nav from "../Nav";
import PromoSlider from "./PromoSlider";
import { Redirect } from "react-router";
import RestaurantList from "./RestaurantList";
import { connect } from "react-redux";
import { getPromoSlides } from "../../../services/promoSlider/actions";

import messaging from "../../../init-fcm";
import { saveNotificationToken } from "../../../services/notification/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import { getUserNotifications } from "../../../services/alert/actions";
import moment from "moment";

class Home extends Component {
	static contextTypes = {
		router: () => null,
	};

	

	async componentDidMount() {
		const { user } = this.props;
		


		//if currentLocation doesnt exists in localstorage then redirect the user to firstscreen
		//else make API calls
		if (localStorage.getItem("userSetAddress") !== null) {
			// this.context.router.history.push("/search-location");
			// console.log("Redirect to search location");
			// return <Redirect to="/search-location" />;
			this.props.getPromoSlides();

			const { user } = this.props;

			if (user.success) {
				this.props.getUserNotifications(user.data.id, user.data.auth_token);
			}
		} else {
			//call to promoSlider API to fetch the slides
		}

		if (user.success) {
			if (firebase.messaging.isSupported()) {
				const today = moment().toDate();

				// console.log("TODAY", today);
				const lastSavedNotificationToken = moment(localStorage.getItem("lastSavedNotificationToken"));
				const days = moment(today).diff(lastSavedNotificationToken, "days");

				// console.log("DAYS", days);

				const callForNotificationToken = isNaN(days) || days >= 5;

				// console.log(callForNotificationToken);
				if (callForNotificationToken) {
					let handler = this.props.saveNotificationToken;
					messaging
						.requestPermission()
						.then(async function() {
							const push_token = await messaging.getToken();
							handler(push_token, user.data.id, user.data.auth_token);
							localStorage.setItem("lastSavedNotificationToken", today);
						})
						.catch(function(err) {
							console.log("Unable to get permission to notify.", err);
						});
					// navigator.serviceWorker.addEventListener("message", message =>
					//     console.log(message)
					// );
				}
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	componentWillUnmount() {
		// navigator.serviceWorker.removeEventListener("message", message => console.log(message));
	}

	render() {
		

		if (localStorage.getItem("userSetAddress") === null) {
			// this.context.router.history.push("/search-location");
			// console.log("Redirect to search location");
			return <Redirect to="/search-location" />;
		}

		const userSetAddress = JSON.parse(localStorage.getItem("userSetAddress"));
		if (Object.keys(userSetAddress).length === 0 && userSetAddress.constructor === Object) {
			return <Redirect to="/search-location" />;
		}

		const { history, user, promo_slides } = this.props;

		// console.log(promo_slides.mainSlides.length);

		return (
			 


			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				
				<div style={{marginTop:"50"}} className="height-100-percent bg-white mb-50">
					<Nav
						logo={true}
						active_nearme={true}
						disable_back_button={true}
						history={history}
						loggedin={user.success}
					/>
					
					
					
					<RestaurantList user={user}  />
					<Footer active_nearme={true} />
				</div>
			</React.Fragment>
		);
	}
}



const mapStateToProps = (state) => ({
	
	promo_slides: state.promo_slides.promo_slides,
	user: state.user.user,
	locations: state.locations.locations,
	languages: state.languages.languages,
});

export default connect(
	mapStateToProps,
	{
		getPromoSlides,
		saveNotificationToken,
		getSingleLanguageData,
		getUserNotifications,
	}
)(Home);
