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
	var nhlKeys = ["425", "101"];
	var days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

	var date = new Date();
	//let date = new Date(2023, 4, 5)
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

	var _useState9 = useState(false),
	    _useState10 = _slicedToArray(_useState9, 2),
	    refetch = _useState10[0],
	    setRefetch = _useState10[1];

	var _useState11 = useState(true),
	    _useState12 = _slicedToArray(_useState11, 2),
	    noData = _useState12[0],
	    setNoData = _useState12[1];

	var _useState13 = useState(false),
	    _useState14 = _slicedToArray(_useState13, 2),
	    maxDate = _useState14[0],
	    setMaxDate = _useState14[1];

	var prevDate = function prevDate() {
		setDayClicks(dayClicks - 1);
		setRefetch(false);
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
		setRefetch(false);
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
	var apiURL = "https://s3-eu-west-1.amazonaws.com/nhl.cz/scoreboard/";

	var dataQuery = useQuery(["data"], function () {
		return fetch("" + apiURL + APIDate + ".json").then(function (res) {
			return res.json();
		});
	}, {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: refetch,
		refetchIntervalInBackground: true,
		onSuccess: function onSuccess(res) {
			setRefetch(5000);
		},
		onError: function onError(res) {
			return setRefetch(false);
		},
		enabled: APIDate == today ? true : false
	});
	/* END API FETCHING */

	useEffect(function () {
		dataQuery.refetch();
	}, [APIDate]);

	useEffect(function () {
		if (dataQuery.data != undefined) {
			Object.entries(dataQuery.data).forEach(function (league) {
				if (nhlKeys.includes(league[0])) setNoData(false);
			});
		}
	}, [dataQuery.data, dataQuery.isSuccess]);

	return React.createElement(
		"section",
		{ className: "mainScoreboard" },
		dataQuery.isFetching ? React.createElement("div", { className: "loadContainer" }) : "",
		React.createElement(ScoreboardHeader, { prevDate: prevDate, nextDate: nextDate, dayName: dayName, displayDate: displayDate }),
		dataQuery.isSuccess && !noData && !maxDate ? React.createElement(ScoreboardBody, { data: dataQuery.data, dayName: dayName, APIDate: APIDate, keys: nhlKeys }) : React.createElement(NoData, null),
		dataQuery.isSuccess && !noData && !maxDate && React.createElement(ScoreboardButton, null)
	);
};

var ScoreboardHeader = function ScoreboardHeader(_ref) {
	var prevDate = _ref.prevDate,
	    nextDate = _ref.nextDate,
	    dayName = _ref.dayName,
	    displayDate = _ref.displayDate;
	return React.createElement(
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
		)
	);
};

var ScoreboardBody = function ScoreboardBody(_ref2) {
	var APIDate = _ref2.APIDate,
	    data = _ref2.data,
	    dayName = _ref2.dayName,
	    keys = _ref2.keys;
	return React.createElement(
		"div",
		{ className: "mainScoreBoard-body" },
		data != undefined && Object.entries(data).map(function (_ref3) {
			var _ref4 = _slicedToArray(_ref3, 2),
			    key = _ref4[0],
			    value = _ref4[1];

			if (keys.includes(key)) {
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
									href: "https://www.nhl.cz/zapas/" + match.hokejcz_id + "/",
									className: "body-match",
									key: match.hokejcz_id != 0 ? match.hokejcz_id : match.onlajny_id
								},
								React.createElement(
									"div",
									{ className: "match-infoContainer" },
									React.createElement(MatchTeam, { logo: homeLogo, shortName: match.home.short_name, shortcut: match.home.shortcut, left: true }),
									React.createElement(MatchCenterInfo, { match: match, dayName: dayName }),
									React.createElement(MatchTeam, { logo: visitorsLogo, shortName: match.visitor.short_name, shortcut: match.visitor.shortcut })
								),
								React.createElement(MatchTabs, { tipsport: match.bets.tipsport, matchStatus: match.match_status, hokejId: match.hokejcz_id })
							);
						}
					})
				);
			}
		})
	);
};

