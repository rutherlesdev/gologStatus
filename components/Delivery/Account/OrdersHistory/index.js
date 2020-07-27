import React, { Component } from "react";
import Moment from "react-moment";

class OrdersHistory extends Component {
	render() {
		const { order } = this.props;
		return (
			<React.Fragment>
				<div className="slider-wrapper transaction-wrapper">
					<div className="d-flex">
						<div className="mr-4 font-w700 min-width-75">
							#{order.order.unique_order_id.substr(order.order.unique_order_id.length - 6)}
						</div>

						<div className="mr-4">
							{order.is_complete ? (
								<span className="btn btn-square btn-sm btn-outline-success min-width-125">
									{localStorage.getItem("deliveryCompletedText")}
								</span>
							) : (
								<span className="btn btn-square btn-sm  btn-outline-danger  min-width-125">
									{localStorage.getItem("deliveryOnGoingText")}
								</span>
							)}
						</div>

						{order.order.payment_mode === "COD" ? (
							<span className="btn btn-square btn-sm btn-outline-success min-width-175 mr-4">
								{localStorage.getItem("deliveryCashOnDelivery")}:{" "}
								{localStorage.getItem("currencySymbolAlign") === "left" &&
									localStorage.getItem("currencyFormat")}
								{order.order.payable}
								{localStorage.getItem("currencySymbolAlign") === "right" &&
									localStorage.getItem("currencyFormat")}
							</span>
						) : (
							<span className="btn btn-square btn-sm btn-outline-success min-width-175 mr-4">
								<i className="si si-check mr-5" /> {localStorage.getItem("deliveryOnlinePayment")}
							</span>
						)}
						<div className="mr-4">{order.order.address}</div>
						<div className="mr-4">
							{localStorage.getItem("showFromNowDate") === "true" ? (
								<Moment fromNow>{order.updated_at}</Moment>
							) : (
								<Moment format="DD/MM/YYYY hh:mma">{order.updated_at}</Moment>
							)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default OrdersHistory;
