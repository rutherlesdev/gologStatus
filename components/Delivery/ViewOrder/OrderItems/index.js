import React, { Component } from "react";

class OrderInfo extends Component {
	render() {
		const item = this.props.item;
		return (
			<React.Fragment>
				<div className="display-flex pb-5">
					<span className="order-item-quantity mr-10">x{item.quantity}</span>
					<div className="flex-auto text-left">{item.name}</div>
				</div>
				{localStorage.getItem("showOrderAddonsDelivery") === "true" && (
					<React.Fragment>
						{item &&
							item.order_item_addons.map((addonArray, index) => (
								<React.Fragment key={item.id + addonArray.addon_id}>
									<span style={{ color: "#2b2b2b", fontSize: "0.9rem" }}>
										{(index ? ", " : "") + addonArray.addon_name}
									</span>
								</React.Fragment>
							))}
					</React.Fragment>
				)}
				<hr className="my-2" />
			</React.Fragment>
		);
	}
}

export default OrderInfo;
