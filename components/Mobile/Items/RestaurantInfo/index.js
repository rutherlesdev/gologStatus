import React, { Component } from "react";

import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";

import { Link } from "react-router-dom";

class RestaurantInfo extends Component {
	state = {
		withLinkToRestaurant: false,
	};

	componentDidMount() {
		this.setState({ withLinkToRestaurant: this.props.withLinkToRestaurant });

		if (this.props.history.location.state && this.props.history.location.state.fromExplorePage) {
			this.setState({ withLinkToRestaurant: this.props.history.location.state.fromExplorePage });
		}

		this.registerScrollEvent();
	}

	componentWillUnmount() {
		this.removeScrollEvent();
	}

	fixedRestaurantInfo = (hidden) => {
		if (this.child) {
			if (hidden) {
				this.child.heading.classList.add("hidden");
			} else {
				this.child.heading.classList.remove("hidden");
			}
		}
	};

	registerScrollEvent() {
		window.addEventListener("scroll", this.scrollFunc);
	}
	removeScrollEvent() {
		window.removeEventListener("scroll", this.scrollFunc);
	}
	scrollFunc = () => {
		if (document.documentElement.scrollTop > 55) {
			let hidden = false;
			this.fixedRestaurantInfo(hidden);
		}
		if (document.documentElement.scrollTop < 55) {
			let hidden = true;
			this.fixedRestaurantInfo(hidden);
		}
	};
	render() {
		const { history, restaurant } = this.props;
		return (
			<React.Fragment>
				<div className="height-25 bg-white">
					<BackWithSearch
						ref={(node) => {
							this.child = node;
						}}
						history={history}
						boxshadow={false}
						has_restaurant_info={true}
						restaurant={restaurant}
						disable_search={true}
					/>

					{restaurant.length === 0 ? (
						<ContentLoader
							height={170}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					) : (
						<React.Fragment>
							<Link
								to={"../../stores/" + restaurant.slug}
								className={this.state.withLinkToRestaurant ? "" : "no-click"}
							>
								<div className="pt-50">
									<div className="block-content block-content-full pt-2">
										<img
											src={restaurant.image}
											alt={restaurant.name}
											className="restaurant-image mt-0"
										/>
									</div>
									<div className="block-content block-content-full restaurant-info">
										<h4 className="font-w600 mb-5 text-dark">{restaurant.name}</h4>
										<div className="font-size-sm text-muted truncate-text text-muted">
											{restaurant.description}
										</div>
										{restaurant.is_pureveg === 1 && (
											<p className="mb-0">
												<span className="font-size-sm pr-1 text-muted">
													{localStorage.getItem("pureVegText")}
												</span>
												<img
													src="/assets/img/various/pure-veg.png"
													alt="PureVeg"
													style={{ width: "20px" }}
												/>
											</p>
										)}
										<div className="text-center restaurant-meta mt-5 d-flex align-items-center justify-content-between text-muted">
											<div className="col-2 p-0 text-left">
												<i
													className="fa fa-star"
													style={{
														color: localStorage.getItem("storeColor"),
													}}
												/>{" "}
												{restaurant.rating}
											</div>
											<div className="col-4 p-0 text-center">
												<i className="si si-clock" /> {restaurant.delivery_time}{" "}
												{localStorage.getItem("homePageMinsText")}
											</div>
											<div className="col-6 p-0 text-center">
												<i className="si si-wallet" />{" "}
												{localStorage.getItem("currencySymbolAlign") === "left" && (
													<React.Fragment>
														{localStorage.getItem("currencyFormat")}
														{restaurant.price_range}{" "}
													</React.Fragment>
												)}
												{localStorage.getItem("currencySymbolAlign") === "right" && (
													<React.Fragment>
														{restaurant.price_range}
														{localStorage.getItem("currencyFormat")}{" "}
													</React.Fragment>
												)}
												{localStorage.getItem("homePageForTwoText")}
											</div>
										</div>
									</div>
								</div>
							</Link>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default RestaurantInfo;