var MatchCenterInfo = function MatchCenterInfo(_ref5) {
	var match = _ref5.match,
	    dayName = _ref5.dayName;
	return React.createElement(
		"div",
		{ className: "match-scoreContainer" },
		React.createElement(MatchScore, { matchStatus: match.match_status, score: match.score_home }),
		match.match_status == "zrušeno" && React.createElement(
			"div",
			{ className: "match-date" },
			React.createElement(
				"p",
				null,
				"Odlo\u017Eeno"
			)
		),
		match.match_status == "před zápasem" && React.createElement(MatchFutureInfo, { dayName: dayName, matchDate: match.date, matchTime: match.time }),
		match.match_status == "live" && React.createElement(MatchLiveInfo, {
			actualTime: match.match_actual_time_alias,
			scorePeriod: match.score_period,
			scoreHome: match.score_home,
			scoreVisitor: match.score_visitor
		}),
		match.match_status == "po zápase" && React.createElement(MatchPlayedInfo, {
			actualTime: match.match_actual_time_alias,
			scorePeriod: match.score_period,
			scoreHome: match.score_home,
			scoreVisitor: match.score_visitor
		}),
		React.createElement(MatchScore, { matchStatus: match.match_status, score: match.score_visitor })
	);
};

var MatchScore = function MatchScore(_ref6) {
	var matchStatus = _ref6.matchStatus,
	    score = _ref6.score;
	return React.createElement(
		"div",
		{ className: "match-score " + (matchStatus == "před zápasem" ? "future-match" : matchStatus == "live" ? "active-match" : "") },
		score
	);
};

var MatchFutureInfo = function MatchFutureInfo(_ref7) {
	var dayName = _ref7.dayName,
	    matchDate = _ref7.matchDate,
	    matchTime = _ref7.matchTime;
	return React.createElement(
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
			matchDate.replace(/-/gi, "."),
			" \u2022 ",
			matchTime
		)
	);
};

var MatchLiveInfo = function MatchLiveInfo(_ref8) {
	var actualTime = _ref8.actualTime,
	    scorePeriod = _ref8.scorePeriod,
	    scoreHome = _ref8.scoreHome,
	    scoreVisitor = _ref8.scoreVisitor;
	return React.createElement(
		"div",
		{ className: "match-date active-match" },
		React.createElement(
			"p",
			null,
			actualTime == "0" ? "1. př." : actualTime == "10" ? "1. př." : actualTime == "20" ? "2. př." : actualTime == "30" ? "3. př." : actualTime == "4" ? "P" : actualTime == "N" ? "SN" : actualTime == "1P" ? "po 1. tř" : actualTime == "2P" ? "po 2. tř" : actualTime == "3P" ? "po 3. tř" : actualTime + ". t\u0159."
		),
		React.createElement(
			"p",
			null,
			scorePeriod[0],
			", ",
			scorePeriod[1],
			", ",
			scorePeriod[2],
			actualTime == "KP" && " - " + (scoreHome > scoreVisitor ? "1:0" : "0:1"),
			actualTime == "KN" && " - 0:0",
			actualTime == "KN" && " - 0:0"
		)
	);
};

var MatchPlayedInfo = function MatchPlayedInfo(_ref9) {
	var actualTime = _ref9.actualTime,
	    scorePeriod = _ref9.scorePeriod,
	    scoreHome = _ref9.scoreHome,
	    scoreVisitor = _ref9.scoreVisitor;
	return React.createElement(
		"div",
		{ className: "match-date" },
		React.createElement(
			"p",
			null,
			actualTime == "KP" ? "Po prodloužení" : actualTime == "KN" ? "Po nájezdech" : "Konec"
		),
		React.createElement(
			"p",
			null,
			scorePeriod[0],
			", ",
			scorePeriod[1],
			", ",
			scorePeriod[2],
			actualTime == "KP" && " - " + (scoreHome > scoreVisitor ? "1:0" : "0:1"),
			actualTime == "KN" && " - 0:0"
		)
	);
};

