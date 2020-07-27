import React, { Component } from "react";

import Footer from "./Footer";
import Hero from "./Hero";
import Meta from "../helpers/meta";
import StoreAchievements from "./StoreAchievements";
import { connect } from "react-redux";
import { getSettings } from "../../services/settings/actions";
import { getSingleLanguageData } from "../../services/languages/actions";
class Desktop extends Component {
    state = {
        showGdpr: false
    };
    componentDidMount() {
        if (!localStorage.getItem("storeColor")) {
            this.props.getSettings();
        }

        if (!localStorage.getItem("gdprAccepted")) {
            localStorage.setItem("gdprAccepted", "false");
            if (localStorage.getItem("showGdpr") === "true") {
                this.setState({ showGdpr: true });
            }
        }

        if (localStorage.getItem("showGdpr") === "true" && localStorage.getItem("gdprAccepted") === "false") {
            this.setState({ showGdpr: true });
        }
    }
    handleGdprClick = () => {
        localStorage.setItem("gdprAccepted", "true");
        this.setState({ showGdpr: false });
    };

    handleOnChange = event => {
        // console.log(event.target.value);
        this.props.getSingleLanguageData(event.target.value);
        localStorage.setItem("userPreferedLanguage", event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.languages !== nextProps.languages) {
            if (localStorage.getItem("userPreferedLanguage")) {
                this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
                // console.log("Called 1");
            } else {
                if (nextProps.languages.length) {
                    const id = nextProps.languages.filter(lang => lang.is_default === 1)[0].id;
                    this.props.getSingleLanguageData(id);
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showGdpr && (
                    <div className="fixed-gdpr">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: localStorage.getItem("gdprMessage")
                            }}
                        ></span>
                        <span>
                            <button
                                className="btn btn-sm ml-2"
                                style={{ backgroundColor: localStorage.getItem("storeColor") }}
                                onClick={this.handleGdprClick}
                            >
                                {localStorage.getItem("gdprConfirmButton")}
                            </button>
                        </span>
                    </div>
                )}
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
                <Hero />
                <StoreAchievements />
                <Footer languages={this.props.languages} handleOnChange={this.handleOnChange} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    settings: state.settings.settings,
    languages: state.languages.languages,
    language: state.languages.language
});

export default connect(
    mapStateToProps,
    { getSettings, getSingleLanguageData }
)(Desktop);
