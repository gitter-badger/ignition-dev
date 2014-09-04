/**
 * @jsx React.DOM
 */

var React = require('react/addons'),
    Activity = require('./Activity.jsx'),
    _ = require('lodash'),
    moment = require('moment');


module.exports = React.createClass({

    getDefaultProps: function() {

    return {
            activities: [],
            navable: true,
            navStack: 2,
            icon: "ion-ios7-people ",
            functionCall: "highlightPanel",
            functionParams: "panel_activity",
            classString: "slide col-md-4",
            stackLength: 4,
            actionSet: [],
            id: "recent_activity",
            title: "Recent Activity",
            items: [],
        }
    },

    render: function() {

        var actionSet = this.props.actionSet;

        var activityNodes = this.props.activities.map(function (activity, i) {
          return <Activity actionSet={actionSet} key={i.id} navStack={i+1} username={activity.username} action={activity.activity} game={activity.game} timestamp={ moment(activity.timestamp, "YYYYMMDDhhmms").fromNow() } />
        });

        return (

            <div className={this.props.classString} id={this.props.id}>
                <table className="table navable" data-function={this.props.functionCall} data-parameters={this.props.functionParams} id="panel_activity">
                    <thead>
                        <th>
                            <h4> <i className={this.props.icon}></i></h4>
                        </th>

                        <th colSpan='2'>
                          <h4 className="text-right">{this.props.title}</h4>
                        </th>
                    </thead>
                        
                   { activityNodes } 
                                          
                    </table>
                </div>              
         
        );
    }
});


