import React, { Component } from "react";
import { loadCart, removeProduct } from "../../../services/cart/actions";

import DelayLink from "../../helpers/delayLink";
import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import { connect } from "react-redux";
import { formatPrice } from "../../helpers/formatPrice";
import { updateCart } from "../../../services/total/actions";

class Cart extends Component {
	state = {
		isOpen: false,
		removeProductFromPreviousRestaurant: false
	};
	componentDidMount() {
		const { cartProducts } = this.props;
		if (cartProducts.length) {
			this.setState({ isOpen: true });
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.newProduct !== this.props.newProduct) {
			this.addProduct(nextProps.newProduct);
		}

		if (nextProps.productToRemove !== this.props.productToRemove) {
			this.removeProduct(nextProps.productToRemove);
		}
	}

	openFloatCart = () => {
		this.setState({ isOpen: true });
	};

	closeFloatCart = () => {
		this.setState({ isOpen: false });
	};

	addProduct = product => {
		const { cartProducts, updateCart } = this.props;

		//get restaurant id and save to localStorage as active restaurant
		localStorage.setItem("activeRestaurant", product.restaurant_id);

		let productAlreadyInCart = false;
		cartProducts.forEach(cp => {
			// first check if the restaurent id matches with items in cart
			// if restaurant id doesn't match, then remove all products from cart
			// then continue to add the new product to cart
			if (cp.restaurant_id === product.restaurant_id) {
				// then add the item to cart or increment count
				if (cp.id === product.id) {
					//check if product has customizations, and if the customization matches with any
					if (JSON.stringify(cp.selectedaddons) === JSON.stringify(product.selectedaddons)) {
						// increment the item quantity by 1
						cp.quantity += 1;
						productAlreadyInCart = true;
					}
				}
			} else {
				// else if restaurant id doesn't match, then remove all products from cart
				this.setState({ removeProductFromPreviousRestaurant: true });

				setTimeout(() => {
					this.setState({ removeProductFromPreviousRestaurant: false });
				}, 4 * 1000);

				cartProducts.splice(0, cartProducts.length);
			}
		});

		if (!productAlreadyInCart) {
			cartProducts.push(product);
		}

		updateCart(cartProducts);
		this.openFloatCart();
	};

	removeProduct = product => {
		const { cartProducts, updateCart } = this.props;

		const index = cartProducts.findIndex(p => p.id === product.id);

		//if product is in the cart then index will be greater than 0
		if (index >= 0) {
			cartProducts.forEach(cp => {
				if (cp.id === product.id) {
					if (cp.quantity === 1) {
						//if quantity is 1 then remove product from cart
						cartProducts.splice(index, 1);
					} else {
						//else decrement the quantity by 1
						cp.quantity -= product.quantity;
					}
				}
			});

			updateCart(cartProducts);
			if (cartProducts.length < 1) {
				this.closeFloatCart();
				localStorage.removeItem("activeRestaurant");
			}
		}
	};

	render() {
		const { cartTotal, cartProducts } = this.props;

		let classes = ["float-cart"];

		if (!!this.state.isOpen) {
			classes.push("float-cart--open");
		}
		return (
			<div
				className={classes.join(" ")}
				style={{
					backgroundColor: localStorage.getItem("cartColorBg"),
					color: localStorage.getItem("cartColorText")
				}}
			>
				{this.state.removeProductFromPreviousRestaurant && (
					<Fade duration={250} bottom>
						<div className="auth-error going-different-restaurant-notify">
							<div className="">{localStorage.getItem("itemsRemovedMsg")}</div>
						</div>
					</Fade>
				)}

				{cartProducts.length ? (
					<DelayLink to={"/cart"} delay={200} className="text-white">
						<span>
							{cartTotal.productQuantity} {localStorage.getItem("floatCartItemsText")}
						</span>
						<span className="pl-5 pr-5">&nbsp;|&nbsp;</span>
						<span>
							{localStorage.getItem("currencySymbolAlign") === "left" &&
								localStorage.getItem("currencyFormat")}
							{formatPrice(cartTotal.totalPrice)}
							{localStorage.getItem("currencySymbolAlign") === "right" &&
								localStorage.getItem("currencyFormat")}
						</span>
						{/* <span>{`${localStorage.getItem("currencyFormat")} ${formatPrice(cartTotal.totalPrice)}`}</span> */}
						<span className="pull-right">
							{localStorage.getItem("floatCartViewCartText")} <i className="si si-basket" />
						</span>
						<Ink duration="500" />
					</DelayLink>
				) : (
					<span>&nbsp;</span>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	cartProducts: state.cart.products,
	newProduct: state.cart.productToAdd,
	productToRemove: state.cart.productToRemove,
	cartTotal: state.total.data
});

export default connect(mapStateToProps, { loadCart, updateCart, removeProduct })(Cart);
