import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";
import {
	getRestaurantInfo,
	getRestaurantItems,
	getSingleItem,
	resetInfo,
	resetItems,
} from "../../../../services/items/actions";

import Customization from "../Customization";
import Fade from "react-reveal/Fade";
import FloatCart from "../../FloatCart";
import Ink from "react-ink";
import ItemBadge from "../ItemList/ItemBadge";
import LazyLoad from "react-lazyload";

import { Redirect } from "react-router";
import RestaurantInfo from "../RestaurantInfo";

import { connect } from "react-redux";

class SingleItem extends Component {
	state = {
		update: true,
		is_active: 1,
		loading: true,
	};
	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			if (this.state.update) {
				this.setState({ update: false });
			} else {
				this.setState({ update: true });
			}
		}, 100);
	};

	componentDidMount() {
		this.props.getRestaurantInfo(this.props.match.params.restaurant);
		this.props.getSingleItem(this.props.match.params.id);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.restaurant_info.is_active === "undefined") {
			this.setState({ loading: true });
		}
		if (nextProps.restaurant_info.is_active === 1 || nextProps.restaurant_info.is_active === 0) {
			this.setState({ loading: false });
			this.setState({ is_active: nextProps.restaurant_info.is_active });
		}
		if (!this.state.is_active) {
			document.getElementsByTagName("html")[0].classList.add("page-inactive");
		}
	}

	componentWillUnmount() {
		document.getElementsByTagName("html")[0].classList.remove("page-inactive");
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}

		const { addProduct, removeProduct, cartProducts, single_item } = this.props;
		return (
			<React.Fragment>
				<RestaurantInfo
					history={this.props.history}
					restaurant={this.props.restaurant_info}
					withLinkToRestaurant={true}
				/>

				{single_item.id && (
					<div className="single-item px-15 mt-20">
						<span className="hidden">{(single_item.quantity = 1)}</span>
						<div
							className="category-list-item"
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							{single_item.image !== "" && (
								<LazyLoad>
									<img
										src={single_item.image}
										alt={single_item.name}
										style={{ width: "100%", height: "auto" }}
									/>

									<React.Fragment>
										{cartProducts.find((cp) => cp.id === single_item.id) !== undefined && (
											<Fade duration={150}>
												<div
													className="quantity-badge-list"
													style={{
														backgroundColor: localStorage.getItem("storeColor"),
													}}
												>
													<span>
														{single_item.addon_categories.length ? (
															<React.Fragment>
																<i
																	className="si si-check"
																	style={{
																		lineHeight: "1.3rem",
																	}}
																/>
															</React.Fragment>
														) : (
															<React.Fragment>
																{
																	cartProducts.find((cp) => cp.id === single_item.id)
																		.quantity
																}
															</React.Fragment>
														)}
													</span>
												</div>
											</Fade>
										)}
									</React.Fragment>
								</LazyLoad>
							)}
						</div>
						<div className="single-item-meta">
							<div className="item-actions pull-right pb-0">
								<div className="btn-group btn-group-sm" role="group" aria-label="btnGroupIcons1">
									{single_item.addon_categories.length ? (
										<button
											disabled
											type="button"
											className="btn btn-add-remove"
											style={{
												color: localStorage.getItem("cartColor-bg"),
											}}
										>
											<span className="btn-dec">-</span>
											<Ink duration="500" />
										</button>
									) : (
										<button
											type="button"
											className="btn btn-add-remove"
											style={{
												color: localStorage.getItem("cartColor-bg"),
											}}
											onClick={() => {
												single_item.quantity = 1;
												removeProduct(single_item);
												this.forceStateUpdate();
											}}
										>
											<span className="btn-dec">-</span>
											<Ink duration="500" />
										</button>
									)}

									{single_item.addon_categories.length ? (
										<Customization
											product={single_item}
											addProduct={addProduct}
											forceUpdate={this.forceStateUpdate}
										/>
									) : (
										<button
											type="button"
											className="btn btn-add-remove"
											style={{
												color: localStorage.getItem("cartColor-bg"),
											}}
											onClick={() => {
												addProduct(single_item);
												this.forceStateUpdate();
											}}
										>
											<span className="btn-inc">+</span>
											<Ink duration="500" />
										</button>
									)}
								</div>
							</div>

							<div className="item-name font-w600 mt-2">
								{localStorage.getItem("showVegNonVegBadge") === "true" &&
									single_item.is_veg !== null && (
										<React.Fragment>
											{single_item.is_veg ? (
												<img
													src="/assets/img/various/veg-icon.png"
													alt="Veg"
													style={{ width: "1rem" }}
													className="mr-1"
												/>
											) : (
												<img
													src="/assets/img/various/non-veg-icon.png"
													alt="Non-Veg"
													style={{ width: "1rem" }}
													className="mr-1"
												/>
											)}
										</React.Fragment>
									)}
								{single_item.name}
							</div>
							<div className="item-price">
								{localStorage.getItem("hidePriceWhenZero") === "true" &&
								single_item.price === "0.00" ? null : (
									<React.Fragment>
										{single_item.old_price > 0 && (
											<span className="strike-text mr-1">
												{" "}
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}{" "}
												{single_item.old_price}
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}
											</span>
										)}

										<span>
											{localStorage.getItem("currencySymbolAlign") === "left" &&
												localStorage.getItem("currencyFormat")}{" "}
											{single_item.price}
											{localStorage.getItem("currencySymbolAlign") === "right" &&
												localStorage.getItem("currencyFormat")}
										</span>

										{single_item.old_price > 0 &&
											localStorage.getItem("showPercentageDiscount") === "true" && (
												<React.Fragment>
													<span
														className="price-percentage-discount mb-0 ml-1"
														style={{ color: localStorage.getItem("cartColorBg") }}
													>
														{parseFloat(
															((parseFloat(single_item.old_price) -
																parseFloat(single_item.price)) /
																parseFloat(single_item.old_price)) *
																100
														).toFixed(0)}
														{localStorage.getItem("itemPercentageDiscountText")}
													</span>
												</React.Fragment>
											)}
									</React.Fragment>
								)}
								{single_item.addon_categories.length > 0 && (
									<span
										className="ml-2 customizable-item-text"
										style={{
											color: localStorage.getItem("storeColor"),
										}}
									>
										{localStorage.getItem("customizableItemText")}
									</span>
								)}
							</div>
							<ItemBadge item={single_item} />
							{single_item.desc !== null ? (
								<div className="mt-2 mb-100">
									<div
										dangerouslySetInnerHTML={{
											__html: single_item.desc,
										}}
									/>
								</div>
							) : (
								<br />
							)}
						</div>
					</div>
				)}

				{!this.state.loading && (
					<React.Fragment>
						{this.state.is_active ? (
							<FloatCart />
						) : (
							<div className="auth-error no-click">
								<div className="error-shake">{localStorage.getItem("notAcceptingOrdersMsg")}</div>
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
	single_item: state.items.single_item,
});

export default connect(
	mapStateToProps,
	{
		getRestaurantInfo,
		getRestaurantItems,
		resetItems,
		resetInfo,
		getSingleItem,
		addProduct,
		removeProduct,
	}
)(SingleItem);
