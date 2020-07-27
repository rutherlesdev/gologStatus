import {
  GET_DELIVERY_RESTAURANTS_URL,
  GET_SELFPICKUP_RESTAURANTS_URL,
  GET_SINGLE_ORDER_TO_BE_RATED,
  GET_RESTAURANTS_SLIDES_URL,
} from "../../../../configs/index";
import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import DelayLink from "../../../helpers/delayLink";
import Ink from "react-ink";
import LazyLoad from "react-lazyload";

import { withRouter } from "react-router-dom";
import axios from "axios";
import PromoSlider from "../PromoSlider";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";

class RestaurantList extends Component {
  state = {
    total: null,
    restaurants: [],
    loading: false,
    loading_more: true,
    selfpickup: false,
    userPreferredSelectionDelivery: true,
    userPreferredSelectionSelfPickup: false,
    no_restaurants: false,
    data: [],
    review_data: [],
  };

  componentDidMount() {
    this.getAllRestaurantSliders();
    if (localStorage.getItem("enRAR") === "true" && "enRAR" === "disRAR") {
      this.getRatableOrdersDetails();
    }

    if (localStorage.getItem("userPreferredSelection") === "DELIVERY") {
      this.setState({ userPreferredSelectionDelivery: true });
      this.filterDelivery();
    }
    if (
      localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
      localStorage.getItem("enSPU") === "true"
    ) {
      this.setState({ userPreferredSelectionSelfPickup: true });
      this.filterSelfPickup();
    } else {
      localStorage.setItem("userPreferredSelection", "DELIVERY");
      localStorage.setItem("userSelected", "DELIVERY");
      this.setState({ userPreferredSelectionDelivery: true });
      this.getDeliveryRestaurants();
    }
  }

  getDeliveryRestaurants = () => {
    if (localStorage.getItem("userSetAddress")) {
      if (!this.state.loading) {
        // Set loading state to true to
        // avoid multiple requests on scroll
        this.setState({
          loading: true,
        });

        const userSetAddress = JSON.parse(
          localStorage.getItem("userSetAddress")
        );
        // make XHR request
        axios
          .post(GET_DELIVERY_RESTAURANTS_URL, {
            latitude: userSetAddress.lat,
            longitude: userSetAddress.lng,
          })
          .then((response) => {
            const restaurants = response.data;

            for (var restaurante of restaurants) {
              if (restaurante.name.includes("GoLog")) {
                const log = restaurante;
              

              console.log(restaurants);

              if (log) {
                // add new
                this.setState({
                  total: log.length,
                  restaurants: [...this.state.restaurants, log],
                  loading: true,
                  loading_more: true,
                  no_restaurants: false,
                });
              } else {
                this.setState({
                  total: null,
                  loading: false,
                  loading_more: false,
                  no_restaurants: true,
                });
              }
            }
          }});
      }
    }
  };

  getSelfPickupRestaurants = () => {
    if (localStorage.getItem("userSetAddress")) {
      if (!this.state.loading) {
        // Set loading state to true to
        // avoid multiple requests on scroll
        this.setState({
          loading: true,
        });

        const userSetAddress = JSON.parse(
          localStorage.getItem("userSetAddress")
        );

        // make XHR request
        axios
          .post(GET_SELFPICKUP_RESTAURANTS_URL, {
            latitude: userSetAddress.lat,
            longitude: userSetAddress.lng,
          })
          .then((response) => {
            const restaurants = response.data;
            if (restaurants.length) {
              // console.log("RES from API", restaurants);
              // add new
              this.setState({
                total: restaurants.length,
                restaurants: [...this.state.restaurants, ...restaurants],
                loading: false,
                loading_more: false,
                no_restaurants: false,
              });
            } else {
              this.setState({
                total: null,
                loading: false,
                loading_more: false,
                no_restaurants: true,
              });
            }
          });
      }
    }
  };

