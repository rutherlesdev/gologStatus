import React, { Component } from "react";
import { getSinglePage, clearSinglePage } from "../../services/pages/actions";
import { connect } from "react-redux";
import Meta from "../helpers/meta";
import Footer from "../Desktop/Footer";
import BackWithSearch from "../Mobile/Elements/BackWithSearch";
import ContentLoader from "react-content-loader";

class SinglePage extends Component {
    componentDidMount() {
        this.props.clearSinglePage();

        this.props.getSinglePage(this.props.match.params.slug);
    }

    render() {
        const { single_page: page } = this.props;
        return (
            <React.Fragment>
                <BackWithSearch boxshadow={true} has_title={false} disable_search={true} />

                {page.length === 0 ? (
                    <React.Fragment>
                        <div className="container-fluid p-0 pb-50">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 pt-80">
                                        <ContentLoader
                                            height={window.innerHeight}
                                            width={window.innerWidth}
                                            speed={1.2}
                                            primaryColor="#f3f3f3"
                                            secondaryColor="#ecebeb"
                                        >
                                            <rect x="20" y="25" rx="0" ry="0" width="155" height="22" />
                                            <rect x="20" y="120" rx="0" ry="0" width="180" height="18" />
                                            <rect x="20" y="145" rx="0" ry="0" width="380" height="18" />
                                            <rect x="20" y="170" rx="0" ry="0" width="300" height="18" />
                                            <rect x="20" y="195" rx="0" ry="0" width="150" height="18" />
                                            <rect x="20" y="220" rx="0" ry="0" width="350" height="18" />
                                            <rect x="20" y="245" rx="0" ry="0" width="150" height="18" />
                                        </ContentLoader>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Meta
                            seotitle={page.name}
                            seodescription={localStorage.getItem("seoMetaDescription")}
                            ogtype="website"
                            ogtitle={page.name}
                            ogdescription={localStorage.getItem("seoOgDescription")}
                            ogurl={window.location.href}
                            twittertitle={page.name}
                            twitterdescription={localStorage.getItem("seoTwitterDescription")}
                        />
                        <div className="container-fluid p-0 pb-50">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="text-muted pt-80">{page.name}</h1>
                                        <hr />
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: page.body
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {window.innerWidth >= 768 ? <Footer /> : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    single_page: state.pages.single_page
});

export default connect(
    mapStateToProps,
    { getSinglePage, clearSinglePage }
)(SinglePage);
