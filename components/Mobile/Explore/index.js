import React, { Component } from "react";
import { clearSearch, searchRestaurants } from "../../../services/searchRestaurants/actions";

import Footer from "../Footer";
import ItemSearchList from "./ItemSearchList";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import RestaurantSearch from "./RestaurantSearch";
import RestaurantSearchList from "./RestaurantSearchList";
import { connect } from "react-redux";
import { debounce } from "../../helpers/debounce";
import ContentLoader from "react-content-loader";

class Explore extends Component {
	state = {
		queryLengthError: false,
		loading: false,
		showBgImage: true,
		nothingFound: false,
	};

	handleRestaurantSearch = debounce((query) => {
		// call to searchRestaurants search API
		if (query.length >= 3) {
			this.props.searchRestaurants(
				JSON.parse(localStorage.getItem("userSetAddress")).lat,
				JSON.parse(localStorage.getItem("userSetAddress")).lng,
				query
			);
			this.setState({
				queryLengthError: false,
				loading: true,
				nothingFound: false,
			});
		} else {
			this.setState({ queryLengthError: true });
		}
	}, 400);

	componentDidMount() {
		if (document.querySelectorAll("a[href='/explore']")[0]) {
			document.querySelectorAll("a[href='/explore']")[0].classList.add("no-click");
		}
	}
	componentWillUnmount() {
		// this.props.clearSearch();
		if (document.querySelectorAll("a[href='/explore']")[0]) {
			document.querySelectorAll("a[href='/explore']")[0].classList.remove("no-click");
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.restaurants !== nextProps.restaurants) {
			this.setState({ loading: false });
		}
		// console.log(nextProps.restaurants.restaurants.length);

		if (nextProps.restaurants) {
			if (nextProps.restaurants.restaurants.length === 0 && nextProps.restaurants.items.length === 0) {
				this.setState({ showBgImage: true, nothingFound: true });
			} else {
				this.setState({ showBgImage: false, nothingFound: false });
			}
		}
	}
	render() {
		// console.log("Show BG Image:", this.state.showBgImage);

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
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
				{this.state.queryLengthError && (
					<div className="auth-error" style={{ marginBottom: "4rem" }}>
						<div className="">{localStorage.getItem("searchAtleastThreeCharsMsg")}</div>
					</div>
				)}
				<RestaurantSearch searchFunction={this.handleRestaurantSearch} />

				{this.state.loading && (
					<ContentLoader
						height={window.innerHeight}
						width={window.innerWidth}
						speed={1.2}
						primaryColor="#f3f3f3"
						secondaryColor="#ecebeb"
					>
						<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
						<rect x="144" y="35" rx="0" ry="0" width="115" height="18" />
						<rect x="144" y="65" rx="0" ry="0" width="165" height="16" />

						<rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
						<rect x="144" y="160" rx="0" ry="0" width="115" height="18" />
						<rect x="144" y="190" rx="0" ry="0" width="165" height="16" />

						<rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
						<rect x="144" y="285" rx="0" ry="0" width="115" height="18" />
						<rect x="144" y="315" rx="0" ry="0" width="165" height="16" />
					</ContentLoader>
				)}

				{this.props.restaurants.restaurants && this.props.restaurants.restaurants.length > 0 && (
					<RestaurantSearchList restaurants={this.props.restaurants.restaurants} />
				)}
				{this.props.restaurants.items && this.props.restaurants.items.length > 0 && (
					<ItemSearchList items={this.props.restaurants.items} />
				)}

				{this.state.showBgImage && (
					<div className="d-flex justify-content-center mt-100">
						<img
							className="img-fluid explore-bg"
							src="/assets/img/various/explore-bg.png"
							alt={localStorage.getItem("restaurantSearchPlaceholder")}
						/>
					</div>
				)}
				{this.state.nothingFound && (
					<div className="auth-error" style={{ marginBottom: "4rem" }}>
						<div className="error-shake">{localStorage.getItem("exploreNoResults")}</div>
					</div>
				)}

				<Footer active_explore={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurants: state.restaurants.restaurants,
});

export default connect(
	mapStateToProps,
	{ searchRestaurants, clearSearch }
)(Explore);
