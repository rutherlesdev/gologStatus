import React, { Component } from "react";

import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";

class BillDetails extends Component {
	state = {
		delivery_charges: 0,
		distance: 0,
	};

	componentDidMount() {
		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			console.log("here");
			this.setState({ delivery_charges: 0 });
		} else {
			this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (localStorage.getItem("userSelected") === "DELIVERY") {
			if (this.props.restaurant_info.delivery_charges !== nextProps.restaurant_info.delivery_charges) {
				this.setState({ delivery_charges: nextProps.restaurant_info.delivery_charges });
			}
		}

		if (nextProps.distance) {
			if (localStorage.getItem("userSelected") === "DELIVERY") {
				if (nextProps.restaurant_info.delivery_charge_type === "DYNAMIC") {
					this.setState({ distance: nextProps.distance }, () => {
						//check if restaurant has dynamic delivery charge..
						this.calculateDynamicDeliveryCharge();
					});
				}
			}
		}
	}

	calculateDynamicDeliveryCharge = () => {
		const { restaurant_info } = this.props;

		const distanceFromUserToRestaurant = this.state.distance;
		console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");

		if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
			const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
			console.log("Extra Distance: " + extraDistance + " km");

			const extraCharge =
				(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
			console.log("Extra Charge: " + extraCharge);

			let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
			console.log("Total Charge: " + dynamicDeliveryCharge);
			if (localStorage.getItem("enDelChrRnd") === "true") {
				dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
			}

			this.setState({ delivery_charges: dynamicDeliveryCharge });
		} else {
			this.setState({ delivery_charges: restaurant_info.base_delivery_charge });
		}
	};

	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { total, restaurant_info, coupon } = this.props;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				calc = formatPrice(
					formatPrice(
						parseFloat(total) -
							formatPrice((coupon.discount / 100) * parseFloat(total)) +
							parseFloat(restaurant_info.restaurant_charges || 0.0) +
							parseFloat(this.state.delivery_charges || 0.0)
					)
				);
			} else {
				calc = formatPrice(
					parseFloat(total) -
						(parseFloat(coupon.discount) || 0.0) +
						((parseFloat(restaurant_info.restaurant_charges) || 0.0) +
							(parseFloat(this.state.delivery_charges) || 0.0))
				);
			}
		} else {
			calc = formatPrice(
				parseFloat(total) +
					parseFloat(restaurant_info.restaurant_charges || 0.0) +
					parseFloat(this.state.delivery_charges || 0.0)
			);
		}
		if (localStorage.getItem("taxApplicable") === "true") {
			calc = formatPrice(
				parseFloat(
					parseFloat(calc) + parseFloat(parseFloat(localStorage.getItem("taxPercentage")) / 100) * calc
				)
			);
			return calc;
		} else {
			return calc;
		}
	};

	render() {
		const { total, restaurant_info, coupon } = this.props;
		return (
			<React.Fragment>
				<div className="bg-white bill-details mb-200">
					<div className="p-15">
						<h2 className="bill-detail-text m-0">{localStorage.getItem("cartBillDetailsText")}</h2>
						<div className="display-flex">
							<div className="flex-auto">{localStorage.getItem("cartItemTotalText")}</div>
							<div className="flex-auto text-right">
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{formatPrice(total)}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</div>
						</div>
						<hr />
						{coupon.code && (
							<React.Fragment>
								<div className="display-flex">
									<div className="flex-auto coupon-text">
										{localStorage.getItem("cartCouponText")}
									</div>
									<div className="flex-auto text-right coupon-text">
										<span>-</span>
										{coupon.discount_type === "PERCENTAGE" ? (
											coupon.discount + "%"
										) : (
											<React.Fragment>
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat") + coupon.discount}

												{localStorage.getItem("currencySymbolAlign") === "right" &&
													coupon.discount + localStorage.getItem("currencyFormat")}
											</React.Fragment>
										)}
									</div>
								</div>
								<hr />
							</React.Fragment>
						)}
						{restaurant_info.restaurant_charges === "0.00" ||
						restaurant_info.restaurant_charges === null ? null : (
							<div className="display-flex">
								<div className="flex-auto">{localStorage.getItem("cartRestaurantCharges")}</div>
								<div className="flex-auto text-right">
									{localStorage.getItem("currencySymbolAlign") === "left" &&
										localStorage.getItem("currencyFormat")}
									{restaurant_info.restaurant_charges}
									{localStorage.getItem("currencySymbolAlign") === "right" &&
										localStorage.getItem("currencyFormat")}
								</div>
							</div>
						)}
						<hr />
						{this.state.delivery_charges === 0 ? (
							<React.Fragment>
								<div className="display-flex">
									<div className="flex-auto">{localStorage.getItem("cartDeliveryCharges")}</div>
									<div className="flex-auto text-right">
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										0
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
								</div>
								<hr />
							</React.Fragment>
						) : (
							<React.Fragment>
								<div className="display-flex">
									<div className="flex-auto">{localStorage.getItem("cartDeliveryCharges")}</div>
									<div className="flex-auto text-right">
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{formatPrice(this.state.delivery_charges)}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</div>
								</div>
								<hr />
							</React.Fragment>
						)}
						{localStorage.getItem("taxApplicable") === "true" && (
							<React.Fragment>
								<div className="display-flex">
									<div className="flex-auto text-danger">{localStorage.getItem("taxText")}</div>
									<div className="flex-auto text-right text-danger">
										<span>+</span>
										{localStorage.getItem("taxPercentage")}%
									</div>
								</div>
								<hr />
							</React.Fragment>
						)}
						<div className="display-flex">
							<div className="flex-auto font-w700">{localStorage.getItem("cartToPayText")}</div>
							<div className="flex-auto text-right font-w700">
								{/* Calculating total after discount coupon or without discount coupon */}
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{this.getTotalAfterCalculation()}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</div>
						</div>
						{localStorage.getItem("userSelected") === "SELFPICKUP" && (
							<p className="my-2 mt-3 text-danger font-weight-bold">
								{localStorage.getItem("selectedSelfPickupMessage")}
							</p>
						)}
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	coupon: state.coupon.coupon,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{}
)(BillDetails);
