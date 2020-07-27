import React, { Component } from "react";
import { addProduct, removeProduct } from "../../../../services/cart/actions";

import Collapsible from "react-collapsible";
import ContentLoader from "react-content-loader";
import Customization from "../Customization";
// import Fade from "react-reveal/Fade";
import Ink from "react-ink";
import ItemBadge from "./ItemBadge";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

import RecommendedItems from "./RecommendedItems";
import ShowMore from "react-show-more";

import { connect } from "react-redux";
import { searchItem, clearSearch } from "../../../../services/items/actions";

class ItemList extends Component {
	state = {
		update: true,
		items_backup: [],
		searching: false,
		data: [],
		filterText: null,
		filter_items: [],
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}
	forceStateUpdate = () => {
		setTimeout(() => {
			this.forceUpdate();
			if (this.state.update) {
				this.setState({ update: false });
			} else {
				this.setState({ update: true });
			}
		}, 100);
	};

	searchItem = (event) => {
		if (event.target.value.length > 0) {
			this.setState({ filterText: event.target.value });
			this.props.searchItem(
				this.state.filter_items,
				event.target.value,
				localStorage.getItem("itemSearchText"),
				localStorage.getItem("itemSearchNoResultText")
			);
			this.setState({ searching: true });
		}
		if (event.target.value.length === 0) {
			this.setState({ filterText: null });
			// console.log("Cleared");

			this.props.clearSearch(this.state.items_backup);
			this.setState({ searching: false });
		}
	};

	static getDerivedStateFromProps(props, state) {
		if (props.data !== state.data) {
			if (state.filterText !== null) {
				return {
					data: props.data,
				};
			} else {
				return {
					items_backup: props.data,
					data: props.data,
					filter_items: props.data.items,
				};
			}
		}
		return null;
	}

