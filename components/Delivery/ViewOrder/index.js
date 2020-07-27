import React, { Component } from "react";
import { acceptToDeliverOrder, deliverOrder, pickupOrder } from "../../../services/Delivery/deliveryprogress/actions";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import ContentLoader from "react-content-loader";

import Meta from "../../helpers/meta";
import Moment from "react-moment";
import OrderItems from "./OrderItems";
import { Redirect } from "react-router";
import RestaurantInfo from "./RestaurantInfo";
import { connect } from "react-redux";
import { getSingleDeliveryOrder } from "../../../services/Delivery/singleorder/actions";
import ShareLiveLocation from "../ShareLiveLocation";

class ViewOrder extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		loading: false,
		already_accepted: false,
		accepted_order: false,
		picked_up: false,
		delivered: false,
		delivery_pin: "",
		delivery_pin_error: false,
	};

	componentDidMount() {
		document.getElementsByTagName("body")[0].classList.add("bg-grey");

		if (this.props.delivery_user.success) {
			this.props.getSingleDeliveryOrder(
				this.props.delivery_user.data.auth_token,
				this.props.match.params.unique_order_id
			);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.single_delivery_order.orderstatus_id === 2) {
			if (nextProps.single_delivery_order.max_order) {
				this.setState({ max_order: true });
			}
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 3) {
			if (nextProps.single_delivery_order.already_accepted) {
				this.setState({ already_accepted: true });
			}
			this.setState({ accepted_order: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 4) {
			this.setState({ accepted_order: true, picked_up: true });
			this.setState({ loading: false });
		}

		if (nextProps.single_delivery_order.delivery_pin_error) {
			this.setState({ delivery_pin_error: true });
		}

		if (nextProps.single_delivery_order.orderstatus_id === 5) {
			this.setState({ loading: false });
			this.context.router.history.push("/delivery");
		}
	}

	__acceptToDeliver = () => {
		this.props.acceptToDeliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.delivery_user.data.id,
			this.props.single_delivery_order.id
		);
		this.setState({ loading: true });
	};

	__pickedUp = () => {
		this.props.pickupOrder(this.props.delivery_user.data.auth_token, this.props.single_delivery_order.id);
		this.setState({ loading: true });
	};

	__delivered = () => {
		this.props.deliverOrder(
			this.props.delivery_user.data.auth_token,
			this.props.single_delivery_order.id,
			this.state.delivery_pin
		);
		this.setState({ loading: true });
	};

	__getDirectionToRestaurant = (restaurant_latitude, restaurant_longitude) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		const directionUrl = "http://maps.google.com/maps?q=" + restaurant_latitude + "," + restaurant_longitude;
		window.open(directionUrl, "_blank");
	};
	__getDirectionToUser = (user_order_loaction) => {
		// http://maps.google.com/maps?q=24.197611,120.780512
		try {
			JSON.parse(user_order_loaction);
			const directionUrl =
				"http://maps.google.com/maps?q=" +
				JSON.parse(user_order_loaction).lat +
				"," +
				JSON.parse(user_order_loaction).lng;
			window.open(directionUrl, "_blank");
		} catch {
			JSON.parse(user_order_loaction);
			const directionUrl = "http://maps.google.com/maps?q=" + user_order_loaction;
			window.open(directionUrl, "_blank");
		}
	};

	__handleDeliveryPinInput = (e) => {
		this.setState({ delivery_pin: e.target.value });
	};

	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const order = this.props.single_delivery_order;

		
	 if (order.total < 15 ) {

		
		{/* inicio do return golog*/}

		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
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
						order.unique_order_id && "#" + order.unique_order_id.substr(order.unique_order_id.length - 8)
					}
					disable_search={true}
				/>

				{!order.id ? (
					<div className="pt-50">
						<ContentLoader
							height={150}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					</div>
				) : (
						<React.Fragment>
							{this.state.loading && (
								<div className="height-100 overlay-loading ongoing-payment-spin">
									<div className="spin-load" />
								</div>
							)}
							{!this.state.delivered && (
								<React.Fragment>
									{this.state.max_order && (
										<div className="auth-error">
											<div className="error-shake">
												{localStorage.getItem("deliveryMaxOrderReachedMsg")}
											</div>
										</div>
									)}
									{this.state.already_accepted ? (
										<div className="auth-error">
											<div className="error-shake">
												{localStorage.getItem("deliveryAlreadyAccepted")}
											</div>
										</div>
									) : (
											<React.Fragment>
												{this.state.delivery_pin_error && (
													<div className="auth-error" style={{ zIndex: "9", marginBottom: "4rem" }}>
														<div className="error-shake">
															{localStorage.getItem("deliveryInvalidDeliveryPin")}
														</div>
													</div>
												)}

												<button className="btn btn-clock text-center">
													<i className="si si-clock mr-5" />{" "}
													{localStorage.getItem("deliveryOrderPlacedText")}:{" "}
													<Moment fromNow interval={5000}>
														{order.updated_at}
													</Moment>
												</button>




												{/* Inicio do goLog */}




												<div className="view-delivery-order" style={{ paddingBottom: "20rem" }}>
													<RestaurantInfo order={order} />
													<div className="clearfix" />
													<hr />
													<div className="pt-15 px-15">
														<h3>
															<span className="delivery-orderItems-basket">

																{/*Detalhes da Entrega*/}

															</span>
													Detalhes da entrega
												</h3>
														{order.order_comment}
														{/*{order.orderitems.map((item) => (
													<OrderItems item={item} key={item.id} />
												))}*/}

													</div>
													<hr />
													{!this.state.picked_up && (
														<React.Fragment>


															{localStorage.getItem("showUserInfoBeforePickup") === "true" && (
																<div className="pt-15 px-15">
																	<div className="customer-address">
																		<h4 className="text-muted">
																			Endereço de Coleta
																		</h4>
																		<p style={{ color: 'green' }} className="font-weight-bold mb-0">
																			<i style={{ color: '#000' }}>	Pegar em: </i>{order.user.name}
																		</p>
																		<p className="mb-0">{order.user.phone}</p>
																		<p className="mb-2">{order.address}</p>
																		<div className="pull-right">
																			<button style={{ backgroundColor: 'red', color: '#fff', borderRadius: 7 }}
																				className="btn btn-get-direction"
																				onClick={() =>
																					this.__getDirectionToUser(order.location)
																				}
																			>
																				Veja no Mapa
																			</button>
																		</div>
																		<div className="pull-right mr-2">
																			<a style={{ backgroundColor: 'green', color: '#fff', borderRadius: 7 }}
																				className="btn btn-get-direction"
																				href={"https://api.whatsapp.com/send?phone=" + order.user.phone}
																			>
																				Chat Empresa
																	</a>
																		</div>
																		<div className="clearfix" />
																	</div>
																</div>
															)}





															<div className="pt-15 px-15">
																<div className="address restaurant-address">
																	<h4 className="text-muted">
																		Bairro da entrega
																	</h4>

																	{order.orderitems.map((item) => (
																		<OrderItems item={item} key={item.id} />
																	))}
																	<div>

																	</div>
																	<div className="clearfix" />
																</div>
															</div>

														</React.Fragment>
													)}

													{this.state.picked_up && (
														<React.Fragment>
															<div className="pt-15 px-15">
																<div className="customer-address">
																	<h4 className="text-muted">
																		Endereço da Coleta
																	</h4>
																	<p className="font-weight-bold mb-0">{order.user.name}</p>
																	<p className="mb-0">{order.user.phone}</p>
																	<p className="mb-2">{order.address}</p>
																	<div className="pull-right">
																		<button style={{ backgroundColor: 'red', color: '#fff' }}
																			className="btn btn-get-direction"
																			onClick={() =>
																				this.__getDirectionToUser(order.location)
																			}
																		>
																			Veja no Mapa
																		</button>
																	</div>
																	<div className="pull-right mr-2">
																		<a style={{ backgroundColor: 'green', color: '#fff' }}
																			className="btn btn-get-direction"
																			href={"https://api.whatsapp.com/send?phone=" + order.user.phone}
																		>
																			Chat Empresa
																		</a>
																	</div>

																	<div className="clearfix" />
																</div>
															</div>
															<div className="pt-15 px-15">

															</div>
															{localStorage.getItem("enableDeliveryPin") === "true" && (
																<div className="pt-10 px-15 delivery-pin-block">
																	<div className="form-group">
																		<div className="row">
																			<div className="col-12">
																				<input
																					type="text"
																					className="form-control"
																					placeholder={localStorage.getItem(
																						"deliveryDeliveryPinPlaceholder"
																					)}
																					onChange={this.__handleDeliveryPinInput}
																				/>
																			</div>
																		</div>
																	</div>
																</div>
															)}
														</React.Fragment>
													)}
													<div className="delivery-action">
														{!this.state.accepted_order &&
															!this.state.picked_up &&
															!this.state.delivered && (
																<button
																	onClick={this.__acceptToDeliver}
																	type="button"
																	className="btn btn-accept"
																	style={{
																		backgroundColor: localStorage.getItem("storeColor"),
																	}}
																>
																	<i className="si si-check mr-5" />
																	{localStorage.getItem("deliveryAcceptOrderButton")}
																</button>
															)}
														{this.state.accepted_order &&
															!this.state.picked_up &&
															!this.state.delivered && (
																<button
																	onClick={this.__pickedUp}
																	type="button"
																	className="btn btn-accept"
																	style={{
																		backgroundColor: 'yellow',
																	}}
																>
																	<i className="si si-bag mr-5" />
																	{localStorage.getItem("deliveryPickedUpButton")}
																</button>
															)}
														{this.state.accepted_order &&
															this.state.picked_up &&
															!this.state.delivered && (
																<button
																	onClick={this.__delivered}
																	type="button"
																	className="btn btn-accept"
																	style={{
																		backgroundColor: 'red',
																	}}
																>
																	<i className="si si-check mr-5" />
																	{localStorage.getItem("deliveryDeliveredButton")}
																</button>
															)}
														{this.state.accepted_order &&
															this.state.picked_up &&
															this.state.delivered && (
																<button
																	type="button"
																	className="btn btn-accept"
																	style={{
																		backgroundColor: localStorage.getItem("storeColor"),
																	}}
																>
																	<i className="si si-check mr-5" />
																	{localStorage.getItem("deliveryOrderCompletedButton")}
																</button>
															)}
													</div>
												</div>
											</React.Fragment>
										)}
								</React.Fragment>
							)}
						</React.Fragment>
					)}
				<ShareLiveLocation />
			</React.Fragment>
		);

		{/* fim do golog */ }
		 
	 } else {

		return (
			<React.Fragment>
				<Meta
					seotitle="Delivery Orders"
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
						order.unique_order_id && "#" + order.unique_order_id.substr(order.unique_order_id.length - 8)
					}
					disable_search={true}
				/>

				{!order.id ? (
					<div className="pt-50">
						<ContentLoader
							height={150}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="70" rx="4" ry="4" width="80" height="78" />
							<rect x="144" y="85" rx="0" ry="0" width="115" height="18" />
							<rect x="144" y="115" rx="0" ry="0" width="165" height="16" />
						</ContentLoader>
					</div>
				) : (
					<React.Fragment>
						{this.state.loading && (
							<div className="height-100 overlay-loading ongoing-payment-spin">
								<div className="spin-load" />
							</div>
						)}
						{!this.state.delivered && (
							<React.Fragment>
								{this.state.max_order && (
									<div className="auth-error">
										<div className="error-shake">
											{localStorage.getItem("deliveryMaxOrderReachedMsg")}
										</div>
									</div>
								)}
								{this.state.already_accepted ? (
									<div className="auth-error">
										<div className="error-shake">
											{localStorage.getItem("deliveryAlreadyAccepted")}
										</div>
									</div>
								) : (
									<React.Fragment>
										{this.state.delivery_pin_error && (
											<div className="auth-error" style={{ zIndex: "9", marginBottom: "4rem" }}>
												<div className="error-shake">
													{localStorage.getItem("deliveryInvalidDeliveryPin")}
												</div>
											</div>
										)}

										<button className="btn btn-clock text-center">
											<i className="si si-clock mr-5" />{" "}
											{localStorage.getItem("deliveryOrderPlacedText")}:{" "}
											<Moment fromNow interval={5000}>
												{order.updated_at}
											</Moment>
										</button>
										{/* <h1>ORDER STATUS: {order.orderstatus_id}</h1> */}
										<div className="view-delivery-order" style={{ paddingBottom: "20rem" }}>
											<RestaurantInfo order={order} />
											<div className="clearfix" />
											<hr />
											<div className="pt-15 px-15">
												<h3>
													<span className="delivery-orderItems-basket">
														<i className="si si-basket mr-2" />
													</span>
													{localStorage.getItem("deliveryOrderItems")}
												</h3>
												{order.orderitems.map((item) => (
													<OrderItems item={item} key={item.id} />
												))}
												{localStorage.getItem("showPriceAndOrderCommentsDelivery") ===
													"true" && (
													<React.Fragment>
														<p>{order.order_comment}</p>
														<p className="pull-right">
															<strong>
																Total:{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" &&
																	localStorage.getItem("currencyFormat")}{" "}
																{order.total}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</strong>
														</p>
													</React.Fragment>
												)}
											</div>
											<hr />
											{!this.state.picked_up && (
												<React.Fragment>
													<div className="pt-15 px-15">
														<div className="address restaurant-address">
															<h4 className="text-muted">
																{localStorage.getItem("deliveryRestaurantAddress")}
															</h4>
															<p className="m-0">{order.restaurant.address}</p>
															<p className="m-0">{order.restaurant.pincode}</p>
															<div
																className="pull-right"
																onClick={() =>
																	this.__getDirectionToRestaurant(
																		order.restaurant.latitude,
																		order.restaurant.longitude
																	)
																}
															>
																<button className="btn btn-get-direction">
																	<i className="si si-action-redo mr-5" />
																	{localStorage.getItem("deliveryGetDirectionButton")}
																</button>
															</div>
															<div className="clearfix" />
														</div>
													</div>
													{localStorage.getItem("showUserInfoBeforePickup") === "true" && (
														<div className="pt-15 px-15">
															<div className="customer-address">
																<h4 className="text-muted">
																	{localStorage.getItem("deliveryDeliveryAddress")}
																</h4>
																<p className="font-weight-bold mb-0">
																	{order.user.name}
																</p>
																<p className="mb-0">{order.user.phone}</p>
																<p className="mb-2">{order.address}</p>
																<div className="pull-right">
																	<button
																		className="btn btn-get-direction"
																		onClick={() =>
																			this.__getDirectionToUser(order.location)
																		}
																	>
																		<i className="si si-action-redo mr-5" />
																		{localStorage.getItem(
																			"deliveryGetDirectionButton"
																		)}
																	</button>
																</div>
																<div className="pull-right mr-2">
																	<a
																		className="btn btn-get-direction"
																		href={"tel:" + order.user.phone}
																	>
																		<i className="si si-call-out mr-5" />
																		{localStorage.getItem("callNowButton")}{" "}
																	</a>
																</div>
																<div className="clearfix" />
															</div>
														</div>
													)}
												</React.Fragment>
											)}

											{this.state.picked_up && (
												<React.Fragment>
													<div className="pt-15 px-15">
														<div className="customer-address">
															<h4 className="text-muted">
																{localStorage.getItem("deliveryDeliveryAddress")}
															</h4>
															<p className="font-weight-bold mb-0">{order.user.name}</p>
															<p className="mb-0">{order.user.phone}</p>
															<p className="mb-2">{order.address}</p>
															<div className="pull-right">
																<button
																	className="btn btn-get-direction"
																	onClick={() =>
																		this.__getDirectionToUser(order.location)
																	}
																>
																	<i className="si si-action-redo mr-5" />
																	{localStorage.getItem("deliveryGetDirectionButton")}
																</button>
															</div>
															<div className="pull-right mr-2">
																<a
																	className="btn btn-get-direction"
																	href={"tel:" + order.user.phone}
																>
																	<i className="si si-call-out mr-5" />
																	{localStorage.getItem("callNowButton")}{" "}
																</a>
															</div>

															<div className="clearfix" />
														</div>
													</div>
													<div className="pt-15 px-15">
														{order.payment_mode === "COD" ? (
															<button className="btn btn-cod">
																{localStorage.getItem("deliveryCashOnDelivery")}:{" "}
																{localStorage.getItem("currencySymbolAlign") ===
																	"left" && localStorage.getItem("currencyFormat")}
																{order.payable}
																{localStorage.getItem("currencySymbolAlign") ===
																	"right" && localStorage.getItem("currencyFormat")}
															</button>
														) : (
															<button className="btn btn-payed-online">
																<i className="si si-check mr-5" />{" "}
																{localStorage.getItem("deliveryOnlinePayment")}
															</button>
														)}
													</div>
													{localStorage.getItem("enableDeliveryPin") === "true" && (
														<div className="pt-10 px-15 delivery-pin-block">
															<div className="form-group">
																<div className="row">
																	<div className="col-12">
																		<input
																			type="text"
																			className="form-control"
																			placeholder={localStorage.getItem(
																				"deliveryDeliveryPinPlaceholder"
																			)}
																			onChange={this.__handleDeliveryPinInput}
																		/>
																	</div>
																</div>
															</div>
														</div>
													)}
												</React.Fragment>
											)}
											<div className="delivery-action">
												{!this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<button
															onClick={this.__acceptToDeliver}
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-check mr-5" />
															{localStorage.getItem("deliveryAcceptOrderButton")}
														</button>
													)}
												{this.state.accepted_order &&
													!this.state.picked_up &&
													!this.state.delivered && (
														<button
															onClick={this.__pickedUp}
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-bag mr-5" />
															{localStorage.getItem("deliveryPickedUpButton")}
														</button>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													!this.state.delivered && (
														<button
															onClick={this.__delivered}
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-check mr-5" />
															{localStorage.getItem("deliveryDeliveredButton")}
														</button>
													)}
												{this.state.accepted_order &&
													this.state.picked_up &&
													this.state.delivered && (
														<button
															type="button"
															className="btn btn-accept"
															style={{
																backgroundColor: localStorage.getItem("storeColor"),
															}}
														>
															<i className="si si-check mr-5" />
															{localStorage.getItem("deliveryOrderCompletedButton")}
														</button>
													)}
											</div>
										</div>
									</React.Fragment>
								)}
							</React.Fragment>
						)}
					</React.Fragment>
				)}
				<ShareLiveLocation />
			</React.Fragment>
		);
		 
	 }
		
			
		 

	

	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	single_delivery_order: state.single_delivery_order.single_delivery_order,
	accepted_order: state.accepted_order.accepted_order,
});

export default connect(
	mapStateToProps,
	{ getSingleDeliveryOrder, acceptToDeliverOrder, pickupOrder, deliverOrder }
)(ViewOrder);
