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
	//let date = new Date(2023, 3, 16)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var date2 = new Date(new Date().setDate(date.getDate() + 1));
	var year2 = date2.getFullYear();
	var month2 = date2.getMonth() + 1;
	var day2 = date2.getDate();
	if (day2 < 10) day2 = "0" + day2;
	if (month2 < 10) month2 = "0" + month2;

	var today = year + "-" + month + "-" + day;
	var tomorow = year2 + "-" + month2 + "-" + day2;

	var _useState = useState(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    foreignRefetch = _useState2[0],
	    setForeignRefetch = _useState2[1];

	/* API FETCHING */


	var urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/";

	var todayQuery = useQuery("today", function () {
		return fetch("" + urlForeignRoot + today + ".json").then(function (res) {
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
	var tomorowQuery = useQuery("tomorow", function () {
		return fetch("" + urlForeignRoot + tomorow + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: true
	});
	/* END API FETCHING */
	var scrollContainer = useRef(null);

	var _useState3 = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0
	}),
	    _useState4 = _slicedToArray(_useState3, 2),
	    scroll = _useState4[0],
	    setScroll = _useState4[1];

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
		React.Fragment,
		null,
		todayQuery.data != undefined && Object.keys(todayQuery.data).includes("12") || tomorowQuery.data != undefined && Object.keys(tomorowQuery.data).includes("12") ? React.createElement(
			"div",
			{ className: "topScoreboard-container ms" },
			React.createElement(
				"section",
				{
					className: "topScoreboard",
					ref: scrollContainer,
					onMouseDown: mouseDownHandler,
					onMouseMove: mouseMoveHandler,
					onMouseUp: mouseUpHandler
				},
				React.createElement(
					"a",
					{
						href: "https://www.tipsport.cz/PartnerRedirectAction.do?pid=61&sid=45&bid=35610&tid=11274",
						className: "ms-logo-anchor",
						target: "_blank"
					},
					React.createElement("img", {
						src: "https://ban.tipsport.cz/c/1x1.php?pid=61&sid=45&bid=35610&tid=11274",
						alt: "",
						title: "",
						style: { width: 0, height: 0 }
					}),
					React.createElement("img", { className: "ms-logo", src: "../img/tipsport_logo.png", alt: "" })
				),
				todayQuery.data != undefined && Object.entries(todayQuery.data).map(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    key = _ref2[0],
					    value = _ref2[1];

					var isFake = value.matches.every(function (match) {
						return today != match.date;
					});
					if (key == 12 && !isFake) {
						return React.createElement(
							"section",
							{ className: "League", key: key, style: { pointerEvents: scroll.pointerEvents ? "all" : "none" } },
							React.createElement(
								"div",
								{ className: "league-name" },
								React.createElement(
									"h3",
									null,
									"MS 2023 ",
									React.createElement("br", null),
									day,
									". ",
									month,
									"."
								),
								React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
							),
							value.matches.map(function (match) {
								var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.logo_id;
								var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.logo_id;
								if (today == match.date) {
									return React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "league-match", key: match.onlajny_id },
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
				}),
				tomorowQuery.data != undefined && Object.entries(tomorowQuery.data).map(function (_ref3) {
					var _ref4 = _slicedToArray(_ref3, 2),
					    key = _ref4[0],
					    value = _ref4[1];

					var isFake = value.matches.every(function (match) {
						return tomorow != match.date;
					});
					if (key == 12 && !isFake) {
						return React.createElement(
							"section",
							{ className: "League", key: key, style: { pointerEvents: scroll.pointerEvents ? "all" : "none" } },
							React.createElement(
								"div",
								{ className: "league-name" },
								React.createElement(
									"h3",
									null,
									"MS 2023 ",
									React.createElement("br", null),
									day2,
									". ",
									month2,
									"."
								),
								React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
							),
							value.matches.map(function (match) {
								var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.logo_id;
								var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.logo_id;
								if (tomorow == match.date) {
									return React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "league-match", key: match.onlajny_id },
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
			)
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