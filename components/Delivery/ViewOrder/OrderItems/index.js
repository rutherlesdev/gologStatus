import React, { Component } from "react";

class OrderInfo extends Component {
	render() {
		const item = this.props.item;
		return (
			<React.Fragment>
				<div className="d-flex justify-content-between">
					<div style={{ maxWidth: "200px", minWidth: "200px" }}>
						<strong>{item.name}</strong>
						{localStorage.getItem("showOrderAddonsDelivery") === "true" && (
							<React.Fragment>
								<div>
									{item &&
										item.order_item_addons.map((addonArray, index) => (
											<React.Fragment key={item.id + addonArray.addon_id}>
												<span style={{ color: "#2b2b2b", fontSize: "0.9rem" }}>
													<small>
														{addonArray.addon_name}
														{localStorage.getItem("showPriceAndOrderCommentsDelivery") ===
															"true" && (
															<React.Fragment>
																{" "}
																-{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" &&
																	localStorage.getItem("currencyFormat")}{" "}
																{item.price}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</React.Fragment>
														)}
													</small>
													<br />
												</span>
											</React.Fragment>
										))}
								</div>
							</React.Fragment>
						)}
					</div>
					<div className="">
						<span className="order-item-quantity">x{item.quantity}</span>
					</div>
					{localStorage.getItem("showPriceAndOrderCommentsDelivery") === "true" && (
						<div className="cart-item-price">
							<React.Fragment>
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}{" "}
								{item.price}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</React.Fragment>
						</div>
					)}
				</div>

				<hr className="my-2" />
			</React.Fragment>
		);
	}
}

export default OrderInfo;
