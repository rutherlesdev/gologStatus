import React, { Component } from "react";

import Collapsible from "react-collapsible";
import DelayLink from "../../../helpers/delayLink";

import PagePopup from "./PagePopup";
class UserMenu extends Component {
	render() {
		const { pages } = this.props;
		return (
			<React.Fragment>
				<Collapsible trigger={localStorage.getItem("accountMyAccount")} transitionTime={200} open={true}>
					<div className="category-list-item">
						<DelayLink to={"/my-addresses"} delay={200}>
							<div className="display-flex py-2">
								<div className="mr-10 border-0">
									<i className="si si-home" />
								</div>
								<div className="flex-auto border-0">{localStorage.getItem("accountManageAddress")}</div>
								<div className="flex-auto text-right">
									<i className="si si-arrow-right" />
								</div>
							</div>
						</DelayLink>
					</div>

					<div className="category-list-item">
						<DelayLink to={"/my-orders"} delay={200}>
							<div className="display-flex py-2">
								<div className="mr-10 border-0">
									<i className="si si-basket-loaded" />
								</div>
								<div className="flex-auto border-0">{localStorage.getItem("accountMyOrders")}</div>
								<div className="flex-auto text-right">
									<i className="si si-arrow-right" />
								</div>
							</div>
						</DelayLink>
					</div>
					<div className="category-list-item">
						<DelayLink to={"/my-wallet"} delay={200}>
							<div className="display-flex py-2">
								<div className="mr-10 border-0">
									<i className="si si-wallet" />
								</div>
								<div className="flex-auto border-0">{localStorage.getItem("accountMyWallet")}</div>
								<div className="flex-auto text-right">
									<i className="si si-arrow-right" />
								</div>
							</div>
						</DelayLink>
					</div>
				</Collapsible>
				<Collapsible trigger={localStorage.getItem("accountHelpFaq")} transitionTime={200}>
					{pages.map(page => (
						<div key={page.id} className="category-list-item">
							<PagePopup page={page}></PagePopup>
						</div>
					))}
				</Collapsible>
			</React.Fragment>
		);
	}
}

export default UserMenu;
