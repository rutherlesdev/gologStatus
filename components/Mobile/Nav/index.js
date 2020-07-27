import React, { Component } from "react";

import Ink from "react-ink";
import { Link } from "react-router-dom";

class Nav extends Component {
	static contextTypes = {
		router: () => null,
	};

	render() {
		return (
			<React.Fragment>
				<div className="col-12 p-0 sticky-top">
					<div className="block m-0">
						<div className="block-content p-0">
							<div className="input-group search-box">
								{!this.props.disable_back_button && (
									<div className="input-group-prepend">
										<button
											type="button"
											className="btn search-navs-btns"
											style={{ position: "relative" }}
										>
											<i className="si si-arrow-left" />
											<Ink duration="500" />
										</button>
									</div>
								)}
								<p className="form-control search-input">
									{this.props.logo &&
										(this.props.logoLink ? (
											<Link to="/">
												<img
													src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
													alt={localStorage.getItem("storeName")}
													className="store-logo"
												/>
											</Link>
										) : (
											<img
												src={`/assets/img/logos/${localStorage.getItem("storeLogo")}`}
												alt={localStorage.getItem("storeName")}
												className="store-logo"
											/>
										))}
								</p>
								<div className="input-group-append">
									<button
										type="submit"
										className="btn nav-location truncate-text"
										style={{ position: "relative", maxWidth: window.innerWidth - 130 }}
										onClick={() => {
											this.props.loggedin
												? this.context.router.history.push("/my-addresses")
												: this.context.router.history.push("/search-location");
										}}
									>
										{localStorage.getItem("userSetAddress") && (
											<React.Fragment>
												<span>
													{JSON.parse(localStorage.getItem("userSetAddress")).tag !== null ? (
														<strong className="text-uppercase mr-1">
															{JSON.parse(localStorage.getItem("userSetAddress")).tag}
														</strong>
													) : null}

													{JSON.parse(localStorage.getItem("userSetAddress")).house !==
													null ? (
														<span>
															{JSON.parse(localStorage.getItem("userSetAddress")).house
																.length > 18
																? `${JSON.parse(
																		localStorage.getItem("userSetAddress")
																  ).house.substring(0, 18)}...`
																: JSON.parse(localStorage.getItem("userSetAddress"))
																		.house}
														</span>
													) : (
														<span>
															{JSON.parse(localStorage.getItem("userSetAddress")).address
																.length > 25
																? `${JSON.parse(
																		localStorage.getItem("userSetAddress")
																  ).address.substring(0, 25)}...`
																: JSON.parse(localStorage.getItem("userSetAddress"))
																		.address}
														</span>
													)}
												</span>
											</React.Fragment>
										)}
										<i
											className="si si-arrow-right nav-location-icon ml-1"
											style={{ color: localStorage.getItem("storeColor") }}
										/>
										<Ink duration="500" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Nav;
