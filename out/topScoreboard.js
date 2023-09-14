var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useRef = _React.useRef;


var queryClientTop = new QueryClient();

var TopScoreboard = function TopScoreboard(props) {
	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var APIDate = year + "-" + month + "-" + day;

	var _useState = useState(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    czechRefetch = _useState2[0],
	    setCzechRefetch = _useState2[1];

	var _useState3 = useState(false),
	    _useState4 = _slicedToArray(_useState3, 2),
	    foreignRefetch = _useState4[0],
	    setForeignRefetch = _useState4[1];

	/* API FETCHING */


	var urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/";
	var urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/";

	var foreignQuery = useQuery("foreign", function () {
		return fetch("" + urlForeignRoot + APIDate + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			return setForeignRefetch(5000);
		},
		onError: function onError(res) {
			return setForeignRefetch(false);
		}
	});
	var czechQuery = useQuery("czech", function () {
		return fetch("" + urlCzechRoot + APIDate + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			return setCzechRefetch(5000);
		},
		onError: function onError(res) {
			return setCzechRefetch(false);
		}
	});
	/* END API FETCHING */
	var scrollContainer = useRef(null);

	var _useState5 = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0
	}),
	    _useState6 = _slicedToArray(_useState5, 2),
	    scroll = _useState6[0],
	    setScroll = _useState6[1];

	var mouseDownHandler = function mouseDownHandler(e) {
		scrollContainer.current.style.cursor = "grabbing";
		scrollContainer.current.style.userSelect = "none";
		setScroll({
			pointerEvents: true,
			isScrolling: true,
			left: scrollContainer.current.scrollLeft,
			x: e.clientX
		});
	};
	var mouseMoveHandler = function mouseMoveHandler(e) {
		e.stopPropagation();
		if (scroll.isScrolling) {
			setScroll(Object.assign({}, scroll, { pointerEvents: false }));
			var dx = e.clientX - scroll.x;
			scrollContainer.current.scrollLeft = scroll.left - dx;
		}
	};
	var mouseUpHandler = function mouseUpHandler(e) {
		scrollContainer.current.style.cursor = "grab";
		scrollContainer.current.style.removeProperty("user-select");
		setScroll(Object.assign({}, scroll, { isScrolling: false, pointerEvents: true }));
		e.stopPropagation();
	};

	return React.createElement(
		"div",
		{ className: "topScoreboard-container" },
		foreignQuery.isSuccess || czechQuery.isSuccess ? React.createElement(
			"section",
			{
				className: "topScoreboard",
				ref: scrollContainer,
				onMouseDown: mouseDownHandler,
				onMouseMove: mouseMoveHandler,
				onMouseUp: mouseUpHandler
			},
			czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				var render = false;
				var priority = void 0;
				var leagueName = void 0;
				Object.entries(scoreboardLeagues).map(function (value) {
					if (value[1].id == key) {
						priority = value[1].priority;
						leagueName = value[1].name.split(" ");
						if (value[1].sourceOnlajny === false) {
							if (typeof shownLeagues != "undefined") {
								shownLeagues.forEach(function (league) {
									if (league == key) {
										render = true;
									}
								});
							} else {
								render = true;
							}
						}
					}
				});
				if (render) {
					//let leagueName = value.league_name.split(" ")
					return React.createElement(
						"section",
						{ className: "League", key: key, style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" } },
						React.createElement(
							"div",
							{ className: "league-name" },
							React.createElement(
								"h3",
								null,
								leagueName.map(function (word, index) {
									if (index == Math.ceil(leagueName.length / 2)) {
										return "\n" + word + " ";
									} else {
										return word + " ";
									}
								})
							),
							React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
						),
						value.matches.map(function (match, index) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
							return React.createElement(
								"a",
								{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "league-match", key: index },
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
				}
			}),
			foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref3) {
				var _ref4 = _slicedToArray(_ref3, 2),
				    key = _ref4[0],
				    value = _ref4[1];

				var render = false;
				var priority = void 0;
				var leagueName = void 0;
				Object.entries(scoreboardLeagues).map(function (value) {
					if (value[1].id == key) {
						priority = value[1].priority;
						leagueName = value[1].name.split(" ");
						if (value[1].sourceOnlajny === true) {
							if (typeof shownLeagues != "undefined") {
								shownLeagues.forEach(function (league) {
									if (league == key) {
										render = true;
									}
								});
							} else {
								render = true;
							}
						}
					}
				});
				if (value.matches.some(function (match) {
					return match.date == APIDate;
				}) && render && value.league_name != "NHL") {
					//let leagueName = value.league_name.split(" ")
					return React.createElement(
						"section",
						{ className: "League", key: key, style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" } },
						React.createElement(
							"div",
							{ className: "league-name" },
							React.createElement(
								"h3",
								null,
								leagueName.map(function (word, index) {
									if (index == Math.ceil(leagueName.length / 2) && isNaN(word)) {
										return "\n" + word + " ";
									} else {
										return word + " ";
									}
								})
							),
							React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
						),
						value.matches.map(function (match, index) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.logo_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.logo_id;
							if (APIDate == match.date) {
								return React.createElement(
									"a",
									{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "league-match", key: index },
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
							}
						})
					);
				}
			})
		) : ""
	);
};

var Render = function Render() {
	return React.createElement(
		QueryClientProvider,
		{ client: queryClientTop },
		React.createElement(TopScoreboard, null)
	);
};

var domContainer = document.querySelector("#top-scoreboard");
ReactDOM.render(React.createElement(Render), domContainer);
/* ReactDOM.createRoot(domContainer).render(<Render />) */