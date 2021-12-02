import React, { Component, useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import { fetch } from "ipfs-utils/src/http/fetch.node";


class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          newBaseURI: "",
          baseURI: props.baseURI ? props.baseURI : ''
        };
      }

    callUpdateTokenUriFromApp = (e) => {
        e.preventDefault();
        this.props.setBaseURI(
            this.state.newBaseURI
        );
    };

    render() {
        return (
            <div>        
                <div className="card mt-1">
                    <div className="card-body align-items-center d-flex justify-content-center">
                         <h5>Easly Manage your SmartContract</h5>
                    </div>
                </div>
                <form onSubmit={this.callUpdateTokenUriFromApp} className="pt-4 mt-1">
                    <div className="row">
                        <div className="col-md-6">
                                    <h5>
                                        Set Token URI
                                    </h5>
                                    <div>
                                        <label htmlFor="BaseURI">New URI Path</label>
                                        <input
                                        required
                                        type="text"
                                        name="BaseURI"
                                        id="newBaseURI"
                                        defaultValue={this.state.baseURI}
                                        className="form-control"
                                        onChange={(e) =>
                                            this.setState({ newBaseURI: e.target.value })
                                        }
                                        />
                                    </div>
                                    <button
                                        id="baseURIbtn"
                                        style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                                        type="submit"
                                        className="btn mt-4 btn-block btn-outline-primary"
                                    >
                                        Update 
                                    </button>
                                </div>  
                            </div>
                </form>
            </div>
        );
    }
}


export default AdminDashboard;
