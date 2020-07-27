import * as serviceWorker from "./serviceWorker";

import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import React from "react";
import store from "./services/store";
// import { checkVersion } from "./checkVersion";
import CheckVersion from "./components/CheckVersion";

const Root = ({ children, initialState = {} }) => (
	<React.Fragment>
		{/* {checkVersion()} */}
		{localStorage.getItem("customCSS") !== null && (
			<Helmet>
				<style type="text/css">{localStorage.getItem("customCSS")}</style>
			</Helmet>
		)}
		<Provider store={store(initialState)}>
			{children}
			<CheckVersion />
		</Provider>
	</React.Fragment>
);
serviceWorker.register();
// serviceWorker.unregister();

export default Root;