  filterDelivery = () => {
    this.setState(
      () => ({
        selfpickup: false,
        restaurants: [],
        userPreferredSelectionDelivery: true,
        userPreferredSelectionSelfPickup: false,
      }),
      () => {
        this.getDeliveryRestaurants();
        console.log(this.getDeliveryRestaurants());
      }
    );
    localStorage.setItem("userPreferredSelection", "DELIVERY");
    if (localStorage.getItem("showPromoSlider") === "true") {
      // window.scrollTo({ top: 205, behavior: "smooth" });
    } else {
      // window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  filterSelfPickup = () => {
    this.setState(
      () => ({
        selfpickup: true,
        restaurants: [],
        userPreferredSelectionSelfPickup: true,
        userPreferredSelectionDelivery: false,
      }),
      () => {
        this.getSelfPickupRestaurants();
      }
    );
    localStorage.setItem("userPreferredSelection", "SELFPICKUP");
    if (localStorage.getItem("showPromoSlider") === "true") {
      // window.scrollTo({ top: 205, behavior: "smooth" });
    } else {
      // window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  getAllRestaurantSliders = () => {
    axios.post(GET_RESTAURANTS_SLIDES_URL).then((response) => {
      if (response.data) {
        this.setState({
          data: response.data,
        });
      }
    });
  };

  changeRouteToRestaurantsCategories = (categories) => {
    if (categories.categories_ids) {
      const saveCategorySelectOptions = new Promise((resolve) => {
        localStorage.setItem(
          "categorySelectOptions",
          JSON.stringify(categories.categories_ids)
        );
        resolve("categorySelectOptions Saved");
      });
      saveCategorySelectOptions.then(() => {
        this.props.history.push("categories/stores");
      });
    }
  };

  getRatableOrdersDetails = () => {
    const { user } = this.props;
    if (user.success) {
      axios
        .post(GET_SINGLE_ORDER_TO_BE_RATED, {
          user_id: user.data.id,
          token: user.data.auth_token,
        })
        .then((response) => {
          this.setState({
            review_data: response.data,
          });
        });
    }
  };

  animateStarIcon = () => {
    let stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Zoom top delay={i * 100} key={i}>
          <i
            className="fa fa-star pr-1"
            style={{
              color: localStorage.getItem("rarModHomeBannerStarsColor"),
            }}
          />
        </Zoom>
      );
    }
    return stars;
  };

