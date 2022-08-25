var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState;


var queryClient = new QueryClient();

var TopScoreboard = function TopScoreboard(props) {
	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var _useState = useState(year + "-" + month + "-" + day),
	    _useState2 = _slicedToArray(_useState, 2),
	    APIDate = _useState2[0],
	    setAPIDate = _useState2[1];

	var _useState3 = useState(false),
	    _useState4 = _slicedToArray(_useState3, 2),
	    czechRefetch = _useState4[0],
	    setCzechRefetch = _useState4[1];

	var _useState5 = useState(false),
	    _useState6 = _slicedToArray(_useState5, 2),
	    foreignRefetch = _useState6[0],
	    setForeignRefetch = _useState6[1];

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
	return React.createElement(
		"div",
		{ className: "topScoreboard-container" },
		foreignQuery.isSuccess || czechQuery.isSuccess ? React.createElement(
			"section",
			{ className: "topScoreboard" },
			czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    key = _ref2[0],
				    value = _ref2[1];

				return React.createElement(
					"section",
					{ className: "League", key: key },
					React.createElement(
						"div",
						{ className: "league-name" + (value.league_name.length > 14 ? " set-width" : "") },
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
							{ href: "/zapas/" + match.hokejcz_id + "/", className: "league-match", key: match.hokejcz_id },
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
			foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref3) {
				var _ref4 = _slicedToArray(_ref3, 2),
				    key = _ref4[0],
				    value = _ref4[1];

				if (value.matches.some(function (match) {
					return match.date == APIDate;
				})) {
					return React.createElement(
						"section",
						{ className: "League", key: key },
						React.createElement(
							"div",
							{ className: "league-name" + (value.league_name.length > 10 ? " set-width" : "") },
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
							if (APIDate == match.date) {
								return React.createElement(
									"a",
									{ href: "/zapas/" + match.hokejcz_id + "/", className: "league-match", key: match.hokejcz_id },
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
		{ client: queryClient },
		React.createElement(TopScoreboard, null)
	);
};

var domContainer = document.querySelector("#top-scoreboard");
ReactDOM.render(React.createElement(Render), domContainer);
/* ReactDOM.createRoot(domContainer).render(<Render />) */