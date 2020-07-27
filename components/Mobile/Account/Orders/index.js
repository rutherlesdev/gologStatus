import React, { Component } from "react";
import { cancelOrder, getOrders } from "../../../../services/orders/actions";

import BackWithSearch from "../../Elements/BackWithSearch";
import ContentLoader from "react-content-loader";
import OrderList from "./OrderList";
import { Redirect } from "react-router";
import { connect } from "react-redux";

class Orders extends Component {
    state = {
        no_orders: false,
        cancelSuccess: false
    };

    componentDidMount() {
        const { user } = this.props;
        if (user.success) {
            this.props.getOrders(user.data.auth_token, user.data.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.orders.length === 0) {
            this.setState({ no_orders: true });
        }

        if (this.props.cancel !== nextProps.cancel) {
            //call to handle afterCancellation from parent

            if (nextProps.cancel.success) {
                this.setState({ cancelSuccess: true });
                const { user } = this.props;
                if (user.success) {
                    this.props.getOrders(user.data.auth_token, user.data.id);
                }
            }
        }
    }

    render() {
        if (window.innerWidth > 768) {
            return <Redirect to="/" />;
        }
        const { user, orders } = this.props;
        if (localStorage.getItem("storeColor") === null) {
            return <Redirect to={"/"} />;
        }
        if (!user.success) {
            return <Redirect to={"/login"} />;
        }
        return (
            <React.Fragment>
                <BackWithSearch
                    boxshadow={true}
                    has_title={true}
                    title={localStorage.getItem("accountMyOrders")}
                    disable_search={true}
                    goto_accounts_page={true}
                />
                {this.state.cancelSuccess && (
                    <div className="auth-error cancel-success">
                        <div className="">{localStorage.getItem("orderCancelledText")}</div>
                    </div>
                )}
                <div className="block-content block-content-full pt-80 pb-80 height-100-percent px-15">
                    {orders.length === 0 && !this.state.no_orders && (
                        <ContentLoader height={600} width={400} speed={1.2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
                            <rect x="0" y="0" rx="0" ry="0" width="75" height="22" />
                            <rect x="0" y="30" rx="0" ry="0" width="350" height="18" />
                            <rect x="0" y="60" rx="0" ry="0" width="300" height="18" />
                            <rect x="0" y="90" rx="0" ry="0" width="100" height="18" />

                            <rect x="0" y={0 + 170} rx="0" ry="0" width="75" height="22" />
                            <rect x="0" y={30 + 170} rx="0" ry="0" width="350" height="18" />
                            <rect x="0" y={60 + 170} rx="0" ry="0" width="300" height="18" />
                            <rect x="0" y={90 + 170} rx="0" ry="0" width="100" height="18" />

                            <rect x="0" y={0 + 340} rx="0" ry="0" width="75" height="22" />
                            <rect x="0" y={30 + 340} rx="0" ry="0" width="350" height="18" />
                            <rect x="0" y={60 + 340} rx="0" ry="0" width="300" height="18" />
                            <rect x="0" y={90 + 340} rx="0" ry="0" width="100" height="18" />
                        </ContentLoader>
                    )}
                    {orders.length === 0 && <div className="text-center mt-50 font-w600 text-muted">{localStorage.getItem("noOrdersText")}</div>}
                    {orders.map(order => (
                        <OrderList key={order.id} order={order} user={user} cancelOrder={this.props.cancelOrder} cancel={this.props.cancel} />
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    orders: state.orders.orders,
    cancel: state.orders.cancel
});

export default connect(
    mapStateToProps,
    { getOrders, cancelOrder }
)(Orders);
