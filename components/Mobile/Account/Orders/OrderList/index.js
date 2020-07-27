import React, { Component } from "react";

import DelayLink from "../../../../helpers/delayLink";
import Ink from "react-ink";
import Moment from "react-moment";

import { formatPrice } from "../../../../helpers/formatPrice";
import OrderCancelPopup from "./OrderCancelPopup";

class OrderList extends Component {
	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-grey");
	}
	__getOrderStatus = id => {
		if (id === 1) {
			return localStorage.getItem("orderPlacedStatusText");
		}
		if (id === 2) {
			return localStorage.getItem("preparingOrderStatusText");
		}
		if (id === 3) {
			return localStorage.getItem("deliveryGuyAssignedStatusText");
		}
		if (id === 4) {
			return localStorage.getItem("orderPickedUpStatusText");
		}
		if (id === 5) {
			return localStorage.getItem("deliveredStatusText");
		}
		if (id === 6) {
			return localStorage.getItem("canceledStatusText");
		}
		if (id === 7) {
			return localStorage.getItem("readyForPickupStatusText");
		}
	};
	_getTotalItemCost = item => {
		let itemCost = parseFloat(item.price) * item.quantity;
		if (item.order_item_addons.length) {
			item.order_item_addons.map(addon => {
				itemCost += parseFloat(addon.addon_price) * item.quantity;
				return itemCost;
			});
		}
		return formatPrice(itemCost);
	};

	componentWillUnmount() {
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}
	render() {
		const { order, user, cancelOrder } = this.props;
		return (
			<React.Fragment>
				<div className="mb-20 bg-white p-3" style={{ borderRadius: "0.275rem" }}>
					<div className="pull-right">
						{(order.orderstatus_id === 1 ||
							order.orderstatus_id === 2 ||
							order.orderstatus_id === 3 ||
							order.orderstatus_id === 4 ||
							order.orderstatus_id === 7) && (
							<DelayLink
								to={`/running-order/${order.unique_order_id}`}
								className="btn btn-square btn-outline-secondary mb-10 order-track-button"
								delay={250}
								style={{ position: "relative" }}
							>
								{localStorage.getItem("trackOrderText")}
								<span className="pulse ml-2"></span>
								<Ink duration="500" />
							</DelayLink>
						)}
					</div>
					<div className="display-flex">
						<div className="flex-auto">
							<button
								className={`mr-5 btn btn-square btn-outline-secondary min-width-125 mb-10 order-status-button text-muted ${order.orderstatus_id ===
									6 && "text-danger"} `}
							>
								{this.__getOrderStatus(order.orderstatus_id)}
							</button>
						</div>
					</div>
					<span className="text-muted pull-right" style={{ fontSize: "0.9rem" }}>
						{localStorage.getItem("showFromNowDate") === "true" ? (
							<Moment fromNow>{order.created_at}</Moment>
						) : (
							<Moment format="DD/MM/YYYY hh:mma">{order.created_at}</Moment>
						)}
					</span>
					<div className="flex-auto">
						<h6 className="font-w700" style={{ color: localStorage.getItem("storeColor") }}>
							{order.unique_order_id}
						</h6>
					</div>
					<hr />
					{order.orderitems.map(item => (
						<div className="display-flex pb-5" key={item.id}>
							<span className="order-item-quantity mr-10">x{item.quantity}</span>
							<div className="flex-auto text-left">{item.name}</div>
							<div className="flex-auto text-right">
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{this._getTotalItemCost(item)}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</div>
						</div>
					))}
					<React.Fragment>
						{order.coupon_name && (
							<div className="display-flex mt-10 font-w700">
								<React.Fragment>
									<div className="flex-auto">Coupon: </div>
									<div className="flex-auto text-right">{order.coupon_name}</div>
								</React.Fragment>
							</div>
						)}

						{order.tax && (
							<div className="display-flex mt-10 font-w700">
								<React.Fragment>
									<div className="flex-auto">{localStorage.getItem("taxText")}: </div>
									<div className="flex-auto text-right text-danger">
										<span>+</span>
										{order.tax}%
									</div>
								</React.Fragment>
							</div>
						)}
						<div className="display-flex mt-10 font-w700">
							<div className="flex-auto">{localStorage.getItem("orderTextTotal")}</div>
							<div className="flex-auto text-right">
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{order.total}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</div>
						</div>
					</React.Fragment>
					{order.orderstatus_id === 1 && (
						<React.Fragment>
							<div className="pull-right">
								<OrderCancelPopup
									order={order}
									user={user}
									cancelOrder={cancelOrder}
								></OrderCancelPopup>
							</div>
							<div className="clearfix"></div>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default OrderList;
