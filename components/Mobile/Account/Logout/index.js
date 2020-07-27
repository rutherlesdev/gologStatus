import React, { Component } from "react";

import { connect } from "react-redux";
import { logoutUser } from "../../../../services/user/actions";

class Logout extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="block-content block-content-full bg-white" onClick={() => this.props.logoutUser(this.props.user)}>
                    <div className="display-flex">
                        <div className="flex-auto logout-text">{localStorage.getItem("accountLogout")}</div>
                        <div className="flex-auto text-right">
                            <i className="si si-power logout-icon" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Logout);
