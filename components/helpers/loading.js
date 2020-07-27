import React, { Component } from "react";

class Loading extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="height-100 overlay-loading">
                    <div>
                        <img src="/assets/img/loading-food.gif" alt={localStorage.getItem("pleaseWaitText")} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Loading;
