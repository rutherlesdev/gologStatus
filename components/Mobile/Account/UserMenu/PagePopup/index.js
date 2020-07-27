import React, { Component } from "react";
import Modal from "react-responsive-modal";

class PagePopup extends Component {
	state = {
		open: false
	};
	handlePopupOpen = () => {
		this.setState({ open: true });
	};
	handlePopupClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { page } = this.props;
		return (
			<React.Fragment>
				<div className="display-flex py-2" onClick={this.handlePopupOpen}>
					<div className="flex-auto border-0">{page.name}</div>
					<div className="flex-auto text-right">
						<i className="si si-arrow-right" />
					</div>
				</div>
				<Modal open={this.state.open} onClose={this.handlePopupClose} closeIconSize={32}>
					<div className="mt-50" dangerouslySetInnerHTML={{ __html: page.body }} />
				</Modal>
			</React.Fragment>
		);
	}
}

export default PagePopup;
