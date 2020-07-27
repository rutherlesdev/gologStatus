import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../../services/cart/actions";

import Customization from "../../Customization";
import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

class RecommendedItems extends Component {
	static contextTypes = {
		router: () => null,
	};

	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			this.props.update();
		}, 100);
	};

	render() {
		const { addProduct, removeProduct, product, cartProducts, restaurant } = this.props;
		product.quantity = 1;
		return (
			<React.Fragment>
				{localStorage.getItem("recommendedLayoutV2") === "true" ? (
					<div key={product.id} className="product-slider-item">
						<div className="block border-radius-275 recommended-item-shadow">
							<div
								className="block-content recommended-item-content py-5 mb-5"
								style={{ position: "relative", height: "16.5rem" }}
							>
								<LazyLoad>
									<Link to={restaurant.slug + "/" + product.id}>
										<img
											src={product.image}
											alt={product.name}
											className="recommended-item-image"
										/>
									</Link>

									<React.Fragment>
										{cartProducts.find((cp) => cp.id === product.id) !== undefined && (
											<Fade duration={150}>
												<div
													className="quantity-badge-recommended"
													style={{
														backgroundColor: localStorage.getItem("storeColor"),
													}}
												>
													<span>
														{product.addon_categories.length ? (
															<React.Fragment>
																<i
																	className="si si-check"
																	style={{ lineHeight: "1.3rem" }}
																/>
															</React.Fragment>
														) : (
															<React.Fragment>
																{
																	cartProducts.find((cp) => cp.id === product.id)
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
								<div className="my-2 recommended-item-meta">
									<div className="px-5 text-left recommended-v2-ellipsis-meta">
										{localStorage.getItem("showVegNonVegBadge") === "true" &&
											product.is_veg !== null && (
												<React.Fragment>
													{product.is_veg ? (
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
										<span className="meta-name">{product.name}</span>
										<br />
										<span className="meta-price">
											{localStorage.getItem("hidePriceWhenZero") === "true" &&
											product.price === "0.00" ? null : (
												<React.Fragment>
													{product.old_price > 0 && (
														<span className="strike-text mr-1">
															{" "}
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}{" "}
															{product.old_price}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>
													)}

													<span>
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}{" "}
														{product.price}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</span>

													{product.old_price > 0 &&
														localStorage.getItem("showPercentageDiscount") === "true" && (
															<React.Fragment>
																<span
																	className="price-percentage-discount mb-0 ml-1"
																	style={{
																		color: localStorage.getItem("cartColorBg"),
																	}}
																>
																	{parseFloat(
																		((parseFloat(product.old_price) -
																			parseFloat(product.price)) /
																			parseFloat(product.old_price)) *
																			100
																	).toFixed(0)}
																	{localStorage.getItem("itemPercentageDiscountText")}
																</span>
															</React.Fragment>
														)}
												</React.Fragment>
											)}
										</span>
										{product.addon_categories.length > 0 && (
											<span
												className="ml-2 customizable-item-text"
												style={{ color: localStorage.getItem("storeColor") }}
											>
												{localStorage.getItem("customizableItemText")}
											</span>
										)}
									</div>
									<div
										className="d-flex btn-group btn-group-sm my-5 btn-full justify-content-around"
										role="group"
										aria-label="btnGroupIcons1"
										style={{ height: "40px" }}
									>
										{product.is_active ? (
											<React.Fragment>
												{product.addon_categories.length ? (
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
															removeProduct(product);
															this.forceStateUpdate();
														}}
													>
														<span className="btn-dec">-</span>
														<Ink duration="500" />
													</button>
												)}
												{product.addon_categories.length ? (
													<Customization
														product={product}
														addProduct={addProduct}
														update={this.props.forceStateUpdate}
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
															addProduct(product);
															this.forceStateUpdate();
														}}
													>
														<span className="btn-inc">+</span>
														<Ink duration="500" />
													</button>
												)}
											</React.Fragment>
										) : (
											<div className="text-danger text-item-not-available d-flex align-items-center">
												{localStorage.getItem("cartItemNotAvailable")}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div key={product.id} className="col-6 p-0 d-flex justify-content-center px-5">
						<div className="block border-radius-275 recommended-item-shadow">
							<div className="block-content recommended-item-content py-5 mb-5">
								<LazyLoad>
									<Link to={restaurant.slug + "/" + product.id}>
										<img
											src={product.image}
											alt={product.name}
											className="recommended-item-image"
										/>
									</Link>

									<React.Fragment>
										{cartProducts.find((cp) => cp.id === product.id) !== undefined && (
											<Fade duration={150}>
												<div
													className="quantity-badge-recommended"
													style={{
														backgroundColor: localStorage.getItem("storeColor"),
													}}
												>
													<span>
														{product.addon_categories.length ? (
															<React.Fragment>
																<i
																	className="si si-check"
																	style={{ lineHeight: "1.3rem" }}
																/>
															</React.Fragment>
														) : (
															<React.Fragment>
																{
																	cartProducts.find((cp) => cp.id === product.id)
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
								<div className="my-2 recommended-item-meta">
									<div className="px-5 text-left">
										{localStorage.getItem("showVegNonVegBadge") === "true" &&
											product.is_veg !== null && (
												<React.Fragment>
													{product.is_veg ? (
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
										<span className="meta-name">{product.name}</span>
										<br />
										<span className="meta-price">
											{localStorage.getItem("hidePriceWhenZero") === "true" &&
											product.price === "0.00" ? null : (
												<React.Fragment>
													{product.old_price > 0 && (
														<span className="strike-text mr-1">
															{" "}
															{localStorage.getItem("currencySymbolAlign") === "left" &&
																localStorage.getItem("currencyFormat")}{" "}
															{product.old_price}
															{localStorage.getItem("currencySymbolAlign") === "right" &&
																localStorage.getItem("currencyFormat")}
														</span>
													)}

													<span>
														{localStorage.getItem("currencySymbolAlign") === "left" &&
															localStorage.getItem("currencyFormat")}{" "}
														{product.price}
														{localStorage.getItem("currencySymbolAlign") === "right" &&
															localStorage.getItem("currencyFormat")}
													</span>

													{product.old_price > 0 &&
														localStorage.getItem("showPercentageDiscount") === "true" && (
															<React.Fragment>
																<span
																	className="price-percentage-discount mb-0 ml-1"
																	style={{
																		color: localStorage.getItem("cartColorBg"),
																	}}
																>
																	{parseFloat(
																		((parseFloat(product.old_price) -
																			parseFloat(product.price)) /
																			parseFloat(product.old_price)) *
																			100
																	).toFixed(0)}
																	{localStorage.getItem("itemPercentageDiscountText")}
																</span>
															</React.Fragment>
														)}
												</React.Fragment>
											)}
										</span>
										{product.addon_categories.length > 0 && (
											<span
												className="ml-2 customizable-item-text"
												style={{ color: localStorage.getItem("storeColor") }}
											>
												{localStorage.getItem("customizableItemText")}
											</span>
										)}
									</div>
									<div
										className="d-flex btn-group btn-group-sm my-5 btn-full justify-content-around"
										role="group"
										aria-label="btnGroupIcons1"
									>
										{product.addon_categories.length ? (
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
													removeProduct(product);
													this.forceStateUpdate();
												}}
											>
												<span className="btn-dec">-</span>
												<Ink duration="500" />
											</button>
										)}
										{product.addon_categories.length ? (
											<Customization
												product={product}
												addProduct={addProduct}
												update={this.props.forceStateUpdate}
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
													addProduct(product);
													this.forceStateUpdate();
												}}
											>
												<span className="btn-inc">+</span>
												<Ink duration="500" />
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct }
)(RecommendedItems);
