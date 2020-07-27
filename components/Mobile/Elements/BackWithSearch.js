import React, { Component } from "react";

import Ink from "react-ink";
import LightSpeed from "react-reveal/LightSpeed";

class BackWithSearch extends Component {
    static contextTypes = {
        router: () => null
    };

    render() {
        return (
            <React.Fragment>
                <div className="col-12 p-0 fixed" style={{ zIndex: "9" }}>
                    <div className="block m-0">
                        <div className="block-content p-0">
                            <div className={`input-group ${this.props.boxshadow && "search-box"}`}>
                                {!this.props.disable_back_button && (
                                    <div className="input-group-prepend">
                                        {this.props.back_to_home && (
                                            <button
                                                type="button"
                                                className="btn search-navs-btns"
                                                style={{ position: "relative" }}
                                                onClick={() => this.context.router.history.push("/")}
                                            >
                                                <i className="si si-arrow-left" />
                                                <Ink duration="500" />
                                            </button>
                                        )}

                                        {this.props.goto_orders_page && (
                                            <button
                                                type="button"
                                                className="btn search-navs-btns"
                                                style={{ position: "relative" }}
                                                onClick={() => this.context.router.history.push("/my-orders")}
                                            >
                                                <i className="si si-arrow-left" />
                                                <Ink duration="500" />
                                            </button>
                                        )}
                                        {this.props.goto_accounts_page && (
                                            <button
                                                type="button"
                                                className="btn search-navs-btns"
                                                style={{ position: "relative" }}
                                                onClick={() => this.context.router.history.push("/my-account")}
                                            >
                                                <i className="si si-arrow-left" />
                                                <Ink duration="500" />
                                            </button>
                                        )}
                                        {!this.props.back_to_home && !this.props.goto_orders_page && !this.props.goto_accounts_page && (
                                            <button
                                                type="button"
                                                className="btn search-navs-btns"
                                                style={{ position: "relative" }}
                                                onClick={this.context.router.history.goBack}
                                            >
                                                <i className="si si-arrow-left" />
                                                <Ink duration="500" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <p className="form-control search-input">
                                    {this.props.logo && <img src="/assets/img/logos/logo.png" alt={localStorage.getItem("storeName")} width="120" />}
                                    {this.props.has_title ? <span className="nav-page-title">{this.props.title}</span> : null}
                                    {this.props.has_delivery_icon && (
                                        <LightSpeed left>
                                            <img src="/assets/img/various/delivery-bike.png" alt={this.props.title} className="nav-page-title" />
                                        </LightSpeed>
                                    )}
                                </p>
                                {this.props.has_restaurant_info ? (
                                    <div
                                        className="fixed-restaurant-info hidden"
                                        ref={node => {
                                            this.heading = node;
                                        }}
                                    >
                                        <span className="font-w700 fixedRestaurantName">{this.props.restaurant.name}</span>
                                        <br />
                                        <span className="font-w400 fixedRestaurantTime">
                                            <i className="si si-clock" /> {this.props.restaurant.delivery_time}{" "}
                                            {localStorage.getItem("homePageMinsText")}
                                        </span>
                                    </div>
                                ) : null}
                                <div className="input-group-append">
                                    {!this.props.disable_search && (
                                        <button type="submit" className="btn search-navs-btns" style={{ position: "relative" }}>
                                            <i className="si si-magnifier" />
                                            <Ink duration="500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BackWithSearch;
