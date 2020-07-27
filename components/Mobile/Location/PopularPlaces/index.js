import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import Flip from "react-reveal/Flip";
import Ink from "react-ink";

class PopularPlaces extends Component {
	render() {
		const { loading, locations, handleGeoLocationClick } = this.props;
		return (
			<React.Fragment>
				<div className="p-15 mt-15">
					{loading ? (
						<React.Fragment>
							<h1 className="text-muted h4">{localStorage.getItem("searchPopularPlaces")}</h1>
							<ContentLoader
								height={160}
								width={400}
								speed={1.2}
								primaryColor="#f3f3f3"
								secondaryColor="#ecebeb"
							>
								<rect x="0" y="0" rx="15" ry="15" width="125" height="30" />
								<rect x="135" y="0" rx="15" ry="15" width="100" height="30" />
								<rect x="245" y="0" rx="15" ry="15" width="110" height="30" />
								<rect x="0" y="40" rx="15" ry="15" width="85" height="30" />
								<rect x="95" y="40" rx="15" ry="15" width="125" height="30" />
							</ContentLoader>
						</React.Fragment>
					) : (
						<React.Fragment>
                        <h1 className="text-muted h4">{localStorage.getItem("searchPopularPlaces")}</h1>
							{locations.map((location, index) => (
									
									<Flip top delay={index * 50} key={location.id}>
										<button
											type="button"
											className="btn btn-rounded btn-alt-secondary btn-md mb-15 mr-15"
											style={{ position: "relative" }}
											onClick={() => {
												const geoLocation = [
													{
														formatted_address: location.name,
														geometry: {
															location: {
																lat: location.latitude,
																lng: location.longitude,
															},
														},
													},
												];
												handleGeoLocationClick(geoLocation);
											}}
										>
											<Ink duration="500" />
											{location.name}
										</button>
									</Flip>
							
							))}
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default PopularPlaces;
