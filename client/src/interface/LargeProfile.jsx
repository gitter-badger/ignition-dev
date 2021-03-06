/**
 * @jsx React.DOM
 */

/* TODO: Get event listener to update state correctly on newly stored games.
-------------------------------------------------- */

'use strict';

var React               = require('react/addons'),
    api                 = require('socket.io-client')('/api'),
    _                   = require('lodash'),
    SaveStates          = require('./SaveStates.jsx'),
    AchievementList     = require('./AchievementList.jsx'),
    AchievementNodes    = require('./AchievementNodes.jsx'),
    mixins              = require('./mixins/mixins.jsx'),
    achieved            = 0,
    achievementsLen     = 0,
    launchContext       = {},
    _path;

module.exports = React.createClass({

    mixins: [mixins.listener, mixins.screenMount],

    getInitialState: function() {

        return {

            "id":             "",
            "title":          "",
            "genre":          "",
            "image":          "",
            "filepath":       "",
            "developer":      "",
            "description":    "",
            "boxart":         "",
            "playtime":       "Never Played",

            "rating":         {},
            "gameInfo":       {},
            "updateGame":     {},
            "esrb_rating":    {},

            "gamesList":      [],
            "platforms":      [],

            "savestates": [{"slot": 1, "time": "1/12/1 1pm", "path": "/root/software/saves/null.srm"}],

            "crc32":          null,

            "favorite":       false

        };
    },

    getDefaultProps: function() {
        return {
            "screen": "Profile"
        };
    },

    screenMount: function() {
        this.favoriteCheck();
    },

    favoriteCheck: function(obj) {

        var component = this;

        var path = 'http://127.0.0.1:1210/database/favorites';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var data      = xmlhttp.responseText;
                var favorites = JSON.parse(data);

                if (_.where(favorites, { 'long': component.state.title}).length) {
                    component.setState({'favorite': true});
                    component.forceUpdate();
                }

                else {
                    component.setState({'favorite': false});
                    component.forceUpdate();
                }

            }
        };

        xmlhttp.open("GET",path,true);
        xmlhttp.send();

        return;
    },

    componentDidMount: function () {

        var component = this;

        window.addEventListener('updateGame', function eventHandler(e) {
            component.setState(e.detail);
        });

        document.addEventListener('toggleFavorite', function eventHandler(e) {
            component.favoriteCheck(e.detail);
        });

        document.addEventListener('launchContext', function eventHandler(e) {

            launchContext = e.detail;
            launchContext.title = component.state.title;

            launchContext = JSON.stringify(launchContext);

            component.forceUpdate();

            setTimeout(function() {

                var path = 'http://127.0.0.1:1210/database/favorites';

                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange=function() {

                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                        var data = xmlhttp.responseText;

                        var JSONified = JSON.parse(data);

                        if (_.contains(JSONified[0], component.state.title)) {
                            component.setState({favorite: true});
                        }

                        else {
                            component.setState({favorite: false});
                        }

                    }
                };

                xmlhttp.open("GET",path,true);
                xmlhttp.send();

                return;
            }, 500);


        });


     },

    render: function() {

        achieved        = 0;
        achievementsLen = 0;

        // api.emit('request', { request: 'listSaveStates', param: this.props.Username});

        try {
            _path = JSON.parse(launchContext).filepath;

        }
        catch (e) {}


        var saveNodes = this.state.savestates.map(function (state, i) {
            return <SaveStates filename={_path} image={state.image} slot={state.slot} navStack={i+1} />
        });

        // if (this.state.crc32 && this.state.crc32 != "null") {
        //
        //     var achievementNodes = this.state.crc32[0].Achievements.map(function (achievement, i) {
        //         return <AchievementList title={achievement.title} description={achievement.description} navStack={i+1} />
        //     });
        //
        //     achievementsLen = this.state.crc32[0].Achievements.length;
        //     achieved = document.querySelectorAll(".achieved").length;
        //
        // }



        return (

        <div id="Profile">

        <div className="container-fluid parent">

         <div className="clearfix"></div>

         <br /><br />

         <div className="col-xs-2" id="profile-boxart">


            <img src={this.state.image} className="img-responsive" />


            <ul id="profile-sub-buttons">

               <li className="hidden"><button className='btn btn-purple'><i className='fa fa-video-camera '></i> &nbsp; Live Stream</button></li>

               <li><button id="toggle-favorite" className='btn-block btn red-bg noround navable' data-selection={this.state.title} data-function={this.state.favorite ? "removeFavorite" : "addFavorite"} data-parameters={launchContext}><i className={this.state.favorite ? "ion-heart-broken" : "ion-heart"}></i> &nbsp; {this.state.favorite ? "Remove" : "Add"} favorite</button></li>
               <br />
               <li><button id="toggle-favorite" className='btn-block btn purple-bg noround navable' data-selection={this.state.title} data-function="speedRunLaunch" data-parameters={launchContext}><i className="ion-ios-stopwatch"></i> &nbsp; Speed Run</button></li>


            </ul>


        </div>

         <div className="col-xs-4" id="profile-gameinfo">

            <h2 id="profile-gametitle">{this.state.title}</h2>

            <span className='muted'>{this.state.genre}</span>

            <br />

            <div className="timer">Time Played: {this.state.playtime}</div>

            <br />

            <a id="play-game" className='btn-alt btn-lg navable defaultSelection navable-row' data-function="launchGame" data-parameters={launchContext}>Play Game</a>
            &nbsp;

            <a className='btn-alt btn-lg navable' data-function="viewFriends" data-parameters={launchContext}>Multiplayer</a>

            <a className='btn-alt btn-lg navable' data-function='softwareOptions' data-parameters={launchContext}><i className="ion-gear-a"></i></a>

         </div>

            {saveNodes}

        <div className="col-xs-9 profile-section">

            <hr className="hr-thin" />

            <h1>Achievements</h1>


             <AchievementNodes />

        </div>

         <div className="col-xs-10 profile-section hidden">

            <h1>Screenshots</h1>

         </div>

         <div className="col-xs-10 profile-section hidden">

            <h1>Description</h1>

            <br />

            <p>He's Back! And this time the evil Dr. Wily (once the supreme power in the universe) has created even more sinister robots to mount his attack. But as MegaMan, you've also grown in power and ability. Can you save mankind from the evil desires of Dr. Wily? Each of the eight empires is ruled by a different super-robot. You must defeat each enemy on his own turf, building up weapons as you go. Only after all are destroyed will you go head-on with the mastermind himself, the evil Dr. Wily. </p>

        </div>

         <div className="col-xs-10 profile-section hidden">

            <h1>Movies</h1>

         </div>

      </div>
   </div>

        )
    }
});
