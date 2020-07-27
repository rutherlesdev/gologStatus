import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Meta from "../../helpers/meta";
import PaymentList from "./PaymentList";
import { Redirect } from "react-router";
import { checkConfirmCart } from "../../../services/confirmCart/actions";
import { connect } from "react-redux";
import { placeOrder } from "../../../services/checkout/actions";

// import Ink from "react-ink";

// import DelayLink from "../../helpers/delayLink";

class Checkout extends Component {
	componentDidMount() {
		if (this.props.cartProducts.length) {
			document.getElementsByTagName("body")[0].classList.add("bg-grey-light");
		}
	}

	__placeOrder = () => {
		const { user, cartProducts, coupon, cartTotal } = this.props;
		if (user.success) {
			this.props.placeOrder(user, cartProducts, coupon, localStorage.getItem("currentLocation"), cartTotal);
		}
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey-light");
	}

	render() {
		if (!this.props.cartProducts.length) {
			// no items in cart after checkout goto cart page
			return <Redirect to={"/cart"} />;
		}

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		//TODO:
		//check if the referrer is cart page, if not then redirect to cart
		if (!this.props.confirmCart) {
			return <Redirect to={"/cart"} />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("checkoutPageTitle")}
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				<BackWithSearch
					boxshadow={true}
					has_title={true}
					title={localStorage.getItem("checkoutPageTitle")}
					disable_search={true}
				/>
				<div className="pt-50">
					<div className="pt-30"></div>
					<PaymentList />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	total: state.total.total,
	user: state.user.user,
	cartProducts: state.cart.products,
	cartTotal: state.total.data,
	coupon: state.coupon.coupon,
	confirmCart: state.confirmCart.confirmCart
});
export default connect(mapStateToProps, { checkConfirmCart, placeOrder })(Checkout);
