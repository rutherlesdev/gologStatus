import React, { Component } from "react";

import { checkUserRunningOrder, updateUserInfo } from "../../../services/user/actions";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import BillDetails from "./BillDetails";
import CartCheckoutBlock from "./CartCheckoutBlock";
import CartItems from "./CartItems";
import Coupon from "./Coupon";
import DelayLink from "../../helpers/delayLink";
import Footer from "../Footer";
import Ink from "react-ink";
import Meta from "../../helpers/meta";
import OrderComment from "./OrderComment";
import OrderComment2 from "./OrderComment2";

import { Redirect } from "react-router";
import RestaurantInfoCart from "./RestaurantInfoCart";
import { calculateDistance } from "../../helpers/calculateDistance";
import { connect } from "react-redux";
import { getRestaurantInfoById } from "../../../services/items/actions";
import { updateCart } from "../../../services/total/actions";
import { formatPrice } from "../../helpers/formatPrice";
import { addProduct } from "../../../services/cart/actions";
import { checkCartItemsAvailability } from "../../../services/confirmCart/actions";

class Cart extends Component {
	static contextTypes = {
		router: () => null,
	};

	state = {
		loading: false,
		alreadyRunningOrders: false,
		is_operational_loading: true,
		is_operational: true,
		distance: 0,
		is_active: false,
		min_order_satisfied: false,
		process_cart_loading: false,
		is_all_items_available: false,
	};

	componentDidMount() {
		if (this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey");

			this.checkForItemsAvailability();
		}

		if (localStorage.getItem("activeRestaurant") !== null) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant"));
		}

		const { user } = this.props;
		if (user.success) {
			this.props.checkUserRunningOrder(user.data.id, user.data.auth_token);
			this.props.updateUserInfo(user.data.id, user.data.auth_token).then((updatedUser) => {
				// console.log("THIS SHOULD BE CALLED: UPDATED USER", updatedUser);
				if (typeof updatedUser !== "undefined") {
					const userSetAddress = {
						lat: updatedUser.payload.data.default_address.latitude,
						lng: updatedUser.payload.data.default_address.longitude,
						address: updatedUser.payload.data.default_address.address,
						house: updatedUser.payload.data.default_address.house,
						tag: updatedUser.payload.data.default_address.tag,
					};
					localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
				} else {
					console.warn("Failed to fetch update user info... Solution: Reload Page");
				}
			});
		} else {
			this.setState({ alreadyRunningOrders: false });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.restaurant_info.id) {
			this.__doesRestaurantOperatesAtThisLocation(nextProps.restaurant_info);

			this.__isRestaurantActive(nextProps.restaurant_info);

			this.__checkMinOrderSatisfied(nextProps.restaurant_info, nextProps.cartTotal);
		}

