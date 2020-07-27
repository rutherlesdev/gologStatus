import React, { Component } from "react";
import Footer from "../Footer";
import Hero from "../Hero";
import StoreAchievements from "../StoreAchievements";

class V1 extends Component {
	render() {
		return (
			<React.Fragment>
				<Hero />
				<StoreAchievements />
				<Footer languages={this.props.languages} handleOnChange={this.props.handleOnChange} />
			</React.Fragment>
		);
	}
}

export default V1;
