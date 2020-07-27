import React, { Component } from "react";
import { loginUser, registerUser, sendOtp, verifyOtp } from "../../../../services/user/actions";

import BackButton from "../../Elements/BackButton";
import ContentLoader from "react-content-loader";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import SocialButton from "../SocialButton";
import { connect } from "react-redux";
import { getSingleLanguageData } from "../../../../services/languages/actions";

class Login extends Component {
	constructor() {
		super();
		this.validator = new SimpleReactValidator({
			autoForceUpdate: this,
			messages: {
				required: localStorage.getItem("fieldValidationMsg"),
				email: localStorage.getItem("emailValidationMsg"),
				regex: localStorage.getItem("phoneValidationMsg"),
			},
		});
	}

	state = {
		loading: false,
		email: "",
		phone: "",
		password: "",
		otp: "",
		accessToken: "",
		provider: "",
		error: false,
		email_phone_already_used: false,
		invalid_otp: false,
		showResendOtp: false,
		countdownStart: false,
		countDownSeconds: 15,
		email_pass_error: false,
	};

	static contextTypes = {
		router: () => null,
	};

	componentDidMount() {
		if (
			localStorage.getItem("enableFacebookLogin") === "false" &&
			localStorage.getItem("enableGoogleLogin") === "false"
		) {
			if (document.getElementById("socialLoginDiv")) {
				document.getElementById("socialLoginDiv").classList.add("hidden");
			}
		}

		if (
			localStorage.getItem("enableFacebookLogin") === "true" ||
			localStorage.getItem("enableGoogleLogin") === "true"
		) {
			setTimeout(() => {
				if (this.refs.socialLogin) {
					this.refs.socialLogin.classList.remove("hidden");
				}
				if (this.refs.socialLoginLoader) {
					this.refs.socialLoginLoader.classList.add("hidden");
				}
			}, 0.5 * 1000);
		}
	}

	handleInputChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleLogin = (event) => {
		event.preventDefault();
		if (this.validator.fieldValid("email") && this.validator.fieldValid("password")) {
			this.setState({ loading: true });
			this.props.loginUser(
				null,
				this.state.email,
				this.state.password,
				null,
				null,
				null,
				JSON.parse(localStorage.getItem("userSetAddress"))
			);
		} else {
			console.log("validation failed");
			this.validator.showMessages();
		}
	};

	handleRegisterAfterSocialLogin = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		if (this.validator.fieldValid("phone")) {
			if (localStorage.getItem("enSOV") === "true") {
				//sending email and phone, first verify if not exists, then send OTP from the server
				this.props.sendOtp(this.state.email, this.state.phone, null).then((response) => {
					if (!response.payload.otp) {
						this.setState({ error: false });
					}
				});
			} else {
				this.props.loginUser(
					this.state.name,
					this.state.email,
					null,
					this.state.accessToken,
					this.state.phone,
					this.state.provider,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			}
		} else {
			this.setState({ loading: false });
			console.log("Validation Failed");
			this.validator.showMessages();
		}
	};

