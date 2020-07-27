import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import Map from "./Map";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../services/user/actions";

class RunningOrder extends Component {
	state = {
		updatedUserInfo: false,
		show_delivery_details: false,
		sendBackToOrdersPage: false,
	};
	static contextTypes = {
		router: () => null,
	};

	__refreshOrderStatus = () => {
		const { user } = this.props;
		if (user.success) {
			this.refs.refreshButton.setAttribute("disabled", "disabled");
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
			this.setState({ updatedUserInfo: true });
			this.refs.btnSpinner.classList.remove("hidden");
			setTimeout(() => {
				if (this.refs.refreshButton) {
					this.refs.btnSpinner.classList.add("hidden");
				}
			}, 2 * 1000);
			setTimeout(() => {
				if (this.refs.refreshButton) {
					if (this.refs.refreshButton.hasAttribute("disabled")) {
						this.refs.refreshButton.removeAttribute("disabled");
					}
				}
			}, 2 * 1000);
		}
	};

	componentDidMount() {
		const { user } = this.props;

		if (user.success) {
			this.props.updateUserInfo(user.data.id, user.data.auth_token, this.props.match.params.unique_order_id);
		}

		this.refreshSetInterval = setInterval(() => {
			this.__refreshOrderStatus();
		}, 15 * 1000);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user.running_order === null) {
			this.context.router.history.push("/my-orders");
		}
		if (nextProps.user.delivery_details !== null) {
			this.setState({ show_delivery_details: true });
		}
	}

	__getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};

	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
	}

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (!user.success) {
			return <Redirect to={"/"} />;
		}

		return (
			<React.Fragment>
				<Meta
					seotitle={localStorage.getItem("seoMetaTitle")}
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
					title={
						user.running_order &&
						"#" + user.running_order.unique_order_id.substr(user.running_order.unique_order_id.length - 8)
					}
					disable_search={true}
					back_to_home={false}
					goto_orders_page={true}
				/>
				{user.running_order && (
					<React.Fragment>
						{localStorage.getItem("showMap") === "true" && (
							<Map
								restaurant_latitude={user.running_order.restaurant.latitude}
								restaurant_longitude={user.running_order.restaurant.longitude}
								order_id={user.running_order.id}
								orderstatus_id={user.running_order.orderstatus_id}
								deliveryLocation={user.running_order.location}
							/>
						)}

						<div
							className="bg-white height-100"
							style={{
								position: "absolute",
								top: localStorage.getItem("showMap") === "true" ? "26.3rem" : "4rem",
								width: "100%",
							}}
						>
							{this.state.show_delivery_details && (
								<div className="block block-link-shadow pb-2 m-0 delivery-assigned-block">
									<div className="block-content block-content-full clearfix py-0">
										<div className="float-right">
											
											

<img
src={"https://image.flaticon.com/icons/png/512/2316/2316075.png"}
className="img-fluid img-avatar"
alt={user.delivery_details.name}
/>
												
											
											
										</div>
										<div className="float-left mt-20" style={{ width: "75%" }}>
											<div className="font-w600 font-size-h5 mb-5">
												{user.delivery_details.name}{" "}
												{localStorage.getItem("deliveryGuyAfterName")}
											</div>
											<div className="font-size-sm text-muted">
												{user.delivery_details.description} <br />
												<span>
													{localStorage.getItem("vehicleText")}{" "}
													{user.delivery_details.vehicle_number}
												</span>
											</div>
											<div className="">

											<a style={{ borderRadius:7}}
													className="btn btn-get-direction mt-2" target="_blank"
													href={"tel:" + user.delivery_details.phone}
												>
													Ligar para o entregador
													
												</a>


												<a style={{backgroundColor:"red",color:"#fff", borderRadius:7}}
													className="btn btn-get-direction mt-2" target="_blank"
													href={"https://api.whatsapp.com/send?phone=55" + user.delivery_details.phone}
												>
													Chat com entregador
													
												</a>

												
											</div>
										</div>
									</div>
								</div>
							)}
							<div className="mt-15 mb-200">
								{user.running_order.orderstatus_id === 1 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 2 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 3 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedSub"
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 4 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												{localStorage.getItem("enableDeliveryPin") === "true" && (
													<React.Fragment>
														<div className="font-size-h4 mb-5 px-15 text-center">
															<div className="font-w600 btn-deliverypin">
																<span className="text-muted">
																	{localStorage.getItem("runningOrderDeliveryPin")}{" "}
																</span>
																{this.props.user.data.delivery_pin}
															</div>
														</div>
														<hr />
													</React.Fragment>
												)}

												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderOnwayTitle")}
																style={{
																	transform: "scaleX(-1)",
																}}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderOnwayTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderOnwaySub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-onway.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedTitle"
																)}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem(
																	"runningOrderDeliveryAssignedSub"
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
								{user.running_order.orderstatus_id === 6 && (
									<div className="row">
										<div className="col-md-12">
											<div className="block block-link-shadow">
												<div className="block-content block-content-full clearfix py-0">
													<div className="float-right">
														<img
															src="/assets/img/order-canceled.png"
															className="img-fluid img-avatar"
															alt={localStorage.getItem("runningOrderCanceledTitle")}
															style={{ transform: "scaleX(-1)" }}
														/>
													</div>
													<div className="float-left mt-20" style={{ width: "75%" }}>
														<div className="font-w600 font-size-h4 mb-5">
															{localStorage.getItem("runningOrderCanceledTitle")}
														</div>
														<div className="font-size-sm text-muted">
															{localStorage.getItem("runningOrderCanceledSub")}
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</div>
								)}
								{user.running_order.orderstatus_id === 7 && (
									<React.Fragment>
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/ready-for-selfpickup.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderReadyForPickup")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderReadyForPickup")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderReadyForPickupSub")}
															</div>
														</div>

														<button
															className="btn btn-get-direction mt-2"
															onClick={() =>
																this.__getDirectionToRestaurant(
																	user.running_order.restaurant.latitude,
																	user.running_order.restaurant.longitude
																)
															}
														>
															<i className="si si-action-redo mr-5" />
															{localStorage.getItem("deliveryGetDirectionButton")}
														</button>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-preparing.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPreparingTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPreparingTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPreparingSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
										<div className="row">
											<div className="col-md-12">
												<div className="block block-link-shadow">
													<div className="block-content block-content-full clearfix py-0">
														<div className="float-right">
															<img
																src="/assets/img/order-placed.gif"
																className="img-fluid img-avatar"
																alt={localStorage.getItem("runningOrderPlacedTitle")}
															/>
														</div>
														<div className="float-left mt-20" style={{ width: "75%" }}>
															<div className="font-w600 font-size-h4 mb-5">
																{localStorage.getItem("runningOrderPlacedTitle")}
															</div>
															<div className="font-size-sm text-muted">
																{localStorage.getItem("runningOrderPlacedSub")}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<hr className="m-0" />
									</React.Fragment>
								)}
							</div>
						</div>
						<div>
							<button
								className="btn btn-lg btn-refresh-status"
								ref="refreshButton"
								onClick={this.__refreshOrderStatus}
								style={{
									backgroundColor: localStorage.getItem("cartColorBg"),
									color: localStorage.getItem("cartColorText"),
								}}
							>
								{localStorage.getItem("runningOrderRefreshButton")}{" "}
								<span ref="btnSpinner" className="hidden">
									<i className="fa fa-refresh fa-spin" />
								</span>
							</button>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
});

export default connect(
	mapStateToProps,
	{ updateUserInfo }
)(RunningOrder);
