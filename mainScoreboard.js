var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    createRoot = _React.createRoot;


var queryClient = new QueryClient();

var MainScoreboard = function MainScoreboard(props) {
	var days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var today = year + "-" + month + "-" + day;

	var _useState = useState(0),
	    _useState2 = _slicedToArray(_useState, 2),
	    dayClicks = _useState2[0],
	    setDayClicks = _useState2[1];

	var _useState3 = useState(days[date.getDay()]),
	    _useState4 = _slicedToArray(_useState3, 2),
	    dayName = _useState4[0],
	    setDayName = _useState4[1];

	var _useState5 = useState(day + "." + month + "." + year),
	    _useState6 = _slicedToArray(_useState5, 2),
	    displayDate = _useState6[0],
	    setDisplayDate = _useState6[1];

	var _useState7 = useState(year + "-" + month + "-" + day),
	    _useState8 = _slicedToArray(_useState7, 2),
	    APIDate = _useState8[0],
	    setAPIDate = _useState8[1];

	var prevDate = function prevDate() {
		setDayClicks(dayClicks - 1);
		setActiveLeagueTab("");

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks - 1)));
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();
		if (day < 10) day = "0" + day;
		if (month < 10) month = "0" + month;
		setDayName(days[date.getDay()]);
		setDisplayDate(day + "." + month + "." + year);
		setAPIDate(year + "-" + month + "-" + day);
	};
	var nextDate = function nextDate() {
		setDayClicks(dayClicks + 1);
		setActiveLeagueTab("");

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks + 1)));
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();
		if (day < 10) day = "0" + day;
		if (month < 10) month = "0" + month;
		setDayName(days[date.getDay()]);
		setDisplayDate(day + "." + month + "." + year);
		setAPIDate(year + "-" + month + "-" + day);
	};

	/* API FETCHING */

	var _useState9 = useState(false),
	    _useState10 = _slicedToArray(_useState9, 2),
	    czechRefetch = _useState10[0],
	    setCzechRefetch = _useState10[1];

	var _useState11 = useState(false),
	    _useState12 = _slicedToArray(_useState11, 2),
	    foreignRefetch = _useState12[0],
	    setForeignRefetch = _useState12[1];

	var _useState13 = useState(""),
	    _useState14 = _slicedToArray(_useState13, 2),
	    activeLeagueTab = _useState14[0],
	    setActiveLeagueTab = _useState14[1];

	var urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/";
	var urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/";

	var foreignQuery = useQuery(["foreign"], function () {
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
			setForeignRefetch(5000);
			setActiveLeagueTab(Object.entries(res)[0][1].league_name);
		},
		onError: function onError(res) {
			return setForeignRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});
	var czechQuery = useQuery(["czech"], function () {
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
			setCzechRefetch(5000);
			setActiveLeagueTab(Object.entries(res)[0][1].league_name);
		},
		onError: function onError(res) {
			return setCzechRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});

	useEffect(function () {
		czechQuery.refetch();
		foreignQuery.refetch();
	}, [APIDate]);

	return React.createElement(
		"section",
		{ className: "mainScoreboard" },
		foreignQuery.isLoading || czechQuery.isLoading == true ? React.createElement(
			"div",
			{ className: "loadContainer" },
			React.createElement(
				"h3",
				null,
				"Loading..."
			)
		) : "",
		React.createElement(
			"header",
			{ className: "mainScoreboard-header" },
			React.createElement(
				"div",
				{ className: "header-date" },
				React.createElement(
					"div",
					{ className: "date-dayChanger", onClick: prevDate },
					React.createElement("img", { src: "../img/ArrowLeftGrey.svg", alt: "" }),
					React.createElement(
						"h5",
						null,
						"P\u0159edchoz\xED den"
					)
				),
				React.createElement(
					"h1",
					{ className: "date-currentDay" },
					dayName,
					" ",
					displayDate
				),
				React.createElement(
					"div",
					{ className: "date-dayChanger", onClick: nextDate },
					React.createElement(
						"h5",
						null,
						"N\xE1sleduj\xEDc\xED den"
					),
					React.createElement("img", { src: "../img/ArrowRightGrey.svg", alt: "" })
				)
			),
			czechQuery.isSuccess || foreignQuery.isSuccess ? React.createElement(
				"div",
				{ className: "header-tabs" },
				czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    key = _ref2[0],
					    value = _ref2[1];

					return React.createElement(
						"div",
						{
							className: "tab-container " + (value.league_name == activeLeagueTab ? "active" : ""),
							onClick: function onClick() {
								setActiveLeagueTab(value.league_name);
							},
							key: value.league_name
						},
						React.createElement(
							"p",
							null,
							value.league_name
						)
					);
				}),
				foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref3) {
					var _ref4 = _slicedToArray(_ref3, 2),
					    key = _ref4[0],
					    value = _ref4[1];

					var isFake = value.matches.every(function (match) {
						return APIDate != match.date;
					});
					if (!isFake) {
						return React.createElement(
							"div",
							{
								className: "tab-container " + (value.league_name == activeLeagueTab ? "active" : ""),
								onClick: function onClick() {
									setActiveLeagueTab(value.league_name);
								},
								key: value.league_name
							},
							React.createElement(
								"p",
								null,
								value.league_name
							)
						);
					}
				})
			) : React.createElement("div", null)
		),
		czechQuery.isSuccess || foreignQuery.isSuccess ? React.createElement(
			"div",
			{ className: "mainScoreBoard-body" },
			czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref5) {
				var _ref6 = _slicedToArray(_ref5, 2),
				    key = _ref6[0],
				    value = _ref6[1];

				if (value.league_name == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: value.league_name },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
							return React.createElement(
								"div",
								{ className: "body-match", key: match.onlajny_id },
								React.createElement(
									"div",
									{ className: "match-infoContainer" },
									React.createElement(
										"div",
										{ className: "match-team match-team--left" },
										React.createElement(
											"h3",
											null,
											match.home.short_name != "" ? match.home.short_name : match.home.name
										),
										React.createElement(
											"h3",
											{ className: "small-name" },
											match.home.shortcut
										),
										React.createElement("img", { src: homeLogo, alt: "" })
									),
									React.createElement(
										"div",
										{ className: "match-scoreContainer" },
										React.createElement(
											"div",
											{
												className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
											},
											match.score_home
										),
										match.match_status == "po zápase" && React.createElement(
											"div",
											{ className: "match-date" },
											React.createElement(
												"p",
												null,
												"Konec"
											),
											React.createElement(
												"p",
												null,
												match.score_periods[0],
												", ",
												match.score_periods[1],
												", ",
												match.score_periods[2]
											)
										),
										match.match_status == "před zápasem" && React.createElement(
											"div",
											{ className: "match-date future-match" },
											React.createElement(
												"p",
												null,
												dayName
											),
											React.createElement(
												"p",
												null,
												match.date.replace(/-/gi, "."),
												" \u2022 ",
												match.time
											)
										),
										match.match_status == "live" && React.createElement(
											"div",
											{ className: "match-date future-match" },
											React.createElement(
												"p",
												null,
												match.match_actual_time_alias
											),
											match.score_periods[0],
											", ",
											match.score_periods[1],
											", ",
											match.score_periods[2]
										),
										React.createElement(
											"div",
											{
												className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
											},
											match.score_visitor
										)
									),
									React.createElement(
										"div",
										{ className: "match-team" },
										React.createElement("img", { src: visitorsLogo, alt: "" }),
										React.createElement(
											"h3",
											null,
											match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name
										),
										React.createElement(
											"h3",
											{ className: "small-name" },
											match.visitor.shortcut
										)
									)
								),
								React.createElement(
									"div",
									{ className: "match-tabsContainer" },
									value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && React.createElement(
										"a",
										{ href: "#", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTextGray.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Preview"
										)
									),
									match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
										"a",
										{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
										React.createElement(
											"div",
											{ className: "tab-tipsportData" },
											React.createElement(
												"p",
												null,
												match.bets.tipsport.home_win
											),
											React.createElement(
												"p",
												null,
												match.bets.tipsport.draw
											),
											React.createElement(
												"p",
												null,
												match.bets.tipsport.away_win
											)
										)
									),
									value.league_name == "Tipsport extraliga" && (match.match_status == "před zápasem" || match.match_status == "live") && React.createElement(
										"div",
										{ className: "mediaTab-container" },
										React.createElement(
											"a",
											{ href: "#", target: "_blank", className: "match-tab--imgOnly" },
											React.createElement("img", { src: "../img/logoCT@2x.png", alt: "" })
										),
										React.createElement(
											"a",
											{ href: "#", target: "_blank", className: "match-tab--imgOnly" },
											React.createElement("img", { src: "../img/logoO2@2x.png", alt: "" })
										)
									),
									match.bets.tipsport.link != null && match.match_status == "live" && React.createElement(
										"a",
										{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Lives\xE1zka"
										)
									),
									match.match_status == "live" && (value.league_name == "CHANCE LIGA" || value.league_name == "Tipsport extraliga") && React.createElement(
										"a",
										{ href: "#", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"\u017Div\u011B"
										)
									),
									match.match_status == "live" && React.createElement(
										"a",
										{ href: "", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Text"
										)
									),
									match.match_status == "po zápase" && (value.league_name == "CHANCE LIGA" || value.league_name == "Tipsport extraliga") && React.createElement(
										"a",
										{ href: "#", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1znam"
										)
									),
									match.match_status == "po zápase" && React.createElement(
										"a",
										{ href: "#", className: "match-tab" },
										React.createElement("img", { src: "../img/icoSummary.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1pis"
										)
									)
								)
							);
						})
					);
				}
			}),
			foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref7) {
				var _ref8 = _slicedToArray(_ref7, 2),
				    key = _ref8[0],
				    value = _ref8[1];

				if (value.league_name == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: value.league_name },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;

							if (APIDate == match.date) {
								return React.createElement(
									"div",
									{ className: "body-match", key: match.onlajny_id },
									React.createElement(
										"div",
										{ className: "match-infoContainer" },
										React.createElement(
											"div",
											{ className: "match-team match-team--left" },
											React.createElement(
												"h3",
												null,
												match.home.short_name != "" ? match.home.short_name : match.home.name
											),
											React.createElement(
												"h3",
												{ className: "small-name" },
												match.home.shortcut
											),
											React.createElement("img", { src: homeLogo, alt: "" })
										),
										React.createElement(
											"div",
											{ className: "match-scoreContainer" },
											React.createElement(
												"div",
												{
													className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
												},
												match.score_home
											),
											match.match_status == "po zápase" && React.createElement(
												"div",
												{ className: "match-date" },
												React.createElement(
													"p",
													null,
													"Konec"
												),
												match.score_periods != undefined && React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2]
												),
												match.score_period != undefined && React.createElement(
													"p",
													null,
													match.score_period[0],
													", ",
													match.score_period[1],
													", ",
													match.score_period[2]
												)
											),
											match.match_status == "před zápasem" && React.createElement(
												"div",
												{ className: "match-date future-match" },
												React.createElement(
													"p",
													null,
													APIDate == match.date ? dayName : "Zítra ráno"
												),
												React.createElement(
													"p",
													null,
													match.date.replace(/-/gi, "."),
													" \u2022 ",
													match.time
												)
											),
											match.match_status == "live" && React.createElement(
												"div",
												{ className: "match-date active-match" },
												React.createElement(
													"p",
													null,
													match.match_actual_time_name
												),
												match.score_periods != undefined && React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2]
												),
												match.score_period != undefined && React.createElement(
													"p",
													null,
													match.score_period[0],
													", ",
													match.score_period[1],
													", ",
													match.score_period[2]
												)
											),
											React.createElement(
												"div",
												{
													className: "match-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
												},
												match.score_visitor
											)
										),
										React.createElement(
											"div",
											{ className: "match-team" },
											React.createElement("img", { src: visitorsLogo, alt: "" }),
											React.createElement(
												"h3",
												null,
												match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name
											),
											React.createElement(
												"h3",
												{ className: "small-name" },
												match.visitor.shortcut
											)
										)
									),
									React.createElement(
										"div",
										{ className: "match-tabsContainer" },
										match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
											"a",
											{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
											React.createElement(
												"div",
												{ className: "tab-tipsportData" },
												React.createElement(
													"p",
													null,
													match.bets.tipsport.home_win
												),
												React.createElement(
													"p",
													null,
													match.bets.tipsport.draw
												),
												React.createElement(
													"p",
													null,
													match.bets.tipsport.away_win
												)
											)
										),
										match.bets.tipsport.link != null && match.match_status == "live" && React.createElement(
											"a",
											{ href: match.bets.tipsport.link, target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Lives\xE1zka"
											)
										),
										match.match_status == "live" && React.createElement(
											"a",
											{ href: "", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Text"
											)
										),
										match.match_status == "po zápase" && React.createElement(
											"a",
											{ href: "#", className: "match-tab" },
											React.createElement("img", { src: "../img/icoSummary.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Z\xE1pis"
											)
										)
									)
								);
							}
						})
					);
				}
			})
		) : React.createElement(
			"div",
			{ className: "mainScoreBoard-body--noData" },
			React.createElement(
				"h1",
				null,
				"\u017D\xE1dn\xE9 z\xE1pasy k zobrazen\xED"
			)
		),
		React.createElement(
			"div",
			{ className: "scoreBoard-buttonsContainer" },
			React.createElement(
				"a",
				{ href: "#", className: "scoreBoard-button" },
				"Rozpis z\xE1pas\u016F"
			),
			React.createElement(
				"a",
				{ href: "#", className: "scoreBoard-button" },
				"Tabulka sout\u011B\u017Ee"
			)
		)
	);
};

var Render = function Render() {
	return React.createElement(
		QueryClientProvider,
		{ client: queryClient },
		React.createElement(MainScoreboard, null)
	);
};

var domContainer = document.querySelector("#main-scoreboard");
/* ReactDOM.createRoot(domContainer).render(<Render />) */
ReactDOM.render(React.createElement(Render), domContainer);