		if (nextProps.running_order) {
			this.setState({ alreadyRunningOrders: true });
		}
	}
	addProductQuantity = (product) => {
		const { cartProducts, updateCart } = this.props;
		let productAlreadyInCart = false;

		cartProducts.forEach((cp) => {
			if (cp.id === product.id) {
				if (JSON.stringify(cp.selectedaddons) === JSON.stringify(product.selectedaddons)) {
					cp.quantity += 1;
					productAlreadyInCart = true;
				}
			}
		});

		if (!productAlreadyInCart) {
			cartProducts.push(product);
		}

		updateCart(cartProducts);
	};

	removeProductQuantity = (product) => {
		const { cartProducts, updateCart } = this.props;

		const index = cartProducts.findIndex(
			(p) => p.id === product.id && JSON.stringify(p) === JSON.stringify(product)
		);
		//if product is in the cart then index will be greater than 0
		if (index >= 0) {
			cartProducts.forEach((cp) => {
				if (cp.id === product.id) {
					if (JSON.stringify(cp) === JSON.stringify(product)) {
						if (cp.quantity === 1) {
							//if quantity is 1 then remove product from cart
							cartProducts.splice(index, 1);
						} else {
							//else decrement the quantity by 1
							cp.quantity -= 1;
						}
					}
				}
			});

			updateCart(cartProducts);
		}
	};

	removeProduct = (product) => {
		// console.log(product);
		// console.log(product.id);

		const { cartProducts, updateCart } = this.props;
		const index = cartProducts.findIndex((cp) => cp.id === product.id);

		// console.log(index);
		cartProducts.splice(index, 1);
		// console.log(cartProducts);
		updateCart(cartProducts);

		this.checkForItemsAvailability();
	};

	__doesRestaurantOperatesAtThisLocation = (restaurant_info) => {
		//send user lat long to helper, check with the current restaurant lat long and setstate accordingly
		const { user } = this.props;
		if (user.success) {
			const distance = calculateDistance(
				restaurant_info.longitude,
				restaurant_info.latitude,
				user.data.default_address.longitude,
				user.data.default_address.latitude
			);
			// console.log(distance);
			this.setState({ distance: distance });
			if (distance <= restaurant_info.delivery_radius) {
				this.setState({
					is_operational: true,
					is_operational_loading: false,
				});
			} else {
				this.setState({
					is_operational: false,
					is_operational_loading: false,
				});
			}
		} else {
			const distance = calculateDistance(
				restaurant_info.longitude,
				restaurant_info.latitude,
				JSON.parse(localStorage.getItem("userSetAddress")).lng,
				JSON.parse(localStorage.getItem("userSetAddress")).lat
			);
			this.setState({ distance: distance });
			// console.log(distance);
			if (distance <= restaurant_info.delivery_radius) {
				this.setState({
					is_operational: true,
					is_operational_loading: false,
				});
			} else {
				this.setState({
					is_operational: false,
					is_operational_loading: false,
				});
			}
		}
	};

	__isRestaurantActive = (restaurant_info) => {
		if (restaurant_info.is_active) {
			this.setState({
				is_active: true,
			});
		}
	};

	__checkMinOrderSatisfied = (restaurant_info, cartTotal) => {
		if (restaurant_info.min_order_price > 0) {
			//if not null, then check the min order price with the order total
			const totalPrice = parseFloat(formatPrice(cartTotal.totalPrice));
			const minOrderPrice = parseFloat(formatPrice(restaurant_info.min_order_price));
			if (totalPrice >= minOrderPrice) {
				// console.log("Order Can Be Placed", totalPrice + " -- " + minOrderPrice);
				this.setState({ min_order_satisfied: true });
			} else {
				// console.log("Order CANNOT Be Placed", totalPrice + " -- " + minOrderPrice);
				this.setState({ min_order_satisfied: false });
			}
		} else {
			// if null, then set to satisfied to true...
			// console.log("Min order price is not set");
			this.setState({ min_order_satisfied: true });
		}
	};

	handleProcessCartLoading = (value) => {
		this.setState({ process_cart_loading: value });
	};

	checkForItemsAvailability = () => {
		const { checkCartItemsAvailability, cartProducts, addProduct, updateCart } = this.props;
		this.handleProcessCartLoading(true);
		checkCartItemsAvailability(cartProducts).then((response) => {
			this.handleProcessCartLoading(false);
			this.setState({ process_cart_loading: false });
			if (response.length) {
				//get inactive items and mark as is_active 0
				cartProducts
					.filter(({ id }) => response.includes(id))
					.map((item) => {
						item.is_active = 0;
						addProduct(item);
						return item;
					});
				this.handleItemsAvailability(false);
			} else {
				//if response length is 0 that means all items in cart are available, make all active
				cartProducts.map((item) => {
					item.is_active = 1;
					addProduct(item);
					return item;
				});
				this.handleItemsAvailability(true);
			}
			updateCart(this.props.cartProducts);
		});
	};
	handleItemsAvailability = (value) => {
		this.setState({ is_all_items_available: value });
	};
	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}

	render() {
		// console.log("IS ITEMS AVAILABLE", this.state.is_all_items_available);

		// console.log("MIN ORDER SATISFIED?", this.state.min_order_satisfied);

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		if (!this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.remove("bg-grey");
		}
		const { cartTotal, cartProducts, restaurant_info } = this.props;
		return (
			<React.Fragment>
				<Meta
					seotitle={"Entregas"}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>

				{this.state.process_cart_loading && (
					<div className="height-100 overlay-loading ongoing-payment-spin">
						<div className="spin-load" />
					</div>
				)}

				{this.state.loading ? (
					<div className="height-100 overlay-loading">
						<div>
							<img src="/assets/img/loading-food.gif" alt={localStorage.getItem("pleaseWaitText")} />
						</div>
					</div>
				) : (
					<React.Fragment>
						<BackWithSearch
							boxshadow={true}
							has_title={true}
							title={"Pedidos"}
							disable_search={true}
						/>
						{cartProducts.length ? (
							<React.Fragment>
								<div>
									<RestaurantInfoCart restaurant={restaurant_info} />
									<div className="block-content block-content-full bg-white pt-10 pb-5">
										<h2 className="item-text mb-10">
											Local da entrega
										</h2>
										{cartProducts.map((item, index) => (
											<CartItems
												item={item}
												addProductQuantity={this.addProductQuantity}
												removeProductQuantity={this.removeProductQuantity}
												removeProduct={this.removeProduct}
												key={item.name + item.id + index}
											/>
										))}
									</div>
									<OrderComment />
									<OrderComment2 />
								</div>

								<div>
									<Coupon />
									{this.state.alreadyRunningOrders && (
										<div className="auth-error ongoing-order-notify">
											<DelayLink to="/my-orders" delay={250} className="ml-2">
												{localStorage.getItem("ongoingOrderMsg")}{" "}
												<i
													className="si si-arrow-right ml-1"
													style={{
														fontSize: "0.7rem",
													}}
												/>
												<Ink duration="500" />
											</DelayLink>
										</div>
									)}
								</div>
								<div>
									<BillDetails total={cartTotal.totalPrice} distance={this.state.distance} />
								</div>

								{this.state.is_operational_loading ? (
									<img
										src="/assets/img/various/spinner.svg"
										className="location-loading-spinner"
										alt="loading"
										style={{ marginTop: "-1rem" }}
									/>
								) : (
									<React.Fragment>
										{this.state.is_active ? (
											<React.Fragment>
												{this.state.min_order_satisfied ? (
													<React.Fragment>
														{this.state.is_all_items_available && (
															<CartCheckoutBlock
																restaurant_id={this.props.restaurant_info.id}
																cart_page={this.context.router.route.location.pathname}
																is_operational_loading={
																	this.state.is_operational_loading
																}
																is_operational={this.state.is_operational}
																handleProcessCartLoading={this.handleProcessCartLoading}
																checkForItemsAvailability={
																	this.checkForItemsAvailability
																}
																handleItemsAvailability={this.handleItemsAvailability}
															/>
														)}
													</React.Fragment>
												) : (
													<div className="auth-error no-click">
														<div className="error-shake">
															{localStorage.getItem("restaurantMinOrderMessage")}{" "}
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}
															{this.props.restaurant_info.min_order_price}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</div>
													</div>
												)}
											</React.Fragment>
										) : (
											<div className="auth-error no-click">
												<div className="error-shake">
													{this.props.restaurant_info && this.props.restaurant_info.name} :{" "}
													{localStorage.getItem("notAcceptingOrdersMsg")}
												</div>
											</div>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						) : (
							<div className="bg-white cart-empty-block">
								<img
									className="cart-empty-img"
									src="/assets/img/cart-empty.png"
									alt={"Local da coleta"}
								/>
								<h2 className="cart-empty-text mt-50 text-center">
									Local da Coleta
								</h2>
								{this.state.alreadyRunningOrders && (
									<div
										className="auth-error ongoing-order-notify"
										style={{
											position: "fixed",
											bottom: "4.5rem",
										}}
									>
										<DelayLink to="/my-orders" delay={250} className="ml-2">
											Local da Coleta
											<i className="si si-arrow-right ml-1" style={{ fontSize: "0.7rem" }} />
											<Ink duration="500" />
										</DelayLink>
									</div>
								)}
								<Footer active_cart={true} />
							</div>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	restaurant_info: state.items.restaurant_info,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	user: state.user.user,
	running_order: state.user.running_order,
	restaurant: state.restaurant,
});

export default connect(
	mapStateToProps,
	{
		checkUserRunningOrder,
		updateCart,
		getRestaurantInfoById,
		updateUserInfo,
		addProduct,
		checkCartItemsAvailability,
	}
)(Cart);
