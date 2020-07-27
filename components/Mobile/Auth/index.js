import React, { Component } from "react";

import Login from "./Login";
import Meta from "../../helpers/meta";

class Auth extends Component {
    render() {
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
                <Login />
            </React.Fragment>
        );
    }
}

export default Auth;
