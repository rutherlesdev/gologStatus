import React, { Component } from "react";

import Flip from "react-reveal/Flip";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Meta from "../../helpers/meta";
import PopularPlaces from "./PopularPlaces";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { getPopularLocations } from "../../../services/popularLocations/actions";
import { GET_ADDRESS_FROM_COORDINATES } from "../../../configs";
import Axios from "axios";

import { getAddresses, setDefaultAddress } from "../../../services/addresses/actions";
import AddressList from "../Account/Addresses/AddressList";
import Ink from "react-ink";

class Location extends Component {
	state = {
		google_script_loaded: false,
		loading_popular_location: true,
		gps_loading: false,
	};
	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		this.props.getPopularLocations();

		if (this.searchInput) {
			this.searchInput.focus();
		}

		// setTimeout(() => {
		// 	this.setState({ google_script_loaded: true });
		// }, 2000);

		const existingScript = document.getElementById("googleMaps");
		if (!existingScript) {
			const script = document.createElement("script");
			script.src =
				"https://maps.googleapis.com/maps/api/js?key=" +
				localStorage.getItem("googleApiKey") +
				"&libraries=places";
			script.id = "googleMaps";
			document.body.appendChild(script);
			script.onload = () => {
				this.setState({ google_script_loaded: true });
			};
		}
	}

	componentWillUnmount() {
		//remove script when component unmount
		const existingScript = document.getElementById("googleMaps");
		if (existingScript) {
			existingScript.parentNode.removeChild(existingScript);
		}
	}

	handleGeoLocationClick = (results) => {
		// console.log(results);
		const saveGeoLocation = new Promise((resolve) => {
			localStorage.setItem("geoLocation", JSON.stringify(results[0]));
			resolve("GeoLocation Saved");
		});
		saveGeoLocation.then(() => {
			this.setState({ gps_loading: false });
			this.context.router.history.push("/my-location");
		});
	};

	getMyLocation = () => {
		const location = navigator && navigator.geolocation;
		console.log("LOCATION", location);
		this.setState({ gps_loading: true });
		if (location) {
			location.getCurrentPosition(
				(position) => {
					this.reverseLookup(position.coords.latitude, position.coords.longitude);
				},
				(error) => {
					this.setState({ gps_loading: false });
					console.log(error);
					alert(localStorage.getItem("gpsAccessNotGrantedMsg"));
				}
			);
		}
	};

	reverseLookup = (lat, lng) => {
		Axios.post(GET_ADDRESS_FROM_COORDINATES, {
			lat: lat,
			lng: lng,
		})
			.then((response) => {
				console.log(response);
				const myLocation = [
					{
						formatted_address: response.data,
						geometry: {
							location: {
								lat: lat,
								lng: lng,
							},
						},
					},
				];
				this.handleGeoLocationClick(myLocation);
			})
			.catch(function(error) {
				console.warn(error.response.data);
			});
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.popular_locations !== nextProps.popular_locations) {
			this.setState({ loading_popular_location: false });
		}
	}

	handleSetDefaultAddress = (address_id, address) => {
		// console.log("Address FULL", address);
		const { user } = this.props;
		if (user.success) {
			this.props.setDefaultAddress(user.data.id, address_id, user.data.auth_token).then(() => {
				const saveUserSetAddress = new Promise((resolve) => {
					const userSetAddress = {
						lat: address.latitude,
						lng: address.longitude,
						address: address.address,
						house: address.house,
						tag: address.tag,
					};
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
					resolve("Address Saved");
				});
				saveUserSetAddress.then(() => {
					this.context.router.history.push("/");
				});
			});
		}
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user, popular_locations, addresses } = this.props;

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
				{this.state.gps_loading && (
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				)}
				<div className="col-12 p-0 pt-0">
					{this.state.google_script_loaded && (
						<GooglePlacesAutocomplete
							debounce={750}
							withSessionToken={true}
							loader={
								<img
									src="/assets/img/various/spinner.svg"
									className="location-loading-spinner"
									alt="loading"
								/>
							}
							renderInput={(props) => (
								<div className="input-location-icon-field">
									<i className="si si-magnifier" />
									<div className="input-group-prepend">
										<button
											type="button"
											className="btn search-navs-btns location-back-button"
											style={{ position: "relative" }}
											onClick={() => this.context.router.history.goBack()}
										>
											<i className="si si-arrow-left" />
											<Ink duration="500" />
										</button>
										<input
											{...props}
											className="form-control search-input"
											placeholder={localStorage.getItem("searchAreaPlaceholder")}
											ref={(input) => {
												this.searchInput = input;
											}}
										/>
									</div>
								</div>
							)}
							renderSuggestions={(active, suggestions, onSelectSuggestion) => (
								<div className="location-suggestions-container">
									{suggestions.map((suggestion, index) => (
										<Flip top delay={index * 50} key={suggestion.id}>
											<div
												className="location-suggestion"
												onClick={(event) => {
													onSelectSuggestion(suggestion, event);
													geocodeByPlaceId(suggestion.place_id)
														.then((results) => this.handleGeoLocationClick(results))
														.catch((error) => console.error(error));
												}}
											>
												<span className="location-main-name">
													{suggestion.structured_formatting.main_text}
												</span>
												<br />
												<span className="location-secondary-name">
													{suggestion.structured_formatting.secondary_text}
												</span>
											</div>
										</Flip>
									))}
									<img
										src="/assets/img/various/powered_by_google_on_white.png"
										alt="powered by Google"
										className="pl-15"
									/>
								</div>
							)}
						/>
					)}

					<button
						className="btn btn-rounded btn-gps btn-md ml-15 mt-4 pl-0 py-15"
						style={{ color: localStorage.getItem("storeColor") }}
						onClick={this.getMyLocation}
					>
						<i className="si si-pointer" /> {localStorage.getItem("useCurrentLocationText")}
					</button>
				</div>
				<PopularPlaces
					loading={this.state.loading_popular_location}
					handleGeoLocationClick={this.handleGeoLocationClick}
					locations={popular_locations}
				/>
				{user.success && addresses.length > 0 && (
					<React.Fragment>
						<div className="p-15 mt-10 location-saved-address">
							<h1 className="text-muted h4">{localStorage.getItem("locationSavedAddresses")}</h1>
							{addresses.map((address) => (
								<AddressList
									handleDeleteAddress={this.handleDeleteAddress}
									deleteButton={false}
									key={address.id}
									address={address}
									user={user}
									fromCartPage={false}
									handleSetDefaultAddress={this.handleSetDefaultAddress}
								/>
							))}
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	popular_locations: state.popular_locations.popular_locations,
	addresses: state.addresses.addresses,
});

export default connect(
	mapStateToProps,
	{ getPopularLocations, getAddresses, setDefaultAddress }
)(Location);
