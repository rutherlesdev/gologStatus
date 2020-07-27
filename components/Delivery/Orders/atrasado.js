import React, { Component } from "react";

import BackWithSearch from "../../Mobile/Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getDeliveryOrders } from "../../../services/Delivery/orders/actions";
import { logoutDeliveryUser } from "../../../services/Delivery/user/actions";
import NewOrders from "../NewOrders";
import AcceptedOrders from "../AcceptedOrders";
import Ink from "react-ink";
import Account from "../Account";
import Atrasado from "../../Atrasado"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

class Orders extends Component {
	state = {
		play: false,
	};
	audio = new Audio("/assets/audio/notification1.mp3");

	componentDidMount() {
		if (this.props.delivery_user.success) {
			this.props.getDeliveryOrders(this.props.delivery_user.data.auth_token);
		}

		this.refreshSetInterval = setInterval(() => {
			this.__refreshOrders();
		}, 15 * 1000);
	}

	__refreshOrders = () => {
		if (this.props.delivery_user.success) {
			if (this.refs.btnSpinner) {
				this.refs.btnSpinner.classList.add("fa-spin");
			}
			setTimeout(() => {
				if (this.refs.btnSpinner) {
					this.refs.btnSpinner.classList.remove("fa-spin");
				}
			}, 2 * 1000);
			this.props.getDeliveryOrders(this.props.delivery_user.data.auth_token);
		}
	};

	componentWillReceiveProps(newProps) {
		const { delivery_orders } = this.props;
		if (delivery_orders.new_orders) {
			if (newProps.delivery_orders.new_orders.length > delivery_orders.new_orders.length) {
				//new orders recieved,
				this.audio.play();
				if ("vibrate" in navigator) {
					navigator.vibrate(["100", "150", "100", "100", "150", "100"]);
				}
			}
		}
	}
	componentWillUnmount() {
		clearInterval(this.refreshSetInterval);
	}

	getLocationName = (location) => {
		try {
			console.log("Came to try");

			return (
				<span style={{ maxWidth: "100px", display: "block" }} className="truncate-text">
					{JSON.parse(location).address}
				</span>
			);
		} catch {
			return null;
		}
	};
	render() {
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}

		

		if (this.props.delivery_user.data.name.includes("bloqueado")) {
			
		}else
		
		
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
				<Atrasado ></Atrasado>
				
				<BackWithSearch
					logo={false}
					boxshadow={true}
					has_title={true}
					disable_search={true}
					disable_back_button={true}
					has_delivery_icon={false}/>
					
				
				<div className="delivery-order-refresh">
					
					<button
						className="btn btn-get-direction mr-15"
						onClick={this.__refreshOrders}
						style={{ position: "relative" }}
					>
						
						{localStorage.getItem("deliveryOrdersRefreshBtn")}{" "}
						<i ref="btnSpinner" className="fa fa-refresh" />
						<Ink duration={1200} />
						
					</button>
				</div>
				
				<Tabs>
					<div
						className="content font-size-xs clearfix footer-fixed"
						style={{ display: "block", width: "100%", padding: "0", height: "5rem" }}
					>
						<TabList>
							<Tab>
								<div className="text-center">
									<i className="si si-bell fa-2x" /> <br />
									{localStorage.getItem("deliveryFooterNewTitle")}
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
							<Tab>
								<div className="text-center">
									<i className="si si-grid fa-2x" /> <br />
									{localStorage.getItem("deliveryFooterAcceptedTitle")}
									<Ink duration="500" hasTouch="true" />
								</div>
							</Tab>
							<Tab>
								<div className="text-center">
									<i className="si si-user fa-2x" /> <br />{" "}
									{localStorage.getItem("deliveryFooterAccount")}
									<Ink duration="500" hasTouch="true" />
								</div>
								
							</Tab>
						</TabList>
					</div>
					<TabPanel>
					

						{!this.props.delivery_orders.new_orders ? (
							<div className="pt-50">
								
								<ContentLoader
									height={window.innerHeight}
									width={window.innerWidth}
									speed={1.2}
									primaryColor="#fafafa"
									secondaryColor="#eee"
								>
									
									<rect x="15" y="30" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="30" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="70" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="173" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="173" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="213" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="316" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="316" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="356" rx="0" ry="0" width="250" height="23" />

								</ContentLoader>
								
							</div>
							
						) : (
							
							<NewOrders
								getLocationName={this.getLocationName}
								new_orders={this.props.delivery_orders.new_orders}
							/>
						)}
					</TabPanel>
					<TabPanel>
						{!this.props.delivery_orders.accepted_orders ? (
							<div className="pt-50">
								<ContentLoader
									height={window.innerHeight}
									width={window.innerWidth}
									speed={1.2}
									primaryColor="#fafafa"
									secondaryColor="#eee"
								>
									<rect x="15" y="30" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="30" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="70" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="173" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="173" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="213" rx="0" ry="0" width="250" height="23" />

									<rect x="15" y="316" rx="0" ry="0" width="150" height="30" />
									<rect x="283" y="316" rx="0" ry="0" width="75" height="30" />
									<rect x="15" y="356" rx="0" ry="0" width="250" height="23" />
								</ContentLoader>
							</div>
						) : (
							<AcceptedOrders
								getLocationName={this.getLocationName}
								accepted_orders={this.props.delivery_orders.accepted_orders}
							/>
						)}
					</TabPanel>
					<TabPanel>
						<Account
							delivery_user={this.props.delivery_user}
							logoutDeliveryUser={this.props.logoutDeliveryUser}
						/>
					</TabPanel>
				</Tabs>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	delivery_orders: state.delivery_orders.delivery_orders,
});

export default connect(
	mapStateToProps,
	{ getDeliveryOrders, logoutDeliveryUser }
)(Orders);
