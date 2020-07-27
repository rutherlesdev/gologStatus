import React, { Component } from "react";
import CountTo from "react-count-to";
import { updateDeliveryUserInfo, updateDeliveryOrderHistory } from "../../../services/Delivery/user/actions";
import { connect } from "react-redux";
import OrdersHistory from "./OrdersHistory";
import Ink from "react-ink";
import TransactionList from "../../Mobile/Account/Wallet/TransactionList";

class Account extends Component {
	state = {
		show_orderhistory: true,
		show_earnings: false,
	};
	componentDidMount() {
		const { delivery_user } = this.props;
		//update delivery guy info
		this.props.updateDeliveryUserInfo(delivery_user.data.id, delivery_user.data.auth_token);
		document.getElementsByTagName("body")[0].classList.remove("bg-grey");
	}

	filterOnGoingOrders = () => {
		this.props.updateDeliveryOrderHistory(
			this.props.delivery_user.data.orders.filter((order) => order.is_complete === 0)
		);
		this.setState({ show_orderhistory: true, show_earnings: false });
	};

	filterCompletedOrders = () => {
		this.props.updateDeliveryOrderHistory(
			this.props.delivery_user.data.orders.filter((order) => order.is_complete === 1)
		);
		this.setState({ show_orderhistory: true, show_earnings: false });
	};

	showEarningsTable = () => {
		this.setState({ show_orderhistory: false, show_earnings: true });
	};

	render() {
		const { delivery_user, logoutDeliveryUser, order_history } = this.props;
		return (
			<React.Fragment>
				<div className="delivery-order-refresh">
					
				</div>
				<div className="mb-100" style={{ paddingTop: "4rem" }}>
					<h3 className="text-center p-3 bg-dark text-light mb-0" style={{ fontSize: "1.2rem" }}>
						{localStorage.getItem("deliveryWelcomeMessage")} {delivery_user.data.name}
						<button style={{marginLeft:40}} className="btn btn-get-direction mr-15" onClick={() => logoutDeliveryUser(delivery_user)}>
						{localStorage.getItem("deliveryLogoutDelivery")} <i className="si si-logout" />
					</button>
					</h3>
					<div className="row gutters-tiny px-15 mt-20">
						{localStorage.getItem("enableDeliveryGuyEarning") === "true" && (
							<React.Fragment>
								<div className="col-6" onClick={() => this.showEarningsTable()}>
									<div
										className="block shadow-light delivery-block-earning"
										style={{ position: "relative" }}
									>
										<div className="block-content block-content-full clearfix text-white">
											<div className="font-size-h3 font-w600">
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												<CountTo
													to={delivery_user.data.wallet_balance}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}
													digits={2}
												/>
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}

												<div className="font-size-sm font-w600 text-uppercase">
													{localStorage.getItem("deliveryEarningsText")}
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>
								<div className="col-6" onClick={() => this.showEarningsTable()}>
									<div
										className="block shadow-light delivery-block-earning"
										style={{ position: "relative" }}
									>
										<div className="block-content block-content-full clearfix text-white">
											<div className="font-size-h3 font-w600">
												{localStorage.getItem("currencySymbolAlign") === "left" &&
													localStorage.getItem("currencyFormat")}
												<CountTo
													to={delivery_user.data.totalEarnings}
													speed={1000}
													className="font-size-h3 font-w600"
													easing={(t) => {
														return t < 0.5
															? 16 * t * t * t * t * t
															: 1 + 16 * --t * t * t * t * t;
													}}
													digits={2}
												/>
												{localStorage.getItem("currencySymbolAlign") === "right" &&
													localStorage.getItem("currencyFormat")}

												<div className="font-size-sm font-w600 text-uppercase">
													{localStorage.getItem("deliveryTotalEarningsText")}
												</div>
											</div>
										</div>
										<Ink duration="500" hasTouch="true" />
									</div>
								</div>
							</React.Fragment>
						)}
						<div className="col-6 col-xl-3" onClick={() => this.filterOnGoingOrders()}>
							<div
								className="block shadow-medium delivery-block-ongoing"
								style={{ position: "relative" }}
							>
								<div className="block-content block-content-full clearfix text-white">
									<div className="float-right mt-10">
										<i className="si si-control-forward fa-3x" />
									</div>
									<CountTo
										to={delivery_user.data.onGoingCount}
										speed={1000}
										className="font-size-h3 font-w600"
										easing={(t) => {
											return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
										}}
									/>
									<div className="font-size-sm font-w600 text-uppercase">
										{localStorage.getItem("deliveryOnGoingText")}
									</div>
								</div>
								<Ink duration="500" hasTouch="true" />
							</div>
						</div>
						<div className="col-6 col-xl-3" onClick={() => this.filterCompletedOrders()}>
							<div
								className="block shadow-medium delivery-block-completed"
								style={{ position: "relative" }}
							>
								<div className="block-content block-content-full clearfix text-white">
									<div className="float-right mt-10">
										<i className="si si-check fa-3x" />
									</div>
									<CountTo
										to={delivery_user.data.completedCount}
										speed={1000}
										className="font-size-h3 font-w600"
										easing={(t) => {
											return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
										}}
									/>
									<div className="font-size-sm font-w600 text-uppercase">
										{localStorage.getItem("deliveryCompletedText")}
									</div>
								</div>
								<Ink duration="500" hasTouch="true" />
							</div>
						</div>
					</div>
					{this.state.show_orderhistory && (
						<div className="orders-history px-15 mt-20">
							{order_history && order_history.length > 0
								? order_history.map((order) => <OrdersHistory order={order} key={order.id} />)
								: null}
						</div>
					)}
					{this.state.show_earnings && (
						<div className="delivery-earnings">
							{delivery_user.data.earnings &&
								delivery_user.data.earnings.map((earning) => (
									<TransactionList key={earning.id} transaction={earning} />
								))}
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	order_history: state.delivery_user.order_history,
});

export default connect(
	mapStateToProps,
	{ updateDeliveryUserInfo, updateDeliveryOrderHistory }
)(Account);
