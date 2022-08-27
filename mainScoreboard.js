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
			console.log(firstTab);
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
	957: {
		id: "5884",
		name: "Repre",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: null, table: null }
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
		id: "71",
		name: "Olympijské hry",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/reprezentace/zapasy/18", table: "/reprezentace/table/18" }
	},
	500: {
		id: "13",
		name: "Carlson Hockey Games",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/21", table: "/reprezentace/table/21" }
	},
	100: {
		id: "101",
		name: "Tipsport extraliga",
		nick: "Tipsport ELH",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/tipsport-extraliga/zapasy", table: "/tipsport-extraliga/table" }
	},
	90: {
		id: "0",
		name: "NHL",
		nick: null,
		externalLink: true,
		sourceOnlajny: false,
		url: { matches: "/sezona/zapasy", table: "/sezona/table" }
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
		id: "3452",
		name: "2. liga – Sever",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6508",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6508"
		}
	},
	76: {
		id: "29",
		name: "2. liga – Střed",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6509",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6509"
		}
	},
	75: {
		id: "30",
		name: "2. liga – Východ",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6510",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6510"
		}
	},
	74: {
		id: "147",
		name: "Univerzitní liga",
		nick: "ULLH",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "ullh/zapasy", table: "ullh/table" }
	},
	70: {
		id: "174",
		name: "turnaj O Pohár DHL",
		nick: "Pohár DHL",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/56", table: "/mladez/table/56" }
	},
	67: {
		id: "81",
		name: "REDSTONE Extraliga juniorů",
		nick: "ELJ",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/4", table: "/mladez/table/4" }
	},
	65: {
		id: "112",
		name: "ELIOD Extraliga dorostu",
		nick: "ELD",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/53", table: "/mladez/table/53" }
	},
	60: {
		id: "67",
		name: "Starší dorost",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/5", table: "/mladez/table/5" }
	},
	50: {
		id: "68",
		name: "Mladší dorost",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/6", table: "/mladez/table/6" }
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
	46: {
		id: "657",
		name: "Repre 20",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/31", table: "/mladez/table/31" }
	},
	45: {
		id: "1258",
		name: "Repre 19",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/35", table: "/mladez/table/35" }
	},
	44: {
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
		id: "131",
		name: "Repre 17",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/33", table: null }
	},
	39: {
		id: "3441",
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
	25: {
		id: "405",
		name: "MS v para hokeji",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "sledge-hokej/zapasy/42", table: "sledge-hokej/table/42" }
	},
	22: {
		id: "781",
		name: "Repre žen",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: "/zensky-hokej/table/39" }
	},
	20: {
		id: "658",
		name: "Repre ženy 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: null }
	},
	19: {
		id: "3437",
		name: "Repre ženy 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: "/zensky-hokej/table/40" }
	},
	15: {
		id: "3162",
		name: "Repre ženy 16",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/41", table: null }
	},
	10: {
		id: "2849",
		name: "ZOH mládeže",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/47", table: "/zensky-hokej/table/47" }
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
		id: "63",
		name: "MMČR 8. tříd",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/44", table: "/mladez/table/44" }
	},
	6: {
		id: "856",
		name: "MMČR krajů",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/43", table: "/mladez/table/43" }
	},
	5: {
		id: "60",
		name: "Turnaj výběrů VTM",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/51", table: "/mladez/table/51" }
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