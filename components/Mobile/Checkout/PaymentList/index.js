import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import { Helmet } from "react-helmet";
import PaypalExpressBtn from "react-paypal-express-checkout";
import PaystackButton from "react-paystack";
import { RAZORPAY_PAYMENT_URL } from "../../../../configs";
import StripeCheckout from "react-stripe-checkout";
import { connect } from "react-redux";
import { formatPrice } from "../../../helpers/formatPrice";
import { getPaymentGateways } from "../../../../services/paymentgateways/actions";
import { placeOrder } from "../../../../services/checkout/actions";
import { updateUserInfo } from "../../../../services/user/actions";
import { calculateDistance } from "../../../helpers/calculateDistance";
import { calculateDistanceGoogle } from "../../../helpers/calculateDistanceGoogle";
import Axios from "axios";
import { GoogleApiWrapper } from "google-maps-react";
import { getRestaurantInfoById } from "../../../../services/items/actions";

class PaymentList extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		loading: true,
		stripe_opened: false,
		delivery_charges: 0.0,
		error: false,
		razorpay_opened: false,
		razorpay_success: false,
		canPayPartialWithWallet: false,
		walletChecked: false,
		canPayFullWithWallet: false,
		distance: 0,
		placeOrderError: false,
		errorMessage: "",
	};

	componentDidMount() {
		const { user } = this.props;

		if (localStorage.getItem("activeRestaurant") !== null) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant")).then((response) => {
				if (response) {
					if (response.payload.id) {
						this.__doesRestaurantOperatesAtThisLocation(response.payload);
					}
				}
			});
		}

		this.props.getPaymentGateways(this.props.user.data.auth_token);

		if (user.success) {
			this.props.updateUserInfo(user.data.id, user.data.auth_token, null);
		}

		if (localStorage.getItem("userSelected") === "SELFPICKUP") {
			this.setState({ delivery_charges: 0.0 });
		} else {
			this.setState({ delivery_charges: this.props.restaurant_info.delivery_charges });
		}
	}

	componentWillReceiveProps(nextProps) {
		const { paymentgateways } = this.props;
		if (paymentgateways !== nextProps.paymentgateways) {
			this.setState({ loading: false });
		}
		if (nextProps.checkout !== this.props.checkout) {
			//remove coupon
			localStorage.removeItem("appliedCoupon");
			//redirect to running order page
			this.context.router.history.push("/running-order/" + nextProps.checkout.data.unique_order_id);
		}

		// console.log("Wallet Balance: ", nextProps.user.data.wallet_balance);
		// console.log("Cart Amount: ", parseFloat(this.getTotalAfterCalculation()));

		//if  > 0 then user can pay with wallet (Amount will be deducted)
		if (nextProps.user.data.wallet_balance > 0) {
			// console.log("Can pay partial with wallet");
			this.setState({ canPayPartialWithWallet: true, canPayFullWithWallet: false });
		}

		if (nextProps.user.data.wallet_balance >= parseFloat(this.getTotalAfterCalculation())) {
			// console.log("Can pay full with wallet");
			this.setState({ canPayFullWithWallet: true, canPayPartialWithWallet: false });
		}
	}

	__doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
		//send user lat long to helper, check with the current restaurant lat long and setstate accordingly
		const { user } = this.props;
		if (user.success) {
			let self = this;

			if (localStorage.getItem("enGDMA") === "true") {
				this.props.handleProcessDistanceCalcLoading(true);
				calculateDistanceGoogle(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude,
					this.props.google,
					function(distance) {
						if (localStorage.getItem("userSelected") === "DELIVERY") {
							if (self.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
								self.setState({ distance: distance }, () => {
									//check if restaurant has dynamic delivery charge..
									self.calculateDynamicDeliveryCharge();
								});
							}
							self.props.handleProcessDistanceCalcLoading(false);
						}
					}
				);
			} else {
				const distance = calculateDistance(
					restaurant_info.longitude,
					restaurant_info.latitude,
					user.data.default_address.longitude,
					user.data.default_address.latitude
				);
				if (localStorage.getItem("userSelected") === "DELIVERY") {
					if (this.props.restaurant_info.delivery_charge_type === "DYNAMIC") {
						this.setState({ distance: distance }, () => {
							//check if restaurant has dynamic delivery charge..
							this.calculateDynamicDeliveryCharge();
						});
					}
				}
			}
		}
	};

	calculateDynamicDeliveryCharge = () => {
		const { restaurant_info } = this.props;

		const distanceFromUserToRestaurant = this.state.distance;
		// console.log("Distance from user to restaurant: " + distanceFromUserToRestaurant + " km");

		if (distanceFromUserToRestaurant > restaurant_info.base_delivery_distance) {
			const extraDistance = distanceFromUserToRestaurant - restaurant_info.base_delivery_distance;
			// console.log("Extra Distance: " + extraDistance + " km");

			const extraCharge =
				(extraDistance / restaurant_info.extra_delivery_distance) * restaurant_info.extra_delivery_charge;
			// console.log("Extra Charge: " + extraCharge);

			let dynamicDeliveryCharge = parseFloat(restaurant_info.base_delivery_charge) + parseFloat(extraCharge);
			if (localStorage.getItem("enDelChrRnd") === "true") {
				dynamicDeliveryCharge = Math.ceil(dynamicDeliveryCharge);
			}

			// console.log("Total Charge: " + dynamicDeliveryCharge);
			this.setState({ delivery_charges: dynamicDeliveryCharge });
		} else {
			this.setState({ delivery_charges: restaurant_info.base_delivery_charge });
		}
	};

	/* Stripe */
	onOpened = () => {
		this.setState({ stripe_opened: true });
	};
	onToken = (payment_token) => {
		const method = "STRIPE";
		this.__placeOrder(payment_token, method);
	};
	/* END Stripe */

	/* Paypal */
	onSuccess = (payment) => {
		const payment_token = "";
		const method = "PAYPAL";
		this.__placeOrder(payment_token, method);
	};

	onCancel = (data) => {
		console.log("Paypal Payment Canceled");
	};

	onError = (err) => {
		console.log("Error!");
	};
	/* END Paypal */

	/* PayStack */
	callback = (response) => {
		if (response.status === "success") {
			const payment_token = response.reference;
			const method = "PAYSTACK";
			this.__placeOrder(payment_token, method);
		} else {
			console.log(response);
		}
	};

	close = () => {
		console.log("PayStack Payment Closed");
	};

	getReference = () => {
		//you can put any unique reference implementation code here
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

		for (let i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};
	/* END PayStack */

	__placeOrder = (payment_token, method) => {
		// disable all button Onclick with pointer events
		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.add("no-click");
		}

		const { user, cartProducts, coupon, cartTotal } = this.props;
		if (user.success) {
			if (localStorage.getItem("userSelected") === "SELFPICKUP") {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						2,
						this.state.walletChecked,
						this.state.distance
					)
					.then((response) => {
						if (response) {
							if (!response.success) {
								this.setState({ placeOrderError: true, errorMessage: response.message });
							}
						}
					});
			} else {
				this.props
					.placeOrder(
						user,
						cartProducts,
						coupon,
						JSON.parse(localStorage.getItem("userSetAddress")),
						localStorage.getItem("orderComment"),
						cartTotal,
						method,
						payment_token,
						1,
						this.state.walletChecked,
						this.state.distance
					)
					.then((response) => {
						if (response) {
							console.log(response);
							if (!response.success) {
								console.log("here");
								this.setState({ placeOrderError: true, errorMessage: response.message });
								this.resetPage();
							}
						}
					});
			}

			//show progress bar
			const progressBar = document.getElementById("progressBar");
			progressBar.classList.remove("hidden");
			let progress = 0;
			var foo = setInterval(function() {
				if (progress > 100) {
					clearInterval(foo);
				}
				progress = progress + 1;
				progressBar.style.width = progress + "%";
			}, 20);

			this.setState({ stripe_opened: false });
		}
	};

	resetPage = () => {
		const progressBar = document.getElementById("progressBar");
		progressBar.classList.add("hidden");
		setTimeout(() => {
			progressBar.style.width = "0%";
		}, 2200);

		let paymentgatewaysblock = document.getElementsByClassName("paymentGatewayBlock");
		for (let i = 0; i < paymentgatewaysblock.length; i++) {
			paymentgatewaysblock[i].classList.remove("no-click");
		}
	};
	// Calculating total with/without coupon/tax
	getTotalAfterCalculation = () => {
		const { coupon, restaurant_info, user } = this.props;
		const total = this.props.cartTotal.totalPrice;
		let calc = 0;
		if (coupon.code) {
			if (coupon.discount_type === "PERCENTAGE") {
				let percentage_discount = formatPrice((coupon.discount / 100) * parseFloat(total));
				if (coupon.max_discount) {
					if (parseFloat(percentage_discount) >= coupon.max_discount) {
						percentage_discount = coupon.max_discount;
					}
				}
				coupon.appliedAmount = percentage_discount;
				calc = formatPrice(
					formatPrice(
						parseFloat(total) -
							percentage_discount +
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
			if (this.state.walletChecked && user.data.wallet_balance < calc) {
				calc = calc - user.data.wallet_balance;
			}
			return calc;
		} else {
			if (this.state.walletChecked && user.data.wallet_balance < calc) {
				calc = calc - user.data.wallet_balance;
			}
			return calc;
		}
	};

	/* Razorpay */
	__handleRazorPay = () => {
		let self = this;
		this.setState({ razorpay_opened: true });
		const totalAmount = formatPrice(parseFloat(this.getTotalAfterCalculation()));

		Axios.post(RAZORPAY_PAYMENT_URL, {
			totalAmount: totalAmount,
		})
			.then((res) => {
				// console.log(res.data.response.id);
				if (res.data.razorpay_success) {
					const options = {
						key: localStorage.getItem("razorpayKeyId"),
						amount: totalAmount,
						name: localStorage.getItem("storeName"),
						currency: localStorage.getItem("currencyId"),
						order_id: res.data.response.id,
						handler(response) {
							// console.log("Final Response", response);
							self.setState({ razorpay_opened: false, razorpay_success: true });
							const payment_token = "";
							const method = "RAZORPAY";
							self.__placeOrder(payment_token, method);
						},
						modal: {
							ondismiss: function() {
								console.log("closed");
								self.setState({ razorpay_opened: false, razorpay_success: false });
							},
						},
						prefill: {
							name: this.props.user.data.name,
							email: this.props.user.data.email,
							contact: this.props.user.data.phone,
						},
					};
					const rzp1 = new window.Razorpay(options);

					rzp1.open();
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	};
	/* END Razorpay */

	render() {
		const client = {
			sandbox: localStorage.getItem("paypalSandboxKey"),
			production: localStorage.getItem("paypalProductionKey"),
		};
		return (
			<React.Fragment>
				{this.state.placeOrderError && (
					<div className="auth-error ongoing-payment">
						<div className="error-shake">{this.state.errorMessage}</div>
					</div>
				)}

				{this.props.paymentgateways.some((gateway) => gateway.name === "Razorpay") && (
					<Helmet>
						<script src="https://checkout.razorpay.com/v1/checkout.js" />
					</Helmet>
				)}
				{this.state.stripe_opened ||
					(this.state.razorpay_opened && (
						<React.Fragment>
							<div className="height-80 overlay-loading ongoing-payment-spin">
								<div className="spin-load" />
							</div>
							<div className="auth-error ongoing-payment">
								<div className="error-shake">{localStorage.getItem("checkoutPaymentInProcess")}</div>
							</div>
						</React.Fragment>
					))}

				<div className="col-12 mb-50">
					{this.state.loading ? (
						<div className="row">
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="0" y="10" rx="0" ry="0" width="55" height="55" />
											<rect x="320" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="250" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="block block-link-shadow text-left shadow-light">
									<div className="block-content block-content-full clearfix py-3 payment-select-block">
										<ContentLoader
											height={70}
											width={window.innerWidth}
											speed={1.2}
											primaryColor="#f3f3f3"
											secondaryColor="#ecebeb"
										>
											<rect x="0" y="10" rx="0" ry="0" width="55" height="55" />
											<rect x="320" y="10" rx="0" ry="0" width="85" height="20" />
											<rect x="250" y="40" rx="0" ry="0" width="190" height="18" />
										</ContentLoader>
									</div>
								</div>
							</div>
						</div>
					) : (
						<React.Fragment>
							<div className="text-center">
								<h3
									className="btn btn-lg btn-outline-secondary btn-square d-block bg-white"
									style={{ borderColor: "#eee" }}
								>
									{localStorage.getItem("cartToPayText")}{" "}
									<span style={{ color: localStorage.getItem("storeColor") }}>
										{localStorage.getItem("currencySymbolAlign") === "left" &&
											localStorage.getItem("currencyFormat")}
										{formatPrice(parseFloat(this.getTotalAfterCalculation()))}
										{localStorage.getItem("currencySymbolAlign") === "right" &&
											localStorage.getItem("currencyFormat")}
									</span>
								</h3>
							</div>
							<div className="row">
								{this.state.canPayPartialWithWallet && (
									<React.Fragment>
										<div
											className="col-12"
											onClick={() => this.setState({ walletChecked: !this.state.walletChecked })}
										>
											<div className="block block-link-shadow text-left shadow-light">
												<div className="block-content block-content-full clearfix py-3 payment-select-block">
													<div className="float-right mt-10">
														<img
															src="/assets/img/various/wallet.png"
															alt={localStorage.getItem("walletName")}
															className="img-fluid"
														/>
													</div>
													<input
														type="checkbox"
														name="walletcheckbox"
														defaultChecked={this.props.walletChecked}
														className="wallet-checkbox"
													/>
													<div className="font-size-h3 font-w600">
														{this.state.walletChecked && (
															<i
																className="si si-check mr-2"
																style={{
																	color: localStorage.getItem("cartColorBg"),
																	fontWeight: "900",
																}}
															/>
														)}
														{localStorage.getItem("walletName")}:{" "}
														<span style={{ color: localStorage.getItem("storeColor") }}>
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{this.props.user.data.wallet_balance}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>
													</div>
													<div className="font-size-sm font-w600 text-muted">
														{this.state.walletChecked ? (
															<React.Fragment>
																<span
																	style={{
																		color: localStorage.getItem("storeColor"),
																	}}
																>
																	{" "}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}
																	{this.props.user.data.wallet_balance}{" "}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</span>{" "}
																{localStorage.getItem("willbeDeductedText")}{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{this.props.user.data.wallet_balance}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</React.Fragment>
														) : (
															<React.Fragment>
																<span>
																	{localStorage.getItem("payPartialWithWalletText")}
																</span>
																<button
																	className="btn btn-redeem mt-2"
																	style={{
																		color: localStorage.getItem("cartColorBg"),
																		borderColor: localStorage.getItem(
																			"cartColorBg"
																		),
																	}}
																>
																	{localStorage.getItem("walletRedeemBtnText")}
																</button>
															</React.Fragment>
														)}
													</div>
												</div>
											</div>
											<hr className="mb-4" />
										</div>
									</React.Fragment>
								)}
								<hr />
								<div className="col-12 text-center mb-0 mt-4">
									<h4 className="text-muted">{localStorage.getItem("checkoutPaymentListTitle")}</h4>
								</div>
								{this.state.canPayFullWithWallet && (
									<React.Fragment>
										<div
											className="col-12 paymentGatewayBlock"
											onClick={() => this.__placeOrder("", "WALLET")}
										>
											<p className="mb-1" />
											<div className="block block-link-shadow text-left shadow-light">
												<div className="block-content block-content-full clearfix py-3 payment-select-block">
													<div className="float-right mt-10">
														<img
															src="/assets/img/various/wallet.png"
															alt={localStorage.getItem("walletName")}
															className="img-fluid"
														/>
													</div>
													<div className="font-size-h3 font-w600">
														{localStorage.getItem("walletName")}
													</div>
													<div className="font-size-sm font-w600 text-muted">
														{localStorage.getItem("payFullWithWalletText")}
														<br />
														<span style={{ color: localStorage.getItem("storeColor") }}>
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{parseFloat(this.getTotalAfterCalculation())}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>{" "}
														{localStorage.getItem("willbeDeductedText")}{" "}
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}
														{this.props.user.data.wallet_balance}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</div>
												</div>
											</div>
										</div>
										<hr />
									</React.Fragment>
								)}
								{this.props.paymentgateways.map((gateway) => (
									<React.Fragment key={gateway.id}>
										<div className="col-12 paymentGatewayBlock">
											{gateway.name === "Stripe" && (
												<StripeCheckout
													stripeKey={localStorage.getItem("stripePublicKey")}
													ComponentClass="div"
													image={`${window.location.origin.toString()}/assets/img/logos/${localStorage.getItem(
														"storeLogo"
													)}`}
													locale="auto"
													name={localStorage.getItem("storeName")}
													email={this.props.user.data.email}
													token={this.onToken}
													opened={this.onOpened}
													amount={parseFloat(this.getTotalAfterCalculation() * 100)}
													currency={localStorage.getItem("currencyId")}
													alipay={
														localStorage.getItem("stripeAcceptAliPay") === "true"
															? true
															: false
													}
													bitcoin={
														localStorage.getItem("stripeAcceptBitCoin") === "true"
															? true
															: false
													}
												>
													<div className="col-12 p-0">
														<div className="block block-link-shadow text-left shadow-light">
															<div className="block-content block-content-full clearfix py-3 payment-select-block">
																<div className="float-right mt-10">
																	<img
																		src="/assets/img/various/stripe.png"
																		alt={gateway.name}
																		className="img-fluid"
																	/>
																</div>
																<div className="font-size-h3 font-w600">
																	{localStorage.getItem("checkoutStripeText")}
																	<div className="font-size-sm font-w600 text-muted">
																		{localStorage.getItem("checkoutStripeSubText")}
																	</div>
																</div>
															</div>
														</div>
													</div>
												</StripeCheckout>
											)}
										</div>
										{gateway.name === "COD" && (
											<div
												className="col-12 paymentGatewayBlock"
												onClick={() => this.__placeOrder("", "COD")}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/cod.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutCodText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutCodSubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "Razorpay" && (
											<div
												className="col-12 paymentGatewayBlock"
												onClick={() => this.__handleRazorPay()}
											>
												<div className="block block-link-shadow text-left shadow-light">
													<div className="block-content block-content-full clearfix py-3 payment-select-block">
														<div className="float-right mt-10">
															<img
																src="/assets/img/various/razorpay.png"
																alt={gateway.name}
																className="img-fluid"
															/>
														</div>
														<div className="font-size-h3 font-w600">
															{localStorage.getItem("checkoutRazorpayText")}
														</div>
														<div className="font-size-sm font-w600 text-muted">
															{localStorage.getItem("checkoutRazorpaySubText")}
														</div>
													</div>
												</div>
											</div>
										)}
										{gateway.name === "PayStack" && (
											<div className="col-12 mb-4 mt-4 paymentGatewayBlock">
												<PaystackButton
													text={localStorage.getItem("paystackPayText")}
													class="payButton"
													callback={this.callback}
													close={this.close}
													disabled={false}
													embed={false}
													reference={this.getReference()}
													email={this.props.user.data.email}
													amount={parseInt(parseFloat(this.getTotalAfterCalculation() * 100))}
													paystackkey={localStorage.getItem("paystackPublicKey")}
													tag="button"
													currency={localStorage.getItem("currencyId")}
												/>
											</div>
										)}
										{gateway.name === "Paypal" && (
											<div className="col-12 paymentGatewayBlock">
												<PaypalExpressBtn
													env={localStorage.getItem("paypalEnv")}
													client={client}
													currency={localStorage.getItem("currencyId")}
													total={parseFloat(this.getTotalAfterCalculation())}
													shipping={1}
													onError={this.onError}
													onSuccess={this.onSuccess}
													onCancel={this.onCancel}
													style={{
														size: "responsive",
														color: "silver",
														shape: "rect",
													}}
												/>
											</div>
										)}
									</React.Fragment>
								))}
							</div>
						</React.Fragment>
					)}
				</div>

				<div className="progress push m-0 progress-transparent" style={{ height: "8px" }}>
					<div
						className="progress-bar progress-bar-striped progress-bar-animated hidden"
						role="progressbar"
						id="progressBar"
						style={{
							backgroundColor: localStorage.getItem("storeColor"),
							width: "10%",
						}}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	checkout: state.checkout.checkout,
	paymentgateways: state.paymentgateways.paymentgateways,
	restaurant_info: state.items.restaurant_info,
});

export default connect(
	mapStateToProps,
	{ getPaymentGateways, placeOrder, updateUserInfo, getRestaurantInfoById }
)(
	GoogleApiWrapper({
		apiKey: localStorage.getItem("googleApiKey"),
	})(PaymentList)
);