	inputFocus = () => {
		this.refs.searchGroup.classList.add("shadow-light");
	};
	handleClickOutside = (event) => {
		if (this.refs.searchGroup && !this.refs.searchGroup.contains(event.target)) {
			this.refs.searchGroup.classList.remove("shadow-light");
		}
	};

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}
	render() {
		const { addProduct, removeProduct, cartProducts, restaurant } = this.props;
		const { data } = this.state;
		return (
			<React.Fragment>
				<div className="col-12 mt-10">
					<div className="input-group" ref="searchGroup" onClick={this.inputFocus}>
						<input
							type="text"
							className="form-control items-search-box"
							placeholder={"Digite o nome do bairro da entrega"}
							onChange={this.searchItem}
						/>
						<div className="input-group-append">
							<span className="input-group-text items-search-box-icon">
								<i className="si si-magnifier" />
							</span>
						</div>
					</div>
				</div>
				<div className="bg-grey-light mt-20">
					{!this.state.searching && (
						<div className="px-5">
							{!data.recommended ? (
								<ContentLoader
									height={480}
									width={400}
									speed={1.2}
									primaryColor="#f3f3f3"
									secondaryColor="#ecebeb"
								>
									<rect x="10" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="22" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="168" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="193" rx="0" ry="0" width="79" height="18" />

									<rect x="10" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="10" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="10" y="443" rx="0" ry="0" width="79" height="18" />

									<rect x="212" y="272" rx="4" ry="4" width="185" height="137" />
									<rect x="212" y="418" rx="0" ry="0" width="119" height="18" />
									<rect x="212" y="443" rx="0" ry="0" width="79" height="18" />
								</ContentLoader>
							) : null}
							{data.recommended && data.recommended.length > 0 && (
								<h3 className="px-10 py-10 recommended-text mb-0">
									{localStorage.getItem("itemsPageRecommendedText")}
								</h3>
							)}

							<div
								className={
									localStorage.getItem("recommendedLayoutV2") === "true"
										? "product-slider"
										: "row m-0"
								}
							>
								{!data.recommended
									? null
									: data.recommended.map((item) => (
											<RecommendedItems
												restaurant={restaurant}
												shouldUpdate={this.state.update}
												update={this.forceStateUpdate}
												product={item}
												addProduct={addProduct}
												removeProduct={removeProduct}
												key={item.id}
											/>
									  ))}
							</div>
						</div>
					)}
					{data.items &&
						Object.keys(data.items).map((category, index) => (
							<div key={category} id={category + index}>
								{/* <Collapsible trigger={category} open={true}> */}
								<Collapsible
									trigger={category}
									open={
										index === 0
											? true
											: localStorage.getItem("expandAllItemMenu") === "true"
											? true
											: this.props.menuClicked
									}
								>
									{data.items[category].map((item) => (
										<React.Fragment key={item.id}>
											<span className="hidden">{(item.quantity = 1)}</span>
											<div
												className="category-list-item"
												style={{
													display: "flex",
													justifyContent: "space-between",
												}}
											>
												{item.image !== "" && (
													<LazyLoad>
														<Link to={restaurant.slug + "/" + item.id}>
															<React.Fragment>
																{cartProducts.find((cp) => cp.id === item.id) !==
																	undefined && (
																	<React.Fragment>
																		<div className="position-realtive">
																			<div
																				className="quantity-badge-list"
																				style={{
																					backgroundColor: localStorage.getItem(
																						"storeColor"
																					),
																				}}
																			>
																				<span>
																					{item.addon_categories.length ? (
																						<React.Fragment>
																							<i
																								className="si si-check"
																								style={{
																									lineHeight:
																										"1.3rem",
																								}}
																							/>
																						</React.Fragment>
																					) : (
																						<React.Fragment>
																							{
																								cartProducts.find(
																									(cp) =>
																										cp.id ===
																										item.id
																								).quantity
																							}
																						</React.Fragment>
																					)}
																				</span>
																			</div>
																		</div>
																	</React.Fragment>
																)}

																{/* <Fade duration={500}> */}
																
																{/* </Fade> */}
															</React.Fragment>
														</Link>
													</LazyLoad>
												)}
												<div
													className={
														item.image !== "" ? "flex-item-name" : "flex-item-name ml-0"
													}
												>
													{localStorage.getItem("showVegNonVegBadge") === "true" &&
														item.is_veg !== null && (
															<React.Fragment>
																{item.is_veg ? (
																	<img
																		src="/assets/img/various/veg-icon.png"
																		alt="Veg"
																		style={{ width: "1rem" }}
																		className="mr-1"
																	/>
																) : (
																	<img
																		src="/assets/img/various/non-veg-icon.png"
																		alt="Non-Veg"
																		style={{ width: "1rem" }}
																		className="mr-1"
																	/>
																)}
															</React.Fragment>
														)}
													<span className="item-name">{item.name}</span>{" "}
													{item.desc !== null ? (
														<React.Fragment>
															<br />
															<ShowMore
																lines={1}
																more={localStorage.getItem("showMoreButtonText")}
																less={localStorage.getItem("showLessButtonText")}
																anchorclassName="show-more ml-1"
															>
																<div
																	dangerouslySetInnerHTML={{
																		__html: item.desc,
																	}}
																/>
															</ShowMore>
														</React.Fragment>
													) : (
														<br />
													)}
													<span className="item-price">
														{localStorage.getItem("hidePriceWhenZero") === "true" &&
														item.price === "0.00" ? null : (
															<React.Fragment>
																{item.old_price > 0 && (
																	<span className="strike-text mr-1">
																		{" "}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"left" &&
																			localStorage.getItem("currencyFormat")}{" "}
																		{item.old_price}
																		{localStorage.getItem("currencySymbolAlign") ===
																			"right" &&
																			localStorage.getItem("currencyFormat")}
																	</span>
																)}

																<span>
																	{localStorage.getItem("currencySymbolAlign") ===
																		"left" &&
																		localStorage.getItem("currencyFormat")}{" "}
																	{item.price}
																	{localStorage.getItem("currencySymbolAlign") ===
																		"right" &&
																		localStorage.getItem("currencyFormat")}
																</span>

																{item.old_price > 0 &&
																localStorage.getItem("showPercentageDiscount") ===
																	"true" ? (
																	<React.Fragment>
																		<p
																			className="price-percentage-discount mb-0"
																			style={{
																				color: localStorage.getItem(
																					"cartColorBg"
																				),
																			}}
																		>
																			{parseFloat(
																				((parseFloat(item.old_price) -
																					parseFloat(item.price)) /
																					parseFloat(item.old_price)) *
																					100
																			).toFixed(0)}
																			{localStorage.getItem(
																				"itemPercentageDiscountText"
																			)}
																		</p>
																	</React.Fragment>
																) : (
																	<br />
																)}
															</React.Fragment>
														)}
														{item.addon_categories.length > 0 && (
															<React.Fragment>
																<span
																	className="ml-2 customizable-item-text"
																	style={{
																		color: localStorage.getItem("storeColor"),
																	}}
																>
																	{localStorage.getItem("customizableItemText")}
																</span>
																<br />
															</React.Fragment>
														)}
													</span>
													<ItemBadge item={item} />
												</div>

												<div className="item-actions pull-right pb-0 mt-10">
													<div
														className="btn-group btn-group-sm"
														role="group"
														aria-label="btnGroupIcons1"
													>
														{item.is_active ? (
															<React.Fragment>
																{item.addon_categories.length ? (
																	<button
																		disabled
																		type="button"
																		className="btn btn-add-remove"
																		style={{
																			color: localStorage.getItem("cartColor-bg"),
																		}}
																	>
																		<span className="btn-dec">-</span>
																		<Ink duration="500" />
																	</button>
																) : (
																	<button
																		type="button"
																		className="btn btn-add-remove"
																		style={{
																			color: localStorage.getItem("cartColor-bg"),
																		}}
																		onClick={() => {
																			item.quantity = 1;
																			removeProduct(item);
																			this.forceStateUpdate();
																		}}
																	>
																		<span className="btn-dec">-</span>
																		<Ink duration="500" />
																	</button>
																)}

																{item.addon_categories.length ? (
																	<Customization
																		product={item}
																		addProduct={addProduct}
																		forceUpdate={this.forceStateUpdate}
																	/>
																) : (
																	<button
																		type="button"
																		className="btn btn-add-remove"
																		style={{
																			color: localStorage.getItem("cartColor-bg"),
																		}}
																		onClick={() => {
																			addProduct(item);
																			this.forceStateUpdate();
																		}}
																	>
																		<span className="btn-inc">+</span>
																		<Ink duration="500" />
																	</button>
																)}
															</React.Fragment>
														) : (
															<div className="text-danger text-item-not-available">
																{localStorage.getItem("cartItemNotAvailable")}
															</div>
														)}
													</div>
												</div>
											</div>
										</React.Fragment>
									))}
								</Collapsible>
							</div>
						))}
					<div className="mb-50" />
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	cartProducts: state.cart.products,
});

export default connect(
	mapStateToProps,
	{ addProduct, removeProduct, searchItem, clearSearch }
)(ItemList);
