import React, { Component } from "react";

import Meta from "../../helpers/meta";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { getSettings } from "../../../services/settings/actions";
import { loginDeliveryUser } from "../../../services/Delivery/user/actions";
import { getAllLanguages } from "../../../services/languages/actions";
import { getSingleLanguageData } from "../../../services/languages/actions";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { flexbox } from '@material-ui/system';
import { sizing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';




import Loading from "../../helpers/loading";

class Login extends Component {
	state = {
		loading: false,
		email: "",
		password: "",
		error: false,
	};
	static contextTypes = {
		router: () => null,
	};
	componentDidMount() {
		this.props.getSettings();

		// setTimeout(() => {
		// 	this.setState({ error: false });
		// }, 380);

		this.props.getAllLanguages();
	}

	handleOnChange = (event) => {
		// console.log(event.target.value);
		this.props.getSingleLanguageData(event.target.value);
		localStorage.setItem("userPreferedLanguage", event.target.value);
	};

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value });
	};
	handleInputPassword = (event) => {
		this.setState({ password: event.target.value });
	};

	handleLogin = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		this.props.loginDeliveryUser(this.state.email, this.state.password);
	};

	componentWillReceiveProps(nextProps) {
		const { delivery_user } = this.props;
		if (delivery_user !== nextProps.delivery_user) {
			this.setState({ loading: false });
			if (nextProps.delivery_user.success === false) {
				this.setState({ error: true });
			}
		}
		if (nextProps.delivery_user.success) {
			// this.context.router.push("/delivery");
		}

		if (this.props.languages !== nextProps.languages) {
			if (localStorage.getItem("userPreferedLanguage")) {
				this.props.getSingleLanguageData(localStorage.getItem("userPreferedLanguage"));
			} else {
				if (nextProps.languages.length) {
					// console.log("NEXT", nextProps.languages);
					const id = nextProps.languages.filter((lang) => lang.is_default === 1)[0].id;
					this.props.getSingleLanguageData(id);
				}
			}
		}

	}



	render() {






		if (window.innerWidth > 768) {
			return <Redirect to="/" />;
		}
		const { delivery_user } = this.props;
		if (delivery_user.success) {
			return (
				//redirect to account page
				<Redirect to={"/delivery"} />
			);
		}

		return (
			<React.Fragment>
				<Meta
					seotitle="Login"
					seodescription={localStorage.getItem("seoMetaDescription")}
					ogtype="website"
					ogtitle={localStorage.getItem("seoOgTitle")}
					ogdescription={localStorage.getItem("seoOgDescription")}
					ogurl={window.location.href}
					twittertitle={localStorage.getItem("seoTwitterTitle")}
					twitterdescription={localStorage.getItem("seoTwitterDescription")}
				/>
				{this.state.error && (
					<div className="auth-error">
						<div className="error-shake">{localStorage.getItem("emailPassDonotMatch")}</div>
					</div>
				)}
				{this.state.loading && <Loading />}
				<div style={{ backgroundColor: "#fffff" }}>
					<div className="input-group">
						<div className="input-group-prepend">
							<div style={{ height: "3.5rem" }} />
						</div>
					</div>



				</div>


				<div style={{ width: '100%', marginBottom: 80 }}>
					<Box display="flex" justifyContent="center" m={1} p={1} >
						<Box p={1} >
							<img style={{ height: 60, width: 240 }} src="https://i.ibb.co/ypMVDQd/logopreto.png" />

						</Box>
					</Box>
				</div>








				<div className="height-70 " style={{ backgroundColor: "#2bfb2e" }}>
					<form onSubmit={this.handleLogin}>
						<div className="form-group px-15 pt-30">
							<label className="col-12 edit-address-input-label">
								{localStorage.getItem("loginLoginEmailLabel")}
							</label>
							<div className="col-md-9 pb-5">
								<input style={{ borderRadius: 9, backgroundColor: "#ffffff" }}



									type="text"
									name="email"
									onChange={this.handleInputEmail}
									className="form-control edit-address-input"
								/>
							</div>
							<label className="col-12 edit-address-input-label" >
								{localStorage.getItem("loginLoginPasswordLabel")}
							</label>
							<div className="col-md-9">
								<input style={{ borderRadius: 9, backgroundColor: "#FFFfff" }}
									type="password"
									name="password"
									onChange={this.handleInputPassword}
									className="form-control edit-address-input"
								/>
							</div>
						</div>

						<Box display="flex" justifyContent="center" >

							<Button style={{ width: 300, marginTop: 40 }}
								type="submit"
								variant="contained"
								color="primary"
								size="large"
								startIcon={<ExitToAppIcon />}
							>
								Entre
                        </Button> </Box>

						<Box display="flex" justifyContent="center" m={1} p={1} >
							<a style={{ fontSize: 20 }} href="https://appchegou.com/public/auth/cadastro"><b style={{ color: "0A3D0B" }}>Cadastre-se</b></a> </Box>
					</form>

					{this.props.languages && this.props.languages.length > 1 && (
						<div className="mt-100 d-flex align-items-center justify-content-center">
							<div className="mr-2">{localStorage.getItem("changeLanguageText")}</div>
							<select
								onChange={this.handleOnChange}
								defaultValue={
									localStorage.getItem("userPreferedLanguage")
										? localStorage.getItem("userPreferedLanguage")
										: this.props.languages.filter((lang) => lang.is_default === 1)[0].id
								}
								className="form-control language-select"
							>
								{this.props.languages.map((language) => (
									<option value={language.id} key={language.id}>
										{language.language_name}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	delivery_user: state.delivery_user.delivery_user,
	languages: state.languages.languages,
	language: state.languages.language,
});

export default connect(
	mapStateToProps,
	{ loginDeliveryUser, getSettings, getAllLanguages, getSingleLanguageData }
)(Login);
