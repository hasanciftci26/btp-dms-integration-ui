sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.ntt.dmsintegrationui.controller.Repository", {
            onInit: function () {
                this.getRouter().getRoute("RouteRepository").attachPatternMatched(this._onObjectMatched, this);
            },

            onComponentCreated: function (oEvent) {
                this._oDocumentTable = oEvent.getParameter("component");
                this._oDocumentTable.requestNavigationAndOpen(this._sRepositoryId, this._sRootFolderId);
            },
            onNavToHomepage: function () {
                this.getRouter().navTo("RouteHomepage");
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */

            _onObjectMatched: function (oEvent) {
                let sRepositoryId = oEvent.getParameter("arguments").repositoryId,
                    sRootFolderId = oEvent.getParameter("arguments").rootFolderId;

                this._sRepositoryId = sRepositoryId;
                this._sRootFolderId = sRootFolderId;
                this._changeRepository();
            },
            _changeRepository: function () {
                if (this._oDocumentTable) {
                    this._oDocumentTable.requestNavigationAndOpen(this._sRepositoryId, this._sRootFolderId);
                }
            }
        });
    });
