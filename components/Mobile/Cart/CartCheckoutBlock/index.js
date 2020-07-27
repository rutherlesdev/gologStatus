import React, { Component } from "react";

import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import { Link } from "react-router-dom";
import { checkConfirmCart, checkCartItemsAvailability } from "../../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { placeOrder } from "../../../../services/checkout/actions";
import { addProduct } from "../../../../services/cart/actions";
import { updateCart } from "../../../../services/total/actions";

class CartCheckoutBlock extends Component {
	static contextTypes = {
		router: () => null
	};
	// state = {
	//     loading: true,
	//     is_operational: true
	// };

	state = {
		process_cart_loading: false
	};

	componentDidMount() {
		// this.props.checkForItemsAvailability();
	}

	componentWillReceiveProps(nextProps) {
		// const { checkout} = this.props;
		if (nextProps.checkout !== this.props.checkout) {
			//redirect to running order page
			this.context.router.history.push("/running-order");
		}
		// console.log("NEXT PROPS - " + nextProps.is_operational);
		// if (nextProps.is_operational !== this.props.is_operational) {
		//     console.log("Came here -> FROM CHILD");
		//     this.setState({ is_operational: false, loading: false });
		// }
	}

	processCart = () => {
		const {
			handleProcessCartLoading,
			checkCartItemsAvailability,
			cartProducts,
			addProduct,
			updateCart,
			checkConfirmCart,
			handleItemsAvailability
		} = this.props;

		handleProcessCartLoading(true);

		checkCartItemsAvailability(cartProducts).then(response => {
			handleProcessCartLoading(false);
			this.setState({ process_cart_loading: false });
			if (response.length) {
				cartProducts
					.filter(({ id }) => response.includes(id))
					.map(item => {
						item.is_active = 0;
						addProduct(item);
						return item;
					});
				updateCart(this.props.cartProducts);
				handleItemsAvailability(false); //all items not available
			} else {
				cartProducts.map(item => {
					item.is_active = 1;
					addProduct(item);
					return item;
				});
				updateCart(this.props.cartProducts);
				checkConfirmCart();
				this.context.router.history.push("/checkout");
			}
		});
	};

	render() {
		// console.log("LOADING - " + this.state.loading);

		const { user } = this.props;
		return (
			<React.Fragment>
				<div
					className="bg-white cart-checkout-block"
					style={{
						height: user.success && localStorage.getItem("userSelected") === "SELFPICKUP" ? "auto" : "22vh"
					}}
				>
					{user.success ? (
						user.data.default_address == null ? (
							<div className="p-15">
								<h2 className="almost-there-text m-0 pb-5">
									{localStorage.getItem("cartSetYourAddress")}
								</h2>
								<DelayLink
									to="/my-addresses"
									delay={200}
									className="btn btn-lg btn-continue"
									style={{
										position: "relative",
										backgroundColor: localStorage.getItem("storeColor")
									}}
								>
									{localStorage.getItem("buttonNewAddress")}
									<Ink duration={500} />
								</DelayLink>
							</div>
						) : (
							<React.Fragment>
								{localStorage.getItem("userSelected") === "DELIVERY" && (
									<React.Fragment>
										<div className="px-15 py-10">
											<Link
												to={{
													pathname: "/my-addresses",
													state: {
														restaurant_id: this.props.restaurant_id
													}
												}}
												className="change-address-text m-0 p-5 pull-right"
												style={{
													color: localStorage.getItem("storeColor")
												}}
											>
												{localStorage.getItem("cartChangeLocation")}
												<Ink duration={400} />
											</Link>
											<h2 className="deliver-to-text m-0 pl-0 pb-5">
												{localStorage.getItem("cartDeliverTo")}
											</h2>
											<div className="user-address truncate-text m-0 pt-10">
												{user.data.default_address.address}
												{user.data.default_address.house !== null && (
													<p className="truncate-text">{user.data.default_address.house}</p>
												)}
											</div>
										</div>
									</React.Fragment>
								)}
								<React.Fragment>
									{this.props.is_operational ? (
										<div style={{ marginTop: "1.6rem" }}>
											<div
												onClick={this.processCart}
												className="btn btn-lg btn-make-payment"
												style={{
													backgroundColor: localStorage.getItem("cartColorBg"),
													color: localStorage.getItem("cartColorText"),
													position: "relative"
												}}
											>
												{localStorage.getItem("checkoutSelectPayment")}
												<Ink duration={400} />
											</div>
										</div>
									) : (
										<div className="auth-error bg-danger">
											<div className="error-shake">
												{localStorage.getItem("cartRestaurantNotOperational")}
											</div>
										</div>
									)}
								</React.Fragment>
							</React.Fragment>
						)
					) : (
						<div className="p-15">
							<h2 className="almost-there-text m-0 pb-5">{localStorage.getItem("cartLoginHeader")}</h2>
							<span className="almost-there-sub text-muted">
								{localStorage.getItem("cartLoginSubHeader")}
							</span>
							<DelayLink
								to="/login"
								delay={200}
								className="btn btn-lg btn-continue"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
									position: "relative"
								}}
							>
								{localStorage.getItem("cartLoginButtonText")}
								<Ink duration={500} />
							</DelayLink>
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	addresses: state.addresses.addresses,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	checkout: state.checkout.checkout,
	restaurant: state.restaurant
});

export default connect(mapStateToProps, {
	placeOrder,
	checkConfirmCart,
	checkCartItemsAvailability,
	addProduct,
	updateCart
})(CartCheckoutBlock);
