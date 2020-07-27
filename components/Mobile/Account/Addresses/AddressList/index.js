import React, { Component } from "react";

import Ink from "react-ink";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Zoom from "@material-ui/core/Zoom";
class AddressList extends Component {
	state = {
		dropdownItem: null,
	};
	handleSetDefaultAddress = (e, address) => {
		console.log(e.target);
		if (!e.target.classList.contains("si")) {
			console.log("action");
			this.props.handleSetDefaultAddress(address.id, address);
		} else {
			console.log("no action");
		}
	};
	handleDropdown = (event) => {
		// console.log(event.target);
		// console.log(event.currentTarget);
		this.setState({ dropdownItem: event.currentTarget });
	};
	handleDropdownClose = () => {
		console.log("Dropdown closed Called");

		this.setState({ dropdownItem: null });
	};

	render() {
		const { user, address } = this.props;
		return (
			<React.Fragment>
				<div
					className="bg-white single-address-card d-flex"
					onClick={(e) => this.handleSetDefaultAddress(e, address)}
					style={{ position: "relative" }}
				>
					<div className={!address.is_operational && this.props.fromCartPage ? "address-not-usable" : null}>
						{user.data.default_address_id === address.id ? (
							<button
								className="btn btn-sm pull-right btn-address-default p-0 m-0"
								style={{ border: "0", right: "-5px", fontSize: "1.3rem" }}
							>
								<i
									className="si si-check"
									style={{
										color: localStorage.getItem("storeColor"),
									}}
								/>
								<Ink duration={200} />
							</button>
						) : (
							<React.Fragment>
								{this.props.fromCartPage && (
									<React.Fragment>
										{!address.is_operational && (
											<span className="text-danger text-uppercase font-w600 text-sm08">
												{" "}
												<i className="si si-close" />{" "}
												{localStorage.getItem("addressDoesnotDeliverToText")}
											</span>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						)}

						{address.tag !== null && (
							<h6 className="m-0 text-uppercase">
								<strong>{address.tag}</strong>
							</h6>
						)}
						<div>
							{address.house !== null && (
								<React.Fragment>
									<p className="m-0 text-capitalize">
										{address.tag === null ? (
											<strong>{address.house}</strong>
										) : (
											<span>{address.house}</span>
										)}
									</p>
								</React.Fragment>
							)}
							<p className="m-0 text-capitalize text-sm08">{address.address}</p>
						</div>
					</div>

					<div>
						{!this.props.fromCartPage && this.props.deleteButton && (
							<React.Fragment>
								{user.data.default_address_id !== address.id && (
									<button
										className="btn btn-sm pull-right btn-address-default p-0 m-0 btn-delete-address"
										style={{ border: "0", right: "-5px", fontSize: "1.3rem", zIndex: 2 }}
										// onClick={this.handleDropdown}
									>
										{/* <div
										onClick={this.handleDropdown}
										style={{ position: "absolute", right: "5px", bottom: "5px", zIndex: 2 }}
									> */}
										<i
											className="si si-trash"
											style={{ fontSize: "1.3rem" }}
											onClick={this.handleDropdown}
										/>
										{/* </div> */}
									</button>
								)}
							</React.Fragment>
						)}
					</div>
					<Ink duration={500} hasTouch={true} />
				</div>
				<Menu
					id="simple-menu"
					keepMounted
					anchorEl={this.state.dropdownItem}
					open={Boolean(this.state.dropdownItem)}
					onClose={this.handleDropdownClose}
					TransitionComponent={Zoom}
					MenuListProps={{ disablePadding: true }}
					elevation={3}
					getContentAnchorEl={null}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					<MenuItem
						onClick={() => {
							this.props.handleDeleteAddress(address.id);
							this.handleDropdownClose();
						}}
					>
						{localStorage.getItem("deleteAddressText")}
					</MenuItem>
				</Menu>
			</React.Fragment>
		);
	}
}

export default AddressList;
