import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { addRating, getOrderDetails } from "../../../../../services/rating/actions";
import { connect } from "react-redux";
import BackWithSearch from "../../../Elements/BackWithSearch";
import { Redirect } from "react-router";
import Loading from "../../../../helpers/loading";

export class RateAndReview extends Component {
	static contextTypes = {
		router: () => null,
	};
	state = {
		loading: true,
		restaurant_rating: 0,
		delivery_rating: 0,
		comment: "",
		order_id: this.props.match.params.id,
		user_id: "",
		auth_token: "",
		required_error: false,
		completed: false,
	};

	onFoodRating = (nextValue, prevValue, name) => {
		this.setState({ restaurant_rating: nextValue });
	};

	onDeliveryRating = (nextValue, prevValue, name) => {
		this.setState({ delivery_rating: nextValue });
	};

	feedbackComment = (event) => {
		event.preventDefault();
		this.setState({ comment: event.target.value });
	};

	submitRating = () => {
		if (this.state.delivery_rating === 0 || this.state.restaurant_rating === 0) {
			this.setState({
				required_error: true,
			});
		} else {
			this.props.addRating(this.state);
			this.setState({
				restaurant_rating: 0,
				delivery_rating: 0,
				comment: "",
			});
		}
	};

	componentDidMount() {
		if (this.props.user.success) {
			this.setState({
				user_id: this.props.user.data.id,
				auth_token: this.props.user.data.auth_token,
			});

			this.props.getOrderDetails(
				this.props.match.params.id,
				this.props.user.data.id,
				this.props.user.data.auth_token
			);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.rating_details !== nextProps.rating_details) {
			if (nextProps.rating_details.success) {
				this.setState({ loading: false });
			}
			if (!nextProps.rating_details.success) {
				console.log("Order not found");
				this.context.router.history.push("/");
			}
		}
		if (this.props.done_rating !== nextProps.done_rating) {
			if (nextProps.done_rating.success) {
				this.setState({ loading: false, required_error: false, completed: true });
				console.log("Rating done. Redirect to home");

				setTimeout(() => {
					// this.context.router.history.push("/");
				}, 5000);
			}
		}
	}

	render() {
		const { restaurant_rating, delivery_rating } = this.state;
		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (!user.success) {
			return (
				//redirect to login page if not loggedin
				<Redirect to={"/login"} />
			);
		}

		return (
			<React.Fragment>
				{this.state.required_error && (
					<div className="auth-error mb-50">
						<div className="error-shake">Ratings are required</div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div className="col-12 p-0 mb-5">
					<BackWithSearch
						boxshadow={true}
						has_title={true}
						title={localStorage.getItem("rarModRatingPageTitle")}
						disable_search={true}
						goto_accounts_page={true}
					/>
				</div>
				{this.state.completed ? (
					<div className="d-flex justify-content-center pt-80">
						<img src="/assets/img/order-placed.gif" alt="Completed" className="img-fluid w-50" />
					</div>
				) : (
					<React.Fragment>
						<img
							src="/assets/img/various/review-bg.png"
							alt="review"
							className="img-fluid review-screen-bg"
						/>

						<div className="block-content block-content-full pt-80 px-15">
							<form className="rating-form">
								<div className="form-group pt-30 mb-0">
									<label className="col-12 text-muted">
										{localStorage.getItem("rarModDeliveryRatingTitle")}
									</label>
									<div className="col-md-9 pb-5">
										<StarRatingComponent
											name="restaurant_rating"
											starCount={5}
											value={restaurant_rating}
											onStarClick={this.onFoodRating}
										/>
									</div>
								</div>

								<div className="form-group mb-0">
									<label className="col-12 text-muted">
										{localStorage.getItem("rarModRestaurantRatingTitle")}
									</label>
									<div className="col-md-9 pb-5">
										<StarRatingComponent
											name="delivery_rating"
											starCount={5}
											value={delivery_rating}
											onStarClick={this.onDeliveryRating}
										/>
									</div>
								</div>
								<div className="form-group mb-0">
									<label className="col-12 text-muted">
										{localStorage.getItem("rarReviewBoxTitle")}
									</label>
									<div className="col-md-9 pb-5">
										<textarea
											placeholder={localStorage.getItem("rarReviewBoxTextPlaceHolderText")}
											value={this.state.comment}
											onChange={this.feedbackComment}
											className="feedback-textarea"
										/>
									</div>
								</div>

								<button
									className="btn-fixed-bottom"
									style={{ backgroundColor: localStorage.getItem("storeColor") }}
									onClick={this.submitRating}
									type="button"
								>
									{localStorage.getItem("rarSubmitButtonText")}
								</button>
							</form>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => ({
	user: state.user.user,
	rating_details: state.rating.rating_details,
	done_rating: state.rating.done_rating,
});

export default connect(
	mapStateToProps,
	{ addRating, getOrderDetails }
)(RateAndReview);