var MatchTeam = function MatchTeam(_ref10) {
	var logo = _ref10.logo,
	    shortName = _ref10.shortName,
	    shortcut = _ref10.shortcut,
	    left = _ref10.left;
	return React.createElement(
		"div",
		{ className: "match-team" + (left ? " match-team--left" : "") },
		!left && React.createElement(
			"div",
			{ className: "match-team--img" },
			React.createElement("img", { src: logo, alt: "" })
		),
		React.createElement(
			"h3",
			{ className: "shortName" },
			shortName ? shortName : shortcut
		),
		React.createElement(
			"h3",
			null,
			shortcut
		),
		left && React.createElement(
			"div",
			{ className: "match-team--img" },
			React.createElement("img", { src: logo, alt: "" })
		)
	);
};

var MatchTabs = function MatchTabs(_ref11) {
	var hokejId = _ref11.hokejId,
	    tipsport = _ref11.tipsport,
	    matchStatus = _ref11.matchStatus;

	var handleMatchClick = function handleMatchClick(e, path, newTab) {
		e.stopPropagation();
		e.preventDefault();
		if (newTab == true) {
			window.open(path, "_blank");
		} else {
			window.location.href = path;
		}
	};

	return React.createElement(
		"div",
		{ className: "match-tabsContainer" },
		matchStatus == "před zápasem" && React.createElement(
			"div",
			{ onClick: function onClick(e) {
					return handleMatchClick(e, tipsport.link, true);
				}, className: "match-tab" },
			React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
			React.createElement(
				"div",
				{ className: "tab-tipsportData" },
				React.createElement(
					"p",
					null,
					tipsport.home_win
				),
				React.createElement(
					"p",
					null,
					tipsport.draw
				),
				React.createElement(
					"p",
					null,
					tipsport.away_win
				)
			)
		),
		matchStatus == "live" && React.createElement(
			"div",
			{ onClick: function onClick(e) {
					return handleMatchClick(e, "https://www.tipsport.cz/live", true);
				}, className: "match-tab" },
			React.createElement("img", { src: "../img/icoPlay.svg", alt: "" }),
			React.createElement(
				"p",
				null,
				"\u017Div\u011B"
			)
		),
		matchStatus == "live" && React.createElement(
			"div",
			{ onClick: function onClick(e) {
					return handleMatchClick(e, "https://www.nhl.cz/zapas/" + hokejId + "/on-line");
				}, className: "match-tab" },
			React.createElement("img", { src: "../img/icoText.svg", alt: "" }),
			React.createElement(
				"p",
				null,
				"Text"
			)
		),
		matchStatus == "live" && React.createElement(
			"div",
			{ onClick: function onClick(e) {
					return handleMatchClick(e, "https://www.tipsport.cz/live", true);
				}, className: "match-tab" },
			React.createElement("img", { src: "../img/icoTipsport.svg", alt: "" }),
			React.createElement(
				"p",
				null,
				"Lives\xE1zka"
			)
		),
		matchStatus == "po zápase" && React.createElement(
			"div",
			{ onClick: function onClick(e) {
					return handleMatchClick(e, "https://www.nhl.cz/zapas/" + hokejId + "/");
				}, className: "match-tab" },
			React.createElement("img", { src: "../img/icoSummary.svg", alt: "" }),
			React.createElement(
				"p",
				null,
				"Z\xE1pis"
			)
		)
	);
};

var ScoreboardButton = function ScoreboardButton() {
	return React.createElement(
		"a",
		{ href: "https://nhl.cz/sezona/zapasy", className: "scoreBoard-button" },
		"Rozpis z\xE1pas\u016F"
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
ReactDOM.render(React.createElement(Render), domContainer);