	resendOtp = () => {
		if (this.validator.fieldValid("phone")) {
			this.setState({ countDownSeconds: 15, showResendOtp: false });
			this.props.sendOtp(this.state.email, this.state.phone, null).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: false });
				}
			});
		}
	};

	handleVerifyOtp = (event) => {
		event.preventDefault();
		console.log("verify otp clicked");
		if (this.validator.fieldValid("otp")) {
			this.setState({ loading: true });
			this.props.verifyOtp(this.state.phone, this.state.otp);
		}
	};

	handleOnChange = (event) => {
		// console.log(event.target.value);
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};
	componentWillReceiveProps(nextProps) {
		const { user } = this.props;
		if (user !== nextProps.user) {
			this.setState({ loading: false });
		}
		if (nextProps.user.success) {
			if (nextProps.user.data.default_address !== null) {
				const userSetAddress = {
					lat: nextProps.user.data.default_address.latitude,
					lng: nextProps.user.data.default_address.longitude,
					address: nextProps.user.data.default_address.address,
					house: nextProps.user.data.default_address.house,
					tag: nextProps.user.data.default_address.tag,
				};
				localStorage.setItem("userSetAddress", JSON.stringify(userSetAddress));
			}
			this.context.router.history.goBack();
		}
		if (nextProps.user.email_phone_already_used) {
			this.setState({ email_phone_already_used: true });
		}
		if (nextProps.user.otp) {
			this.setState({ email_phone_already_used: false, error: false });
			//otp sent, hide reg form and show otp form
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("socialLoginDiv").classList.add("hidden");
			document.getElementById("phoneFormAfterSocialLogin").classList.add("hidden");
			document.getElementById("otpForm").classList.remove("hidden");

			//start countdown
			this.setState({ countdownStart: true });
			this.handleCountDown();
			this.validator.hideMessages();
		}

		if (nextProps.user.valid_otp) {
			this.setState({ invalid_otp: false, error: false, loading: true });
			// register user
			if (this.state.social_login) {
				this.props.loginUser(
					this.state.name,
					this.state.email,
					null,
					this.state.accessToken,
					this.state.phone,
					this.state.provider,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			} else {
				this.props.registerUser(
					this.state.name,
					this.state.email,
					this.state.phone,
					this.state.password,
					JSON.parse(localStorage.getItem("userSetAddress"))
				);
			}

			console.log("VALID OTP, REG USER NOW");
			this.setState({ loading: false });
		}

		if (nextProps.user.valid_otp === false) {
			console.log("Invalid OTP");
			this.setState({ invalid_otp: true });
		}

		if (!nextProps.user) {
			this.setState({ error: true });
		}

		//old user, proceed to login after social login
		if (nextProps.user.proceed_login) {
			console.log("From Social : user already exists");
			this.props.loginUser(
				this.state.name,
				this.state.email,
				null,
				this.state.accessToken,
				null,
				this.state.provider,
				JSON.parse(localStorage.getItem("userSetAddress"))
			);
		}

		if (nextProps.user.enter_phone_after_social_login) {
			this.validator.hideMessages();
			document.getElementById("loginForm").classList.add("hidden");
			document.getElementById("socialLoginDiv").classList.add("hidden");
			document.getElementById("phoneFormAfterSocialLogin").classList.remove("hidden");
			// populate name & email
			console.log("ask to fill the phone number and send otp process...");
		}

		if (nextProps.user.data === "DONOTMATCH") {
			//email and pass donot match
			this.setState({ error: false, email_pass_error: true });
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					console.log("Fetching Translation Data...");
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}
	}

	handleSocialLogin = (user) => {
		//if otp verification is enabled
		if (localStorage.getItem("enSOV") === "true") {
			//save user data in state
			this.setState({
				name: user._profile.name,
				email: user._profile.email,
				accessToken: user._token.accessToken,
				provider: user._provider,
				social_login: true,
			});
			//request for OTP, send accessToken, if email exists in db, user will login
			this.props.sendOtp(user._profile.email, null, user._token.accessToken, user._provider).then((response) => {
				if (!response.payload.otp) {
					this.setState({ error: false });
				}
			});
		} else {
			//call to new api to check if phone number present

			//if record phone number present, then login,

			//else show enter phone number
			this.setState({
				name: user._profile.name,
				email: user._profile.email,
				accessToken: user._token.accessToken,
				provider: user._provider,
				social_login: true,
			});
			this.props.loginUser(
				user._profile.name,
				user._profile.email,
				null,
				user._token.accessToken,
				null,
				user._provider,
				JSON.parse(localStorage.getItem("userSetAddress"))
			);
		}
	};

	handleSocialLoginFailure = (err) => {
		// this.setState({ error: true });
		console.log("Social Login Error", err);
	};

	handleCountDown = () => {
		setTimeout(() => {
			this.setState({ showResendOtp: true });
			clearInterval(this.intervalID);
		}, 15000 + 1000);
		this.intervalID = setInterval(() => {
			console.log("interval going on");
			this.setState({
				countDownSeconds: this.state.countDownSeconds - 1,
			});
		}, 1000);
	};

	componentWillUnmount() {
		//clear countdown
		console.log("Countdown cleared");
		clearInterval(this.intervalID);
	}

	render() {
		// console.log("Langugaes", this.props.languages);

		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		if (localStorage.getItem("storeColor") === null) {
			return <Redirect to={"/"} />;
		}
		const { user } = this.props;
		if (user.success) {
			return (
				//redirect to account page
				<Redirect to={"/my-account"} />
			);
		}
		// const languages = JSON.parse(localStorage.getItem("state")).languages;
		// const languages = this.props.language;
		// console.log(languages);

		const languages = this.props.languages;

		return (
			<React.Fragment>
				{/* PreLoading the loading gif */}
				<img src="/assets/img/loading-food.gif" className="hidden" alt="prefetching" />
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("loginErrorMessage")}</div>
					</div>
				)}
				{this.state.email_phone_already_used && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPhoneAlreadyRegistered")}</div>
					</div>
				)}
				{this.state.invalid_otp && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("invalidOtpMsg")}</div>
					</div>
				)}
				{this.state.email_pass_error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPassDonotMatch")}</div>
					</div>
				)}

				{this.state.loading && (
					<div className="height-100 overlay-loading">
						<div>
							<img src="/assets/img/loading-food.gif" alt={localStorage.getItem("pleaseWaitText")} />
						</div>
					</div>
				)}

				<div style={{ backgroundColor: "#f2f4f9" }}>
					<div className="input-group">
						<div className="input-group-prepend">
							<BackButton history={this.props.history} />
						</div>
					</div>
					<img
						src="/assets/img/login-header.png"
						className="login-image pull-right mr-15"
						alt="login-header"
					/>
					<div className="login-texts px-15 mt-50 pb-20">
						<span className="login-title">{localStorage.getItem("loginLoginTitle")}</span>
						<br />
						<span className="login-subtitle">{localStorage.getItem("loginLoginSubTitle")}</span>
					</div>
				</div>
				<div className="bg-white">
					<form onSubmit={this.handleLogin} id="loginForm">
						<div className="form-group px-15 pt-30">
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("loginLoginEmailLabel")}{" "}
								{this.validator.message("email", this.state.email, "required|email")}
							</label>
							<div className="col-md-9 pb-5">
								<input
									type="text"
									name="email"
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
								/>
							</div>
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("loginLoginPasswordLabel")}{" "}
								{this.validator.message("password", this.state.password, "required")}
							</label>
							<div className="col-md-9">
								<input
									type="password"
									name="password"
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
								/>
							</div>
						</div>
						<div className="mt-20 px-15 pt-15 button-block">
							<button
								type="submit"
								className="btn btn-main"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
								}}
							>
								{localStorage.getItem("loginLoginTitle")}
							</button>
						</div>
					</form>
					<form onSubmit={this.handleVerifyOtp} id="otpForm" className="hidden">
						<div className="form-group px-15 pt-30">
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("otpSentMsg")} {this.state.phone}
								{this.validator.message("otp", this.state.otp, "required|numeric|min:4|max:6")}
							</label>
							<div className="col-md-9">
								<input
									name="otp"
									type="tel"
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
									required
								/>
							</div>

							<button
								type="submit"
								className="btn btn-main"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
								}}
							>
								{localStorage.getItem("verifyOtpBtnText")}
							</button>

							<div className="mt-30 mb-10">
								{this.state.showResendOtp && (
									<div className="resend-otp" onClick={this.resendOtp}>
										{localStorage.getItem("resendOtpMsg")} {this.state.phone}
									</div>
								)}

								{this.state.countDownSeconds > 0 && (
									<div className="resend-otp countdown">
										{localStorage.getItem("resendOtpCountdownMsg")} {this.state.countDownSeconds}
									</div>
								)}
							</div>
						</div>
					</form>
					<form
						onSubmit={this.handleRegisterAfterSocialLogin}
						id="phoneFormAfterSocialLogin"
						className="hidden"
					>
						<div className="form-group px-15 pt-30">
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("socialWelcomeText")} {this.state.name},
							</label>
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("enterPhoneToVerify")}{" "}
								{this.validator.message("phone", this.state.phone, [
									"required",
									{ regex: ["^\\+[1-9]\\d{1,14}$"] },
									{ min: ["8"] },
								])}
							</label>
							<div className="col-md-9 pb-5">
								<input
									defaultValue={
										localStorage.getItem("phoneCountryCode") === null
											? ""
											: localStorage.getItem("phoneCountryCode")
									}
									name="phone"
									type="tel"
									onChange={this.handleInputChange}
									className="form-control edit-address-input"
								/>
							</div>
							<button
								type="submit"
								className="btn btn-main"
								style={{
									backgroundColor: localStorage.getItem("storeColor"),
								}}
							>
								{localStorage.getItem("registerRegisterTitle")}
							</button>
						</div>
					</form>
					<div className="text-center mt-3 mb-20" id="socialLoginDiv">
						<p className="login-or mt-2">{localStorage.getItem("socialLoginOrText")}</p>
						<div ref="socialLoginLoader">
							<ContentLoader
								height={60}
								width={400}
								speed={1.2}
								primaryColor="#f3f3f3"
								secondaryColor="#ecebeb"
							>
								<rect x="28" y="0" rx="0" ry="0" width="165" height="45" />
								<rect x="210" y="0" rx="0" ry="0" width="165" height="45" />
							</ContentLoader>
						</div>
						<div ref="socialLogin" className="hidden">
							{localStorage.getItem("enableFacebookLogin") === "true" && (
								<SocialButton
									provider="facebook"
									appId={localStorage.getItem("facebookAppId")}
									onLoginSuccess={this.handleSocialLogin}
									onLoginFailure={this.handleSocialLoginFailure}
									className="facebook-login-button mr-2"
								>
									{localStorage.getItem("facebookLoginButtonText")}
								</SocialButton>
							)}
							{localStorage.getItem("enableGoogleLogin") === "true" && (
								<SocialButton
									provider="google"
									appId={localStorage.getItem("googleAppId")}
									onLoginSuccess={this.handleSocialLogin}
									onLoginFailure={this.handleSocialLoginFailure}
									className="google-login-button"
								>
									{localStorage.getItem("googleLoginButtonText")}
								</SocialButton>
							)}
						</div>
					</div>
					<div className="text-center mt-50 mb-20">
						{localStorage.getItem("loginDontHaveAccount")}{" "}
						<NavLink
							to="/register"
							style={{
								color: localStorage.getItem("storeColor"),
							}}
						>
							{localStorage.getItem("firstScreenRegisterBtn")}
						</NavLink>
					</div>
				</div>
				{localStorage.getItem("enPassResetEmail") === "true" && (
					<div className="mt-4 d-flex align-items-center justify-content-center">
						<NavLink
							to="/login/forgot-password"
							style={{
								color: localStorage.getItem("storeColor"),
							}}
						>
							{localStorage.getItem("forgotPasswordLinkText")}
						</NavLink>
					</div>
				)}

				{localStorage.getItem("registrationPolicyMessage") !== "null" && (
					<div
						className="mt-20 mb-20 d-flex align-items-center justify-content-center"
						dangerouslySetInnerHTML={{
							__html: localStorage.getItem("registrationPolicyMessage"),
						}}
					/>
				)}

				{languages && languages.length > 1 && (
					<div className="mt-4 d-flex align-items-center justify-content-center">
						<div className="mr-2">{localStorage.getItem("changeLanguageText")}</div>
						<select
							onChange={this.handleOnChange}
							defaultValue={
								localStorage.getItem("userPreferedLanguage")
									? localStorage.getItem("userPreferedLanguage")
									: languages.filter((lang) => lang.is_default === 1)[0].id
							}
							className="form-control language-select"
						>
							{languages.map((language) => (
								<option value={language.id} key={language.id}>
									{language.language_name}
								</option>
							))}
						</select>
					</div>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user.user,
	language: state.languages.language,
	languages: state.languages.languages,
});

export default connect(
	mapStateToProps,
	{
		loginUser,
		registerUser,
		sendOtp,
		verifyOtp,
		getSingleLanguageData,
	}
)(Login);
