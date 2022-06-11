var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var topScoreboard = function topScoreboard(props) {
	var _React = React,
	    useState = _React.useState,
	    useEffect = _React.useEffect;

	var _useState = useState(),
	    _useState2 = _slicedToArray(_useState, 2),
	    czechLeagueData = _useState2[0],
	    setCzechLeagueData = _useState2[1];

	var _useState3 = useState(),
	    _useState4 = _slicedToArray(_useState3, 2),
	    foreignLeagueData = _useState4[0],
	    setForeignLeagueData = _useState4[1];

	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var _useState5 = useState(year + "-" + month + "-" + day),
	    _useState6 = _slicedToArray(_useState5, 2),
	    APIDate = _useState6[0],
	    setAPIDate = _useState6[1];

	var _useState7 = useState(false),
	    _useState8 = _slicedToArray(_useState7, 2),
	    noDataCzech = _useState8[0],
	    setNoDataCzech = _useState8[1];

	var _useState9 = useState(false),
	    _useState10 = _slicedToArray(_useState9, 2),
	    noDataForeign = _useState10[0],
	    setNoDataForeign = _useState10[1];

	/* API FETCHING */


	var urlForeignRoot = "http://hokej.cz.s3.amazonaws.com/scoreboard/onlajny/";
	var urlCzechRoot = "http://hokej.cz.s3.amazonaws.com/scoreboard/";

	var config = {
		taskForeignUrl: "" + urlForeignRoot + APIDate + ".json",
		taskCzechUrl: "" + urlCzechRoot + APIDate + ".json"
	};

	var fetchCzechData = function fetchCzechData() {
		fetch(config.taskCzechUrl).then(function (response) {
			return response.json();
		}).then(function (data) {
			setCzechLeagueData(Object.entries(data));
			setNoDataCzech(false);
		}).catch(function (error) {
			setNoDataCzech(true);
			console.log(error);
		});
	};
	var fetchForeignData = function fetchForeignData() {
		fetch(config.taskForeignUrl).then(function (response) {
			return response.json();
		}).then(function (data) {
			setForeignLeagueData(Object.entries(data));
			setNoDataForeign(false);
		}).catch(function (error) {
			setNoDataForeign(true);
			console.log(error);
		});
	};

	useEffect(function () {
		fetchCzechData();
		fetchForeignData();
	}, []);
	/* END API FETCHING */
	return React.createElement(
		"div",
		{ className: "topScoreboard-container" },
		!noDataCzech || !noDataForeign ? React.createElement(
			"section",
			{ className: "topScoreboard" },
			czechLeagueData != undefined && czechLeagueData.map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				return React.createElement(
					"section",
					{ className: "League" },
					React.createElement(
						"a",
						{ href: "", className: "league-name" + (value.league_name.length > 14 ? " set-width" : "") },
						React.createElement(
							"h3",
							null,
							value.league_name
						),
						React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
					),
					value.matches.map(function (match) {
						var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
						var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
						return React.createElement(
							"a",
							{ href: "", className: "league-match" },
							React.createElement(
								"div",
								{ className: "league-team" },
								React.createElement(
									"div",
									{ className: "team-container" },
									React.createElement("img", { src: homeLogo, alt: "" }),
									React.createElement(
										"p",
										{ className: "team-name" },
										match.home.shortcut
									)
								),
								React.createElement(
									"div",
									{
										className: "team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
									},
									match.score_home
								)
							),
							React.createElement(
								"div",
								{ className: "league-team" },
								React.createElement(
									"div",
									{ className: "team-container" },
									React.createElement("img", { src: visitorsLogo, alt: "" }),
									React.createElement(
										"p",
										{ className: "team-name" },
										match.visitor.shortcut
									)
								),
								React.createElement(
									"div",
									{
										className: "team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
									},
									match.score_visitor
								)
							)
						);
					})
				);
			}),
			foreignLeagueData != undefined && foreignLeagueData.map(function (_ref3) {
				var _ref4 = _slicedToArray(_ref3, 2),
				    key = _ref4[0],
				    value = _ref4[1];

				return React.createElement(
					"section",
					{ className: "League" },
					React.createElement(
						"a",
						{ href: "", className: "league-name" + (value.league_name.length > 10 ? " set-width" : "") },
						React.createElement(
							"h3",
							null,
							value.league_name
						),
						React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
					),
					value.matches.map(function (match) {
						var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
						var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
						return React.createElement(
							"a",
							{ href: "", className: "league-match" },
							React.createElement(
								"div",
								{ className: "league-team" },
								React.createElement(
									"div",
									{ className: "team-container" },
									React.createElement("img", { src: homeLogo, alt: "" }),
									React.createElement(
										"p",
										{ className: "team-name" },
										match.home.shortcut
									)
								),
								React.createElement(
									"div",
									{
										className: "team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
									},
									match.score_home
								)
							),
							React.createElement(
								"div",
								{ className: "league-team" },
								React.createElement(
									"div",
									{ className: "team-container" },
									React.createElement("img", { src: visitorsLogo, alt: "" }),
									React.createElement(
										"p",
										{ className: "team-name" },
										match.visitor.shortcut
									)
								),
								React.createElement(
									"div",
									{
										className: "team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
									},
									match.score_visitor
								)
							)
						);
					})
				);
			})
		) : console.log("Top Scoreboard: NO DATA")
	);
};

var domContainer = document.querySelector("#top-scoreboard");
ReactDOM.render(React.createElement(topScoreboard), domContainer);