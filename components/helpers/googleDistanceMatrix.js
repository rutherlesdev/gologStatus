import { GoogleApiWrapper } from "google-maps-react";

export const googleDistanceMatrix = (lat1, lng1, lat2, lng2) => {
	const script = document.createElement("script");
	script.src =
		"https://maps.googleapis.com/maps/api/js?key=" + localStorage.getItem("googleApiKey") + "&libraries=places";
	script.id = "googleMaps";
	document.body.appendChild(script);

	setTimeout(() => {
		var service = new google.maps.DistanceMatrixService();
		console.log(service);
	}, 5000);

	// return function() {
	// 	console.log(this.props.google.maps);
	// };
};
// export default GoogleApiWrapper({
// 	apiKey: localStorage.getItem("googleApiKey"),
// })(googleDistanceMatrix);