  render() {
    return (
      <React.Fragment>
        <div className="bg-white mb-100">
          {this.state.no_restaurants && (
            <div
              className={
                "bg-light " +
                (localStorage.getItem("enSPU") === "true"
                  ? "sticky-top"
                  : "pt-3")
              }
            >
              {localStorage.getItem("enSPU") === "true" ? (
                <React.Fragment>
                  <div className="px-15 py-3 d-flex justify-content-between align-items-center">
                    <h1 className="restaurant-count mb-0 mr-2">
                      {localStorage.getItem("noRestaurantMessage")}
                    </h1>
                    <div className="d-flex">
                      <button
                        onClick={this.filterDelivery}
                        className={
                          "btn btn-preference mr-2 " +
                          (this.state.userPreferredSelectionDelivery
                            ? "user-preferred"
                            : "")
                        }
                      >
                        {localStorage.getItem("deliveryTypeDelivery")}
                        {this.state.userPreferredSelectionDelivery && (
                          <i className="si si-check ml-2" />
                        )}
                      </button>
                      <button
                        onClick={this.filterSelfPickup}
                        className={
                          "btn btn-preference " +
                          (this.state.userPreferredSelectionSelfPickup
                            ? "user-preferred"
                            : "")
                        }
                      >
                        {localStorage.getItem("deliveryTypeSelfPickup")}
                        {this.state.userPreferredSelectionSelfPickup && (
                          <i className="si si-check ml-2" />
                        )}
                      </button>
                    </div>
                  </div>
                  <hr />
                </React.Fragment>
              ) : (
                <h1 className="restaurant-count mb-0 mr-2 px-15">
                  {localStorage.getItem("noRestaurantMessage")}
                </h1>
              )}
              <hr />
            </div>
          )}
          {this.state.total ? (
            <React.Fragment>
              <div
                className={
                  "bg-light " +
                  (localStorage.getItem("enSPU") === "true"
                    ? "sticky-top"
                    : "pt-3")
                }
              >
                {localStorage.getItem("enSPU") === "true" && (
                  <React.Fragment>
                    <div className="px-15 py-3 d-flex justify-content-between align-items-center">
                      <h1 className="restaurant-count mb-0 mr-2">
                        {this.state.total}{" "}
                        {localStorage.getItem("restaurantCountText")}
                      </h1>
                      <div className="d-flex">
                        <button
                          onClick={this.filterDelivery}
                          className={
                            "btn btn-preference mr-2 " +
                            (this.state.userPreferredSelectionDelivery
                              ? "user-preferred"
                              : "")
                          }
                        >
                          {localStorage.getItem("deliveryTypeDelivery")}
                          {this.state.userPreferredSelectionDelivery && (
                            <i className="si si-check ml-2" />
                          )}
                        </button>
                        <button
                          onClick={this.filterSelfPickup}
                          className={
                            "btn btn-preference " +
                            (this.state.userPreferredSelectionSelfPickup
                              ? "user-preferred"
                              : "")
                          }
                        >
                          {localStorage.getItem("deliveryTypeSelfPickup")}
                          {this.state.userPreferredSelectionSelfPickup && (
                            <i className="si si-check ml-2" />
                          )}
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </React.Fragment>
          ) : null}
          {this.state.restaurants.length === 0 ? (
            <ContentLoader
              height={378}
              width={400}
              speed={1.2}
              primaryColor="#f3f3f3"
              secondaryColor="#ecebeb"
            >
              <rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
              <rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
              <rect x="144" y="60" rx="0" ry="0" width="165" height="16" />

              <rect x="20" y="145" rx="4" ry="4" width="80" height="78" />
              <rect x="144" y="155" rx="0" ry="0" width="115" height="18" />
              <rect x="144" y="185" rx="0" ry="0" width="165" height="16" />

              <rect x="20" y="270" rx="4" ry="4" width="80" height="78" />
              <rect x="144" y="280" rx="0" ry="0" width="115" height="18" />
              <rect x="144" y="310" rx="0" ry="0" width="165" height="16" />
            </ContentLoader>
          ) : (
            this.state.restaurants.map((restaurant, index) => (
              <React.Fragment key={restaurant.id}>
                <LazyLoad>
                  <div className="col-xs-12 col-sm-12 restaurant-block">
                    <DelayLink
                      to={"../stores/" + restaurant.slug}
                      delay={200}
                      className="block text-center mb-3"
                      clickAction={() => {
                        localStorage.getItem("userPreferredSelection") ===
                          "DELIVERY" &&
                          restaurant.delivery_type === 1 &&
                          localStorage.setItem("userSelected", "DELIVERY");
                        localStorage.getItem("userPreferredSelection") ===
                          "SELFPICKUP" &&
                          restaurant.delivery_type === 2 &&
                          localStorage.setItem("userSelected", "SELFPICKUP");
                        localStorage.getItem("userPreferredSelection") ===
                          "DELIVERY" &&
                          restaurant.delivery_type === 3 &&
                          localStorage.setItem("userSelected", "DELIVERY");
                        localStorage.getItem("userPreferredSelection") ===
                          "SELFPICKUP" &&
                          restaurant.delivery_type === 3 &&
                          localStorage.setItem("userSelected", "SELFPICKUP");
                      }}
                    >
                      <div
                        className={`block-content block-content-full ${
                          restaurant.is_featured && restaurant.is_active
                            ? "ribbon ribbon-bookmark ribbon-warning pt-2"
                            : "pt-2"
                        } `}
                      >
                        {restaurant.is_featured ? (
                          <div className="ribbon-box">
                            {localStorage.getItem("restaurantFeaturedText")}
                          </div>
                        ) : null}

                        <Fade duration={500}>
                          <img
                            src={"https://media.giphy.com/media/QtvEouZBOE8nPn7yFx/giphy.gif"}
                            alt={restaurant.name}
                            className={`restaurant-image ${!restaurant.is_active &&
                              "restaurant-not-active"}`}
                          />
                        </Fade>
                      </div>
                      <div className="block-content block-content-full restaurant-info">
                        <div className="font-w600 mb-5 text-dark">
                          {restaurant.name}
                        </div>
                        <div className="font-size-sm text-muted truncate-text text-muted">
                          {restaurant.description}
                        </div>
                        {!restaurant.is_active && (
                          <span className="restaurant-not-active-msg">
                            {localStorage.getItem("restaurantNotActiveMsg")}
                          </span>
                        )}
                        <hr className="my-10" />
                        <div className="text-center restaurant-meta mt-5 d-flex align-items-center justify-content-between text-muted">
                          <div className="col-2 p-0 text-left">
                            <i
                              className={`fa fa-star pr-1 ${!restaurant.is_active &&
                                "restaurant-not-active"}`}
                              style={{
                                color: localStorage.getItem("storeColor"),
                              }}
                            />{" "}
                            {restaurant.rating}
                          </div>
                          <div className="col-4 p-0 text-center">
                            <i className="si si-clock pr-1" />{" "}
                            {restaurant.delivery_time}{" "}
                            {localStorage.getItem("homePageMinsText")}
                          </div>
                          <div className="col-6 p-0 text-center">
                            <i className="si si-wallet pr-1" />{" "}
                            {localStorage.getItem("currencySymbolAlign") ===
                              "left" && localStorage.getItem("currencyFormat")}
                            {restaurant.price_range}{" "}
                            {localStorage.getItem("currencySymbolAlign") ===
                              "right" && localStorage.getItem("currencyFormat")}
                            {localStorage.getItem("homePageForTwoText")}
                          </div>
                        </div>
                      </div>
                      <Ink duration="500" hasTouch={false} />
                    </DelayLink>
                  </div>
                </LazyLoad>
                {localStorage.getItem("showPromoSlider") === "true" && (
                  <React.Fragment>
                    {this.props.slides && this.props.slides.length > 0 && (
                      <React.Fragment>
                        {index ===
                          this.props.slides[0]["promo_slider"]["position_id"] -
                            1 && (
                          <PromoSlider
                            slides={this.props.slides}
                            size={this.props.slides[0]["promo_slider"]["size"]}
                            secondarySlider={true}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
                {localStorage.getItem("enRestaurantCategorySlider") ===
                  "true" && (
                  <React.Fragment>
                    {index ===
                      parseInt(
                        localStorage.getItem("restaurantCategorySliderPosition")
                      ) -
                        1 && (
                      <React.Fragment>
                        {this.state.data.length > 0 && (
                          <div className="slider-wrapper secondary-slider-wrapper my-20">
                            {this.state.data.map((category) => (
                              <div
                                className="slider-wrapper__img-wrapper"
                                key={category.id}
                              >
                                <div
                                  style={{ position: "relative" }}
                                  onClick={() => {
                                    this.changeRouteToRestaurantsCategories(
                                      category
                                    );
                                  }}
                                >
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="slider-wrapper__img slider-cust-img"
                                    style={{
                                      height:
                                        (12 / 5) *
                                          parseInt(
                                            localStorage.getItem(
                                              "restaurantCategorySliderSize"
                                            )
                                          ) +
                                        "rem",
                                      width:
                                        (12 / 5) *
                                          parseInt(
                                            localStorage.getItem(
                                              "restaurantCategorySliderSize"
                                            )
                                          ) +
                                        "rem",
                                      borderRadius:
                                        parseFloat(
                                          localStorage.getItem(
                                            "restaurantCategorySliderStyle"
                                          )
                                        ) + "rem",
                                    }}
                                  />
                                  {localStorage.getItem(
                                    "showRestaurantCategorySliderLabel"
                                  ) === "true" && (
                                    <span className="category-slider-name">
                                      {category.name}
                                    </span>
                                  )}
                                  <Ink duration="500" hasTouch={true} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
                {this.state.review_data.ratable &&
                  localStorage.getItem("enRAR") === "true" &&
                  localStorage.getItem("rarModEnHomeBanner") === "true" &&
                  "enRAR" === "disRAR" && (
                    <React.Fragment>
                      {console.log("Came here")}
                      {!this.state.loading &&
                        index ===
                          parseInt(
                            localStorage.getItem("rarModHomeBannerPosition")
                          ) -
                            1 && (
                          <div
                            className="col-xs-12 col-sm-12 rating-block px-15 py-10"
                            style={{
                              backgroundColor: localStorage.getItem(
                                "rarModHomeBannerBgColor"
                              ),
                            }}
                          >
                            <DelayLink
                              to={{
                                pathname:
                                  "../rate-and-review/" +
                                  this.state.review_data.data.id,
                              }}
                              delay={250}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <strong
                                  style={{
                                    color: localStorage.getItem(
                                      "rarModHomeBannerTextColor"
                                    ),
                                  }}
                                >
                                  {localStorage.getItem("rarModHomeBannerText")}
                                  {localStorage.getItem(
                                    "rarModShowBannerRestaurantName"
                                  ) === "true" &&
                                    this.state.review_data.data.restaurant.name}
                                </strong>
                                <span
                                  className="btn btn-default"
                                  style={{
                                    minWidth: "100px",
                                    textAlign: "center",
                                  }}
                                >
                                  {this.animateStarIcon()}
                                </span>
                              </div>
                              <Ink duration="500" hasTouch={false} />
                            </DelayLink>
                          </div>
                        )}
                    </React.Fragment>
                  )}
              </React.Fragment>
            ))
          )}

          {this.state.loading_more ? (
            <div className="">
              <ContentLoader
                height={120}
                width={400}
                speed={1.2}
                primaryColor="#f3f3f3"
                secondaryColor="#ecebeb"
              >
                <rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
                <rect x="144" y="35" rx="0" ry="0" width="115" height="18" />
                <rect x="144" y="65" rx="0" ry="0" width="165" height="16" />
              </ContentLoader>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(RestaurantList);
