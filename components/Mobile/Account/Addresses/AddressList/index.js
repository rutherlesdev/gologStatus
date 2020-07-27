import React, { Component } from "react";

import Ink from "react-ink";

class AddressList extends Component {
	render() {
		const { user, address } = this.props;
		return (
			<React.Fragment>
				<div className={!address.is_operational && this.props.fromCartPage ? "address-not-usable" : " "}>
					{user.data.default_address_id === address.id ? (
						<button className="btn btn-lg pull-right btn-address-default selected">
							<i
								className="si si-check"
								style={{
									color: localStorage.getItem("storeColor")
								}}
							/>
							<Ink duration={200} />
						</button>
					) : (
						<React.Fragment>
							{this.props.fromCartPage ? (
								<React.Fragment>
									{address.is_operational ? (
										<button
											className="btn btn-lg pull-right btn-address-default"
											onClick={() => this.props.handleSetDefaultAddress(address.id, address)}
										>
											<i className="si si-check" />
											<Ink duration={200} />
										</button>
									) : (
										<span className="text-danger text-uppercase font-w600 text-sm08">
											{" "}
											<i className="si si-close"></i>{" "}
											{localStorage.getItem("addressDoesnotDeliverToText")}
										</span>
									)}
								</React.Fragment>
							) : (
								<button
									className="btn btn-lg pull-right btn-address-default"
									onClick={() => this.props.handleSetDefaultAddress(address.id, address)}
								>
									<i className="si si-check" />
									<Ink duration={200} />
								</button>
							)}
						</React.Fragment>
					)}

					{address.tag !== null && <h6 className="m-0 text-uppercase">{address.tag}</h6>}
					<div className="mb-10" style={{ minHeight: "50px" }}>
						{address.house !== null && (
							<React.Fragment>
								<p className="m-0 text-capitalize">{address.house}</p>
							</React.Fragment>
						)}
						<p className="m-0 text-capitalize text-sm08">{address.address}</p>
					</div>
					{!this.props.fromCartPage && this.props.deleteButton && (
						<React.Fragment>
							{user.data.default_address_id !== address.id && (
								<span
									className="btn-edit-address"
									style={{
										color: localStorage.getItem("storeColor")
									}}
									onClick={() => this.props.handleDeleteAddress(address.id)}
								>
									{localStorage.getItem("deleteAddressText")}
								</span>
							)}
						</React.Fragment>
					)}
					<hr />
				</div>
			</React.Fragment>
		);
	}
}

export default AddressList;
