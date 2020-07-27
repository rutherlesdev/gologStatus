import React, { Component } from "react";
import Ink from "react-ink";
import Moment from "react-moment";
import DelayLink from "../../helpers/delayLink";

class NewOrders extends Component {
	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-grey");
	}
	render() {
		const { new_orders } = this.props;

		console.log(new_orders)
		
		if (1==1) {
			return (
				<React.Fragment>
					<div className="delivery mb-100" style={{ paddingTop: "4rem" }}>
						<h3 className="text-center p-3 bg-dark text-light mb-0">
							{localStorage.getItem("deliveryNewOrdersTitle")}
						</h3>
						{new_orders.length === 0 ? (
							<p className="text-center text-muted py-15 mb-10 bg-white">
								{localStorage.getItem("deliveryNoNewOrders")}
							</p>
						) : (
							<div className="px-15 mt-20">
								{new_orders.map((order) => (
									<DelayLink
										to={`/delivery/orders/${order.unique_order_id}`}
										className="block delivery"
										style={{ position: "relative" }}
										key={order.id}
										delay={300}
									>
										<div className="block-header block-header-default new-order">
											<h3 className="block-title">
												#{order.unique_order_id.substr(order.unique_order_id.length - 8)}
											</h3>
											<div className="block-options">
												<button type="button" className="btn btn-sm btn-outline-light">
													{localStorage.getItem("showFromNowDate") === "true" ? (
														<Moment fromNow>{order.updated_at}</Moment>
													) : (
														<Moment format="DD/MM/YYYY hh:mm">{order.updated_at}</Moment>
													)}
												</button>
											</div>
										</div>
										<div className="block-content">
											<div className="mb-2">
												<b>{order.name}</b>
												{localStorage.getItem("showDeliveryFullAddressOnList") === "true" ? (
													<p>{order.address}</p>
												) : (
													<span className="pull-right d-flex align-items-center">
														<i className="si si-pointer mr-2" />
														<span
															style={{ maxWidth: "100px", display: "block" }}
															className="truncate-text"
														>
															{order.address}
														</span>
													</span>
												)}
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</DelayLink>
								))}
							</div>
						)}
					</div>
				</React.Fragment>
			);
		} else {

			return (
				<React.Fragment>
					<div className="delivery mb-100" style={{ paddingTop: "4rem" }}>
						<h3 className="text-center p-3 bg-dark text-light mb-0">
							{localStorage.getItem("deliveryNewOrdersTitle")}
						</h3>
						{new_orders.length === 0 ? (
							<p className="text-center text-muted py-15 mb-10 bg-white">
								{localStorage.getItem("deliveryNoNewOrders")}
							</p>
						) : (
							<div className="px-15 mt-20">
								{new_orders.map((order) => (
									<DelayLink
										to={`/delivery/orders/${order.unique_order_id}`}
										className="block delivery"
										style={{ position: "relative" }}
										key={order.id}
										delay={300}
									>
										<div className="block-header block-header-default new-order">
											<h3 className="block-title">
												#{order.unique_order_id.substr(order.unique_order_id.length - 8)}
											</h3>
											<div className="block-options">
												<button type="button" className="btn btn-sm btn-outline-light">
													{localStorage.getItem("showFromNowDate") === "true" ? (
														<Moment fromNow>{order.updated_at}</Moment>
													) : (
														<Moment format="DD/MM/YYYY hh:mma">{order.updated_at}</Moment>
													)}
												</button>
											</div>
										</div>
										<div className="block-content">
											<div className="mb-2">
												<b>{order.restaurant.name}</b>
												{localStorage.getItem("showDeliveryFullAddressOnList") === "true" ? (
													<p>{order.address}</p>
												) : (
													<span className="pull-right d-flex align-items-center">
														<i className="si si-pointer mr-2" />
														<span
															style={{ maxWidth: "100px", display: "block" }}
															className="truncate-text"
														>
															{order.address}
														</span>
													</span>
												)}
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</DelayLink>
								))}
							</div>
						)}
					</div>
				</React.Fragment>
			);
			
		}
	}
}

export default NewOrders;
