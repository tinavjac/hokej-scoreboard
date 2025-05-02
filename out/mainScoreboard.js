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

var MainScoreboard = function MainScoreboard() {
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

	var mladezLeagues = [81, 112, 109, 41, 3079, 657, 39, 40, 168, 38, 254, 894, 131, 1656, 634, 975, 49, 962, 3441, 3912, 293, 2802, 868, 1864, 2712, 1258, 179, 856, 119, 63, 112, 110, 80, 174, 176, 198];

	var womanLeagues = [658, 342, 3162, 2380, 3086];

	var onlineLeagues = ["1828", "33", "112", "3969", "28", "26", "3853", "30", "197", "32", "3282"];

	var isMladez = function isMladez() {
		if (typeof shownLeagues != "undefined") {
			if (shownLeagues.length == mladezLeagues.length) {
				shownLeagues.forEach(function (league) {
					if (!mladezLeagues.includes(league)) {
						return false;
					}
				});
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	var isOnlineLeague = function isOnlineLeague(key) {
		return onlineLeagues.some(function (item) {
			return item === key;
		});
	};

	var isOnHomepage = function isOnHomepage(key) {
		if (typeof isHomepage != "undefined") {
			return isHomepage;
		}
		return false;
	};

	var renderOnPage = function renderOnPage() {
		if (typeof shownLeagues != "undefined") {
			if (shownLeagues.length == 1 && shownLeagues.includes(147)) {
				return false;
			} else if (shownLeagues.length == womanLeagues.length) {
				shownLeagues.forEach(function (league) {
					if (!womanLeagues.includes(league)) {
						return true;
					}
				});
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	};

	var prevDate = function prevDate() {
		setDayClicks(dayClicks - 1);
		setForeignRefetch(false);
		setCzechRefetch(false);
		setNoData(true);

		if (dayClicks >= 6) {
			setMaxDate(true);
		} else {
			setMaxDate(false);
		}

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
		setForeignRefetch(false);
		setCzechRefetch(false);
		setNoData(true);

		if (dayClicks >= 6) {
			setMaxDate(true);
		} else {
			setMaxDate(false);
		}

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

	var _useState13 = useState(false),
	    _useState14 = _slicedToArray(_useState13, 2),
	    liveBetsRefetch = _useState14[0],
	    setLiveBetsRefetch = _useState14[1];

	var _useState15 = useState(""),
	    _useState16 = _slicedToArray(_useState15, 2),
	    activeLeagueTab = _useState16[0],
	    setActiveLeagueTab = _useState16[1];

	var _useState17 = useState(null),
	    _useState18 = _slicedToArray(_useState17, 2),
	    buttonsUrl = _useState18[0],
	    setButtonsUrl = _useState18[1];

	var _useState19 = useState(true),
	    _useState20 = _slicedToArray(_useState19, 2),
	    noData = _useState20[0],
	    setNoData = _useState20[1];

	var _useState21 = useState(false),
	    _useState22 = _slicedToArray(_useState21, 2),
	    maxDate = _useState22[0],
	    setMaxDate = _useState22[1];

	var _useState23 = useState([]),
	    _useState24 = _slicedToArray(_useState23, 2),
	    liveBets = _useState24[0],
	    setLiveBets = _useState24[1];

	var urlForeignRoot = "https://json.esports.cz/hokejcz/scoreboard/onlajny/";
	var urlCzechRoot = "https://json.esports.cz/hokejcz/scoreboard/";
	var urlLiveBets = "https://s3.eu-west-1.amazonaws.com/data.onlajny.com/odds/tipsport-live.json";

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
	var liveBetsQuery = useQuery(["liveBets"], function () {
		return fetch(urlLiveBets).then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: liveBetsRefetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			setLiveBetsRefetch(5000);
		},
		onError: function onError(res) {
			return setLiveBetsRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});

	var LeagueTabs = useRef(null);
	var MainScoreboard = useRef(null);

	var _useState25 = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0
	}),
	    _useState26 = _slicedToArray(_useState25, 2),
	    scroll = _useState26[0],
	    setScroll = _useState26[1];

	var mouseDownHandler = function mouseDownHandler(e) {
		LeagueTabs.current.style.cursor = "grabbing";
		LeagueTabs.current.style.userSelect = "none";
		setScroll({
			pointerEvents: true,
			isScrolling: true,
			left: LeagueTabs.current.scrollLeft,
			x: e.clientX
		});
	};
	var mouseMoveHandler = function mouseMoveHandler(e) {
		e.stopPropagation();
		if (scroll.isScrolling) {
			setScroll(Object.assign({}, scroll, { pointerEvents: false }));
			var dx = e.clientX - scroll.x;
			LeagueTabs.current.scrollLeft = scroll.left - dx;
		}
	};
	var mouseUpHandler = function mouseUpHandler(e) {
		LeagueTabs.current.style.cursor = "grab";
		LeagueTabs.current.style.removeProperty("user-select");
		setScroll(Object.assign({}, scroll, { isScrolling: false, pointerEvents: true }));
		e.stopPropagation();
	};

	var handleMatchClick = function handleMatchClick(e, path, newTab) {
		e.stopPropagation();
		e.preventDefault();
		if (newTab == true) {
			window.open(path, "_blank");
		} else {
			window.location.href = path;
		}
	};

	var displayStreamMatch = function displayStreamMatch(time, state) {
		var matchTime = time.split(":").map(function (el) {
			return Number(el);
		});

		if (date.getHours() === matchTime[0] && date.getMinutes() + 15 >= matchTime[1]) {
			return true;
		} else if (state == "live") {
			return true;
		} else {
			return false;
		}
	};

	var getTipsportMeasureCodes = function getTipsportMeasureCodes() {
		return {
			before: "?pid=61&sid=45&bid=2405&tid=1721",
			live: "?pid=61&sid=45&bid=2429&tid=1761"
		};
	};

	var getLiveBets = function getLiveBets(id) {
		if (liveBets && Object.keys(liveBets).some(function (key) {
			return key == id;
		})) {
			return liveBets[id];
		}
	};

	useEffect(function () {
		czechQuery.refetch();
		foreignQuery.refetch();
		liveBetsQuery.refetch();
	}, [APIDate]);

	var _useState27 = useState(undefined),
	    _useState28 = _slicedToArray(_useState27, 2),
	    scoreboardWidth = _useState28[0],
	    setScoreboardWidth = _useState28[1];

	useEffect(function () {
		if (MainScoreboard.current) {
			setScoreboardWidth(MainScoreboard.current.clientWidth);
		}
	}, []);

	useEffect(function () {
		var leagues = [];
		if (LeagueTabs.current) {
			LeagueTabs.current.childNodes.forEach(function (data) {
				leagues.push({
					id: data.getAttribute("id"),
					priority: data.getAttribute("data-order")
				});
			});
			leagues.sort(function (a, b) {
				return b.priority - a.priority;
			});
			if (leagues.length > 0) {
				setNoData(false);
				setActiveLeagueTab(leagues[0].id);
			}
		}
	}, [czechRefetch, foreignRefetch, czechQuery.isSuccess, foreignQuery.isSuccess]);

	useEffect(function () {
		Object.entries(scoreboardLeagues).map(function (value) {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1]);
			}
		});
	});

	useEffect(function () {
		if (liveBetsQuery.data) {
			if (liveBetsQuery.data.matches != undefined) {
				setLiveBets(liveBetsQuery.data.matches);
			}
		}
	});

	return React.createElement(
		React.Fragment,
		null,
		renderOnPage() && React.createElement(
			"section",
			{ className: "mainScoreboard" + (scoreboardWidth < 730 && !isMladez() ? " small" : ""), ref: MainScoreboard },
			foreignQuery.isFetching || czechQuery.isFetching == true ? React.createElement("div", { className: "loadContainer" }) : "",
			React.createElement(
				"header",
				{ className: "mainScoreboard-header" },
				React.createElement(
					"div",
					{ className: "header-date" },
					React.createElement(
						"div",
						{ className: "date-dayChanger prev", onClick: prevDate },
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
						displayDate.replaceAll(".", ". ")
					),
					React.createElement(
						"div",
						{ className: "date-dayChanger next", onClick: nextDate },
						React.createElement(
							"h5",
							null,
							"N\xE1sleduj\xEDc\xED den"
						),
						React.createElement("img", { src: "../img/ArrowRightGrey.svg", alt: "" })
					)
				),
				(czechQuery.isSuccess || foreignQuery.isSuccess) && !maxDate ? React.createElement(
					"div",
					{ onMouseDown: mouseDownHandler, onMouseMove: mouseMoveHandler, onMouseUp: mouseUpHandler, ref: LeagueTabs, className: "header-tabs" },
					czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref) {
						var _ref2 = _slicedToArray(_ref, 2),
						    key = _ref2[0],
						    value = _ref2[1];

						var isFake = value.matches.every(function (match) {
							return displayDate != match.date.replaceAll("-", ".");
						});
						var priority = void 0;
						var render = false;
						var leaguName = void 0;
						Object.entries(scoreboardLeagues).map(function (value) {
							if (value[1].id == key) {
								priority = value[1].priority;
								leaguName = value[1].name;
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
						if (!isFake && render) {
							return React.createElement(
								"div",
								{
									className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
									id: key,
									onClick: function onClick() {
										setActiveLeagueTab(key);
									},
									key: key,
									"data-order": priority,
									style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }
								},
								React.createElement(
									"p",
									null,
									leaguName
								)
							);
						}
					}),
					foreignQuery.data != undefined && Object.entries(foreignQuery.data).map(function (_ref3) {
						var _ref4 = _slicedToArray(_ref3, 2),
						    key = _ref4[0],
						    value = _ref4[1];

						var isFake = value.matches.every(function (match) {
							return APIDate != match.date;
						});
						var render = false;
						var priority = void 0;
						var leagueName = void 0;
						Object.entries(scoreboardLeagues).map(function (value) {
							if (value[1].id == key) {
								priority = value[1].priority;
								leagueName = value[1].name;
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
						if (!isFake && render) {
							return React.createElement(
								"div",
								{
									className: "tab-container " + (key == activeLeagueTab ? "active" : ""),
									id: key,
									onClick: function onClick() {
										setActiveLeagueTab(key);
									},
									key: key,
									"data-order": priority,
									style: { order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }
								},
								React.createElement(
									"p",
									null,
									leagueName
								)
							);
						}
					})
				) : React.createElement("div", null)
			),
			(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate ? React.createElement(
				"div",
				{ className: "mainScoreBoard-body" },
				czechQuery.data != undefined && Object.entries(czechQuery.data).map(function (_ref5) {
					var _ref6 = _slicedToArray(_ref5, 2),
					    key = _ref6[0],
					    value = _ref6[1];

					if (key == activeLeagueTab) {
						return React.createElement(
							"div",
							{ key: key },
							value.matches.map(function (match, index) {
								var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
								var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
								var streamInfo = void 0;

								if (typeof streamMatch !== "undefined" && displayStreamMatch(match.time, match.match_status)) {
									streamInfo = streamMatch[match.hokejcz_id];
								}

								return React.createElement(
									"a",
									{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "body-match", key: index },
									React.createElement(
										"div",
										{ className: "match-infoContainer" },
										React.createElement(
											"div",
											{ className: "match-team match-team--left" },
											React.createElement(
												"h3",
												{ className: "shortName" },
												match.home.short_name ? match.home.short_name : match.home.shortcut
											),
											React.createElement(
												"h3",
												null,
												match.home.shortcut
											),
											React.createElement(
												"div",
												{ className: "match-team--img" },
												React.createElement("img", { src: homeLogo, alt: "" })
											)
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
											match.match_status == "zrušeno" && React.createElement(
												"div",
												{ className: "match-date" },
												React.createElement(
													"p",
													null,
													"Odlo\u017Eeno"
												)
											),
											match.match_status == "po zápase" && React.createElement(
												"div",
												{ className: "match-date" },
												React.createElement(
													"p",
													null,
													match.match_actual_time_alias == "KP" ? "Po prodloužení" : match.match_actual_time_alias == "KN" ? "Po nájezdech" : "Konec"
												),
												React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2],
													match.match_actual_time_alias == "KP" && " - " + (match.score_home > match.score_visitor ? "1:0" : match.score_home < match.score_visitor ? "0:1" : "0:0"),
													match.match_actual_time_alias == "KN" && " - 0:0"
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
												{ className: "match-date active-match" },
												React.createElement(
													"p",
													null,
													match.match_actual_time_alias == "0" ? "1. př." : match.match_actual_time_alias == "10" ? "1. př." : match.match_actual_time_alias == "20" ? "2. př." : match.match_actual_time_alias == "30" ? "3. př." : match.match_actual_time_alias == "P" ? "P" : match.match_actual_time_alias == "N" ? "SN" : match.match_actual_time_alias == "1P" ? "po 1. tř" : match.match_actual_time_alias == "2P" ? "po 2. tř" : match.match_actual_time_alias == "3P" ? "po 3. tř" : match.match_actual_time_alias + ". t\u0159."
												),
												React.createElement(
													"p",
													null,
													match.score_periods[0],
													", ",
													match.score_periods[1],
													", ",
													match.score_periods[2],
													match.match_actual_time_alias == "KP" && " - " + (match.score_home > match.score_visitor ? "1:0" : match.score_home < match.score_visitor ? "0:1" : "0:0"),
													match.match_actual_time_alias == "KN" && " - 0:0"
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
											React.createElement(
												"div",
												{ className: "match-team--img" },
												React.createElement("img", { src: visitorsLogo, alt: "" })
											),
											React.createElement(
												"h3",
												{ className: "shortName" },
												match.visitor.short_name ? match.visitor.short_name : match.visitor.shortcut
											),
											React.createElement(
												"h3",
												null,
												match.visitor.shortcut
											)
										)
									),
									React.createElement(
										"div",
										{ className: "match-tabsContainer" },
										React.createElement(
											"div",
											{ className: "mediaTab-container" },
											streamInfo && React.createElement(
												"div",
												{
													onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/adhoc-stream", true);
													},
													className: "match-tab--imgOnly"
												},
												React.createElement("img", { src: "../img/cro.svg", alt: "" })
											),
											(value.league_name == "Tipsport extraliga" || value.league_name == "CHANCE LIGA") && (match.match_status == "před zápasem" || match.match_status == "live") && React.createElement(
												React.Fragment,
												null,
												match.stream_url == "ct" && React.createElement(
													"div",
													{ onClick: function onClick(e) {
															return handleMatchClick(e, "https://sport.ceskatelevize.cz/#live", true);
														}, className: "match-tab--imgOnly" },
													React.createElement("img", { src: "../img/logoCT@2x.png", alt: "" })
												),
												match.stream_url == "plus" && React.createElement(
													"div",
													{
														onClick: function onClick(e) {
															return handleMatchClick(e, "https://sport.ceskatelevize.cz/clanek/ostatni/program-vysilani-ct-sport-plus/5ddda79bfccd259ea46d41bc", true);
														},
														className: "match-tab--imgOnly"
													},
													React.createElement("img", { src: "../img/logo_ct_sport_plus.png", alt: "" })
												),
												match.stream_url == "o2" && React.createElement(
													"div",
													{ onClick: function onClick(e) {
															return handleMatchClick(e, "https://www.oneplay.cz/", true);
														}, className: "match-tab--imgOnly" },
													React.createElement("img", { src: "../img/logoO2@2x.png", alt: "" })
												),
												match.stream_url == "md" && React.createElement(
													"div",
													{ onClick: function onClick(e) {
															return handleMatchClick(e, "https://www.oneplay.cz/", true);
														}, className: "match-tab--imgOnly" },
													React.createElement("img", { src: "../img/logoO2md.png", alt: "" })
												),
												match.stream_url == "cto2" && React.createElement(
													React.Fragment,
													null,
													React.createElement(
														"div",
														{ onClick: function onClick(e) {
																return handleMatchClick(e, "https://sport.ceskatelevize.cz/#live", true);
															}, className: "match-tab--imgOnly" },
														React.createElement("img", { src: "../img/logoCT@2x.png", alt: "" })
													),
													React.createElement(
														"div",
														{ onClick: function onClick(e) {
																return handleMatchClick(e, "https://www.oneplay.cz/", true);
															}, className: "match-tab--imgOnly" },
														React.createElement("img", { src: "../img/logoO2@2x.png", alt: "" })
													)
												)
											)
										),
										(match.match_status == "live" || match.match_status == "před zápasem") && value.league_name == "CHANCE LIGA" && React.createElement(
											"div",
											null,
											match.stream_url == "ct" && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://sport.ceskatelevize.cz/#live", true);
													}, className: "match-tab" },
												React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"\u017Div\u011B"
												)
											),
											match.stream_url == "o2" && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.oneplay.cz/", true);
													}, className: "match-tab" },
												React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"\u017Div\u011B"
												)
											),
											!match.stream_url && React.createElement(
												"div",
												{
													onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.hokej.cz/tv/hokejka/chl?matchId=" + match.hokejcz_id + "/");
													},
													className: "match-tab"
												},
												React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"\u017Div\u011B"
												)
											)
										),
										(match.match_status == "live" || match.match_status == "před zápasem") && value.league_name == "Tipsport extraliga" && React.createElement(
											"div",
											null,
											match.stream_url == "ct" && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://sport.ceskatelevize.cz/#live", true);
													}, className: "match-tab" },
												React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"\u017Div\u011B"
												)
											),
											match.stream_url == "o2" && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.oneplay.cz/", true);
													}, className: "match-tab" },
												React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"\u017Div\u011B"
												)
											)
										),
										match.match_status == "live" && (value.league_name == "Tipsport extraliga" || value.league_name == "CHANCE LIGA") && React.createElement(
											"div",
											{ onClick: function onClick(e) {
													return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line");
												}, className: "match-tab" },
											React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Text"
											)
										),
										value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && React.createElement(
											"div",
											{ onClick: function onClick(e) {
													return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/preview");
												}, className: "match-tab" },
											React.createElement("img", { src: "../img/icoTextGray.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Preview"
											)
										),
										match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
											"div",
											{
												onClick: function onClick(e) {
													return handleMatchClick(e, "" + match.bets.tipsport.link + getTipsportMeasureCodes(key).before, true);
												},
												className: "match-tab match-tab--tipsport"
											},
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
										match.match_status == "live" && getLiveBets(match.onlajny_id) && React.createElement(
											"div",
											{
												onClick: function onClick(e) {
													return handleMatchClick(e, "" + getLiveBets(match.onlajny_id).link + getTipsportMeasureCodes(key).live, true);
												},
												className: "match-tab match-tab--tipsport"
											},
											React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
											React.createElement(
												"div",
												{ className: "tab-tipsportData" },
												React.createElement(
													"p",
													null,
													getLiveBets(match.onlajny_id).home_win
												),
												React.createElement(
													"p",
													null,
													getLiveBets(match.onlajny_id).draw
												),
												React.createElement(
													"p",
													null,
													getLiveBets(match.onlajny_id).away_win
												)
											)
										),
										match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && React.createElement(
											"div",
											{ onClick: function onClick(e) {
													return handleMatchClick(e, "https://www.hokej.cz/tv/hokejka/category/14");
												}, className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Z\xE1znam"
											)
										),
										match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && React.createElement(
											"div",
											{ onClick: function onClick(e) {
													return handleMatchClick(e, "https://www.hokej.cz/tv/hokejka/category/23");
												}, className: "match-tab" },
											React.createElement("img", { src: "../img/icoPlayBlack.svg", alt: "" }),
											React.createElement(
												"p",
												null,
												"Z\xE1znam"
											)
										),
										match.match_status == "po zápase" && React.createElement(
											"div",
											{ onClick: function onClick(e) {
													return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/");
												}, className: "match-tab" },
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

					if (key == activeLeagueTab && value.league_name != "NHL") {
						return React.createElement(
							"div",
							{ key: key },
							value.matches.map(function (match) {
								var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.logo_id;
								var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.logo_id;

								if (APIDate == match.date) {
									return React.createElement(
										"a",
										{
											href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/",
											className: "body-match",
											key: match.hokejcz_id != 0 ? match.hokejcz_id : match.onlajny_id
										},
										React.createElement(
											"div",
											{ className: "match-infoContainer" },
											React.createElement(
												"div",
												{ className: "match-team match-team--left" },
												React.createElement(
													"h3",
													{ className: "shortName" },
													match.home.short_name ? match.home.short_name : match.home.shortcut
												),
												React.createElement(
													"h3",
													null,
													match.home.shortcut
												),
												React.createElement(
													"div",
													{ className: "match-team--img" },
													React.createElement("img", { src: homeLogo, alt: "" })
												)
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
												match.match_status == "zrušeno" && React.createElement(
													"div",
													{ className: "match-date" },
													React.createElement(
														"p",
														null,
														"Odlo\u017Eeno"
													)
												),
												match.match_status == "po zápase" && React.createElement(
													"div",
													{ className: "match-date" },
													React.createElement(
														"p",
														null,
														match.match_actual_time_alias == "KP" ? "Po prodloužení" : match.match_actual_time_alias == "KN" ? "Po nájezdech" : "Konec"
													),
													React.createElement(
														"p",
														null,
														match.score_period[0],
														", ",
														match.score_period[1],
														", ",
														match.score_period[2],
														match.match_actual_time_alias == "KP" && " - " + (match.score_home > match.score_visitor ? "1:0" : "0:1"),
														match.match_actual_time_alias == "KN" && " - 0:0"
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
													{ className: "match-date active-match" },
													React.createElement(
														"p",
														null,
														match.match_actual_time_alias == "0" ? "1. př." : match.match_actual_time_alias == "10" ? "1. př." : match.match_actual_time_alias == "20" ? "2. př." : match.match_actual_time_alias == "30" ? "3. př." : match.match_actual_time_alias == "4" ? "P" : match.match_actual_time_alias == "N" ? "SN" : match.match_actual_time_alias == "1P" ? "po 1. tř" : match.match_actual_time_alias == "2P" ? "po 2. tř" : match.match_actual_time_alias == "3P" ? "po 3. tř" : match.match_actual_time_alias + ". t\u0159."
													),
													React.createElement(
														"p",
														null,
														match.score_period[0],
														", ",
														match.score_period[1],
														", ",
														match.score_period[2],
														match.match_actual_time_alias == "KP" && " - " + (match.score_home > match.score_visitor ? "1:0" : "0:1"),
														match.match_actual_time_alias == "KN" && " - 0:0",
														match.match_actual_time_alias == "KN" && " - 0:0"
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
												React.createElement(
													"div",
													{ className: "match-team--img" },
													React.createElement("img", { src: visitorsLogo, alt: "" })
												),
												React.createElement(
													"h3",
													{ className: "shortName" },
													match.visitor.short_name ? match.visitor.short_name : match.visitor.shortcut
												),
												React.createElement(
													"h3",
													null,
													match.visitor.shortcut
												)
											)
										),
										React.createElement(
											"div",
											{ className: "match-tabsContainer" },
											isOnlineLeague(key) && React.createElement(
												"div",
												{
													onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.onlajny.com/match/index/date/" + APIDate + "/id/" + match.onlajny_id, true);
													},
													className: "match-tab"
												},
												React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"On-line p\u0159enos"
												)
											),
											match.bets.tipsport.link != null && match.match_status == "před zápasem" && React.createElement(
												"div",
												{
													onClick: function onClick(e) {
														return handleMatchClick(e, "" + match.bets.tipsport.link + getTipsportMeasureCodes(key).before, true);
													},
													className: "match-tab match-tab--tipsport"
												},
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
											match.match_status == "live" && getLiveBets(match.onlajny_id) && React.createElement(
												"div",
												{
													onClick: function onClick(e) {
														return handleMatchClick(e, "" + getLiveBets(match.onlajny_id).link + getTipsportMeasureCodes(key).live, true);
													},
													className: "match-tab match-tab--tipsport"
												},
												React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
												React.createElement(
													"div",
													{ className: "tab-tipsportData" },
													React.createElement(
														"p",
														null,
														getLiveBets(match.onlajny_id).home_win
													),
													React.createElement(
														"p",
														null,
														getLiveBets(match.onlajny_id).draw
													),
													React.createElement(
														"p",
														null,
														getLiveBets(match.onlajny_id).away_win
													)
												)
											),
											match.match_status == "live" && !isOnlineLeague(key) && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/on-line", true);
													}, className: "match-tab" },
												React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
												React.createElement(
													"p",
													null,
													"Text"
												)
											),
											match.match_status == "po zápase" && React.createElement(
												"div",
												{ onClick: function onClick(e) {
														return handleMatchClick(e, "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/");
													}, className: "match-tab" },
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
			) : React.createElement(NoData, null),
			(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate && React.createElement(
				"div",
				{ className: "scoreBoard-buttonsContainer" },
				React.createElement(ScoreboardButton, { link: buttonsUrl ? buttonsUrl.url.matches : "#", label: "Rozpis zápasů" }),
				React.createElement(ScoreboardButton, { link: buttonsUrl ? buttonsUrl.url.table : "#", label: "Tabulka soutěže" }),
				isOnHomepage() && React.createElement(ScoreboardButton, {
					link: "https://www.tipsport.cz/PartnerRedirectAction.do?pid=61&sid=45&bid=2226&tid=11686&kwid=31965",
					label: "Tipuj na zápasy MS",
					icon: React.createElement(
						React.Fragment,
						null,
						React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
						React.createElement("img", { src: "https://ban.tipsport.cz/c/1x1.php?pid=61&sid=45&bid=2226&tid=11686&kwid=33788", alt: "", title: "", style: { width: 0, height: 0 } })
					)
				})
			)
		)
	);
};

var ScoreboardButton = function ScoreboardButton(_ref9) {
	var link = _ref9.link,
	    label = _ref9.label,
	    icon = _ref9.icon;
	return React.createElement(
		"a",
		{ href: link, className: "scoreBoard-button" },
		icon,
		label
	);
};

var NoData = function NoData() {
	return React.createElement(
		"div",
		{ className: "mainScoreBoard-body--noData" },
		React.createElement(
			"h1",
			null,
			"\u017D\xE1dn\xE9 z\xE1pasy k zobrazen\xED"
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