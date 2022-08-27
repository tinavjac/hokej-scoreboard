var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    createRoot = _React.createRoot,
    useRef = _React.useRef;


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

	var _useState15 = useState(null),
	    _useState16 = _slicedToArray(_useState15, 2),
	    buttonsUrl = _useState16[0],
	    setButtonsUrl = _useState16[1];

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
		},
		onError: function onError(res) {
			return setCzechRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});
	var LeagueTabs = useRef(null);

	useEffect(function () {
		czechQuery.refetch();
		foreignQuery.refetch();
	}, [APIDate]);

	useEffect(function () {
		if (LeagueTabs.current) {
			var firstTab = LeagueTabs.current.firstChild.id;
			setActiveLeagueTab(firstTab);
		}
	}, [LeagueTabs.current]);

	useEffect(function () {
		Object.entries(scoreboardLeagues).map(function (value) {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1]);
			}
		});
	});
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
				{ ref: LeagueTabs, className: "header-tabs" },
				czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    key = _ref2[0],
					    value = _ref2[1];

					return React.createElement(
						"div",
						{
							className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
							id: key,
							onClick: function onClick() {
								setActiveLeagueTab(key);
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
								className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
								id: key,
								onClick: function onClick() {
									setActiveLeagueTab(key);
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

				if (key == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: value.league_name },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
							return React.createElement(
								"a",
								{ href: "/zapas/" + match.hokejcz_id + "/", className: "body-match", key: match.onlajny_id },
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
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/preview", className: "match-tab" },
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
									match.match_status == "live" && value.league_name == "CHANCE LIGA" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/chl?matchId=" + match.hokejcz_id + "/", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"\u017Div\u011B"
										)
									),
									match.match_status == "live" && value.league_name == "Tipsport extraliga" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/elh?matchId=" + match.hokejcz_id + "/", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"\u017Div\u011B"
										)
									),
									match.match_status == "live" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Text"
										)
									),
									match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/category/14", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1znam"
										)
									),
									match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/tv/hokejka/category/23", target: "_blank", className: "match-tab" },
										React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
										React.createElement(
											"p",
											null,
											"Z\xE1znam"
										)
									),
									match.match_status == "po zápase" && React.createElement(
										"a",
										{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "match-tab" },
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

				if (key == activeLeagueTab) {
					return React.createElement(
						"div",
						{ key: value.league_name },
						value.matches.map(function (match) {
							var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
							var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;

							if (APIDate == match.date) {
								return React.createElement(
									"a",
									{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "body-match", key: match.onlajny_id },
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
											{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line", target: "_blank", className: "match-tab" },
											React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Text"
											)
										),
										match.match_status == "po zápase" && React.createElement(
											"a",
											{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "match-tab" },
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
				{ href: buttonsUrl ? buttonsUrl.url.matches : "#", className: "scoreBoard-button" },
				"Rozpis z\xE1pas\u016F"
			),
			React.createElement(
				"a",
				{ href: buttonsUrl ? buttonsUrl.url.table : "#", className: "scoreBoard-button" },
				"Tabulka sout\u011B\u017Ee"
			)
		)
	);
};

var scoreboardLeagues = {
	9000: {
		id: "12",
		name: "Mistrovství světa",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "reprezentace/zapasy/15", table: "reprezentace/table/15" }
	},
	958: {
		id: "3150",
		name: "Red Bulls Salute",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: null, table: null }
	},
	957: {
		id: "15",
		name: "Reprezentace",
		nick: "Repre",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/25", table: null }
	},
	950: {
		id: "2838",
		name: "Světový pohár",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/49", table: "/reprezentace/table/49" }
	},
	505: {
		id: "11",
		name: "OH – muži",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/18", table: "/reprezentace/table/18" }
	},
	503: {
		id: "14",
		name: "OH – ženy",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "https://hokej.cz/zensky-hokej/zapasy/39", table: "https://hokej.cz/zensky-hokej/table/39" }
	},
	501: {
		id: "959",
		name: "Euro Hockey Challenge",
		nick: "EHC",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/48", table: null }
	},
	500: {
		id: "1392",
		name: "České hokejové hry",
		nick: "České hokejové hry",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/reprezentace/zapasy/21", table: "/reprezentace/table/21" }
	},
	499: {
		id: "13",
		name: "Beijer Hockey Games",
		nick: "Beijer Hockey Games",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/24", table: "/reprezentace/zapasy/24" }
	},
	450: {
		id: "874",
		name: "Kvalifikace žen na OH",
		nick: "Kvalifikace žen na OH",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: "/zensky-hokej/table/39" }
	},
	100: {
		id: "101",
		name: "Tipsport extraliga",
		nick: "Tipsport ELH",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/tipsport-extraliga/zapasy", table: "/tipsport-extraliga/table" }
	},
	98: {
		id: "177",
		name: "Generali Česká Cup",
		nick: "Generali Česká Cup",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/tipsport-extraliga/zapasy", table: "/tipsport-extraliga/table" }
	},
	95: {
		id: "39",
		name: "MS U20",
		nick: "MS U20",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "https://www.hokej.cz/mladez/zapasy/31", table: "https://www.hokej.cz/mladez/table/31" }
	},
	90: {
		id: "0",
		name: "NHL",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/sezona/zapasy", table: "/sezona/table" }
	},
	86: {
		id: "3324",
		name: "Play off Ligy mistrů",
		nick: "CHL",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/chl/zapasy", table: "/chl/table" }
	},
	85: {
		id: "1828",
		name: "Liga mistrů",
		nick: "CHL",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/chl/zapasy", table: "/chl/table" }
	},
	80: {
		id: "82",
		name: "Chance liga",
		nick: "Chance liga",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/chance-liga/zapasy", table: "/chance-liga/table" }
	},
	77: {
		id: "3060",
		name: "2. liga – Sever",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/druha-liga/zapasy?matchList-filter-season=2021&matchList-filter-competition=6828",
			table: "/druha-liga/table?table-filter-season=2020&table-filter-competition=6648"
		}
	},
	76: {
		id: "3853",
		name: "2. liga – Jih",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/druha-liga/zapasy?matchList-filter-season=2021&matchList-filter-competition=6829",
			table: "/druha-liga/table?table-filter-season=2020&table-filter-competition=6649"
		}
	},
	75: {
		id: "26",
		name: "2. liga – Východ",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/druha-liga/zapasy?matchList-filter-season=2021&matchList-filter-competition=6830",
			table: "/druha-liga/table?table-filter-season=2020&table-filter-competition=6650"
		}
	},
	74: {
		id: "197",
		name: "2. liga – O udržení",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "https://hokej.cz/druha-liga/zapasy?matchList-filter-season=2021&matchList-filter-competition=6831",
			table: "https://hokej.cz/druha-liga/table?table-filter-season=2021&table-filter-competition=6831"
		}
	},
	73: {
		id: "3863",
		name: "O baráž o Chance ligu",
		nick: "O baráž o Chance ligu",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: null, table: null }
	},
	72: {
		id: "3445",
		name: "Univerzitní liga",
		nick: "ULLH",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "ullh/zapasy", table: "ullh/table" }
	},
	71: {
		id: "32",
		name: "Kvalifikace o 2. ligu",
		nick: "Kvalifikace o 2. ligu",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/druha-liga/zapasy", table: "/druha-liga/table" }
	},
	70: {
		id: "81",
		name: "Extraliga juniorů",
		nick: "ELJ",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/4", table: "/mladez/table/4" }
	},
	65: {
		id: "112",
		name: "Extraliga dorostu",
		nick: "ELD",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/53", table: "/mladez/table/53" }
	},
	63: {
		id: "109",
		name: "Liga juniorů",
		nick: "LJ",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/9", table: "/mladez/table/9" }
	},
	48: {
		id: "51",
		name: "Liga žen – Final Four",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: {
			matches: "zensky-hokej/zapasy/10",
			table: "/zensky-hokej/table/10?table-filter-season=2016&table-filter-competition=6008"
		}
	},
	47: {
		id: "3458",
		name: "Extraliga žen – o titul",
		nick: "Extraliga žen – o titul",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/10", table: null }
	},
	46: {
		id: "657",
		name: "Repre 20",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/31", table: "/mladez/table/31" }
	},
	45: {
		id: "293",
		name: "Repre 19",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/35", table: null }
	},
	43: {
		id: "40",
		name: "Repre 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/32", table: null }
	},
	42: {
		id: "254",
		name: "Hlinka Gretzky Cup",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/32", table: "/mladez/table/32" }
	},
	41: {
		id: "634",
		name: "Repre 17",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/33", table: "/mladez/table/33" }
	},
	39: {
		id: "3912",
		name: "Repre 16",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/34", table: "/mladez/table/34" }
	},
	35: {
		id: "954",
		name: "MS žen",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: "/zensky-hokej/table/39" }
	},
	26: {
		id: "50",
		name: "Para hokej",
		nick: "Para hokej",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "https://hokej.cz/sledge-hokej/zapasy/27", table: null }
	},
	25: {
		id: "405",
		name: "MS v para hokeji",
		nick: "MS para",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "sledge-hokej/zapasy/42", table: "sledge-hokej/table/42" }
	},
	22: {
		id: "133",
		name: "Repre žen",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: null }
	},
	20: {
		id: "658",
		name: "Repre žen 18",
		nick: "Ženy 18",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: null }
	},
	18: {
		id: "342",
		name: "MS žen 18",
		nick: "Ženy 18",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: "/zensky-hokej/table/40" }
	},
	15: {
		id: "3086",
		name: "Repre žen 16",
		nick: "Ženy 16",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/41", table: "/zensky-hokej/table/41" }
	},
	10: {
		id: "2849",
		name: "ZOH mládeže",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/41", table: "/zensky-hokej/table/41" }
	},
	8: {
		id: "2885",
		name: "Škoda Hockey Cup",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/43", table: null }
	},
	7: {
		id: "115",
		name: "MMČR 9. tříd",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/60", table: "/mladez/table/60" }
	},
	6: {
		id: "119",
		name: "VTM",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/51", table: null }
	},
	5: {
		id: "0",
		name: "Olympiáda dětí a mládeže",
		nick: "ODM",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/43", table: "/mladez/table/43" }
	},
	4: {
		id: "193",
		name: "Tipsport UNI Cup",
		nick: "Tipsport UNI Cup",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/ullh/zapasy", table: null }
	}
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