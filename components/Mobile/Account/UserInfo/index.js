import React, { Component } from "react";

class UserInfo extends Component {
    render() {
        const { user_info } = this.props;
        return (
            <React.Fragment>
                <div className="block-content block-content-full bg-white">
                    <h2 className="font-w600 mb-10">{user_info.name}</h2>
                    <p className="text-muted">
                        {user_info.phone} . {user_info.email}
                    </p>
                    <hr className="hr-bold" />
                </div>
            </React.Fragment>
        );
    }
}

export default UserInfo;
