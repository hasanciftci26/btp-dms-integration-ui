sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, JSONModel, Fragment, syncStyleClass, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.ntt.dmsintegrationui.controller.Homepage", {
            onValueHelpRequested: function () {
                let oView = this.getView();

                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.ntt.dmsintegrationui.fragments.RepositoryValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        syncStyleClass("sapUiSizeCompact", oView, oDialog);
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._oValueHelpDialog.then(function (oDialog) {
                    this._getRepositories();
                    oDialog.open();
                }.bind(this));
            },
            onSearchValueHelp: function (oEvent) {
                let sValue = oEvent.getParameter("value"),
                    oFilter = new Filter({
                        filters: [
                            new Filter({
                                path: "repositoryId",
                                operator: FilterOperator.Contains,
                                value1: sValue
                            }),
                            new Filter({
                                path: "repositoryName",
                                operator: FilterOperator.Contains,
                                value1: sValue
                            }),
                            new Filter({
                                path: "rootFolderId",
                                operator: FilterOperator.Contains,
                                value1: sValue
                            })
                        ],
                        and: false
                    }),
                    oBinding = oEvent.getSource().getBinding("items");

                oBinding.filter([oFilter]);
            },
            onValueSelected: function (oEvent) {
                let iSelectedIndex = parseInt(oEvent.getParameter("selectedItem").getBindingContextPath().split("/")[1]),
                    oSelectedObject = this.getView().getModel("repositoryModel").getData()[iSelectedIndex];

                this.getView().byId("inpRepository").setValue(oSelectedObject.repositoryId);
                this.getView().byId("txtRepositoryName").setText(oSelectedObject.repositoryName);
                this.getView().byId("txtRootFolderId").setText(oSelectedObject.rootFolderId);
            },
            onRepositorySuggSelected: function (oEvent) {
                let iSelectedIndex = parseInt(oEvent.getParameter("selectedRow").getBindingContextPath().split("/")[1]),
                    oSelectedObject = this.getView().getModel("repositoryModel").getData()[iSelectedIndex];

                this.getView().byId("inpRepository").setValue(oSelectedObject.repositoryId);
                this.getView().byId("txtRepositoryName").setText(oSelectedObject.repositoryName);
                this.getView().byId("txtRootFolderId").setText(oSelectedObject.rootFolderId);
            },
            onNavToRepository: function () {
                this.getRouter().navTo("RouteRepository", {
                    repositoryId: this.getView().byId("inpRepository").getValue(),
                    rootFolderId: this.getView().byId("txtRootFolderId").getText()
                });
            },
            
            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            
            _getRepositories: function () {
                if (!this.getView().getModel("repositoryModel")) {
                    $.ajax({
                        url: "/browser",
                        method: "GET",
                        async: true,
                        success: (oData) => {
                            let aRepositories = [];

                            for (const repo in oData) {
                                let oRepository = {
                                    repositoryId: oData[repo].repositoryId,
                                    repositoryName: oData[repo].repositoryName,
                                    rootFolderId: oData[repo].rootFolderId
                                };
                                aRepositories.push(oRepository);
                            }

                            let oRepoModel = new JSONModel(aRepositories);
                            this.getView().setModel(oRepoModel, "repositoryModel");
                        },
                        error: (error) => {
                            MessageBox.error("Error while fetching the repositories from DMS!");
                            let oRepoModel = new JSONModel([{
                                repositoryId: "test",
                                repositoryName: "test",
                                rootFolderId: "test"
                            }, {
                                repositoryId: "hasan",
                                repositoryName: "test",
                                rootFolderId: "qw"
                            }]);
                            this.getView().setModel(oRepoModel, "repositoryModel");
                        }
                    });
                }
            }
        });
    });
