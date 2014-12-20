/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons')
,   Backdrop = require('./Backdrop.jsx')
,   OnScreenKeyboard = require('./OnScreenKeyboard.jsx');


module.exports = React.createClass({
    getDefaultProps: function() {
    return {
            navable: false,
            backdrop: false,
            classList: "container ignition-modal systemNotificationContent",
            children: [],
            input: null,
            columns: "col-xs-12"
        }
    },

    componentDidMount: function() {

        if (this.props.backdrop) {
            var main = document.getElementById("main");
            main.classList.add("opacity-50");
        }

    },

    render: function() {

        return (


            <div>

                <div className={this.props.classList} id={this.props.id}>
                    {this.props.children}
                </div>

            </div>
        );
    }
});
