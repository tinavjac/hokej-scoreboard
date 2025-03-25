var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useRef = _React.useRef;


var queryClientTop = new QueryClient();

var TopScoreboard = function TopScoreboard() {
	var date = new Date();
	//let date = new Date(2023, 4, 5)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	var date2 = new Date(new Date().setDate(date.getDate() + 1));
	//let date2 = new Date(2023, 4, 6)
	var year2 = date2.getFullYear();
	var month2 = date2.getMonth() + 1;
	var day2 = date2.getDate();
	if (day2 < 10) day2 = "0" + day2;
	if (month2 < 10) month2 = "0" + month2;

	var today = year + "-" + month + "-" + day;
	var tomorow = year2 + "-" + month2 + "-" + day2;

	var _useState = useState(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    refetch = _useState2[0],
	    setRefetch = _useState2[1];

	/* API FETCHING */


	var apiURL = "https://json.esports.cz/nhlcz/scoreboard/";

	var todayQuery = useQuery("today", function () {
		return fetch("" + apiURL + today + ".json").then(function (res) {
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
			return setRefetch(5000);
		},
		onError: function onError(res) {
			return setRefetch(false);
		}
	});
	var tomorowQuery = useQuery("tomorow", function () {
		return fetch("" + apiURL + tomorow + ".json").then(function (res) {
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
		todayQuery.data != undefined || tomorowQuery.data != undefined ? React.createElement(
			"div",
			{ className: "topScoreboard-container" },
			React.createElement(
				"section",
				{
					className: "topScoreboard",
					ref: scrollContainer,
					onMouseDown: mouseDownHandler,
					onMouseMove: mouseMoveHandler,
					onMouseUp: mouseUpHandler
				},
				todayQuery.data != undefined && React.createElement(DayMatches, { data: todayQuery.data, date: date, apiDate: today, day: day, month: month, year: year }),
				tomorowQuery.data != undefined && React.createElement(DayMatches, { data: tomorowQuery.data, date: date2, apiDate: tomorow, day: day2, month: month2, year: year2 })
			)
		) : React.createElement(React.Fragment, null)
	);
};

var DayMatches = function DayMatches(_ref) {
	var data = _ref.data,
	    date = _ref.date,
	    apiDate = _ref.apiDate,
	    day = _ref.day,
	    month = _ref.month,
	    year = _ref.year;

	var days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
	var nhlKeys = ["425", "101"];
	return React.createElement(
		React.Fragment,
		null,
		Object.entries(data).map(function (_ref2) {
			var _ref3 = _slicedToArray(_ref2, 2),
			    leagueKey = _ref3[0],
			    league = _ref3[1];

			var isFake = league.matches.every(function (match) {
				return apiDate != match.date;
			});
			if (!isFake && nhlKeys.includes(leagueKey)) {
				return React.createElement(
					"section",
					{ className: "day-container", key: leagueKey, style: { pointerEvents: scroll.pointerEvents ? "all" : "none" } },
					React.createElement(
						"div",
						{ className: "day-name" },
						React.createElement(
							"h3",
							null,
							days[date.getDay()],
							" ",
							React.createElement("br", null),
							day,
							".",
							month,
							".",
							year
						),
						React.createElement("img", { src: "../img/ArrowRightBlack.svg", alt: "" })
					),
					league.matches.map(function (match) {
						var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.logo_id;
						var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.logo_id;
						if (apiDate == match.date) {
							return React.createElement(
								"a",
								{ href: "https://www.nhl.cz/zapas/" + match.hokejcz_id + "/", className: "match", key: match.onlajny_id },
								React.createElement(Team, {
									logo: homeLogo,
									shortcut: match.home.shortcut,
									matchStatus: match.match_status,
									score: match.score_home,
									seriesScore: match.series[0]
								}),
								React.createElement(Team, {
									logo: visitorsLogo,
									shortcut: match.visitor.shortcut,
									matchStatus: match.match_status,
									score: match.score_visitor,
									seriesScore: match.series[2]
								})
							);
						}
					})
				);
			}
		})
	);
};

var Team = function Team(_ref4) {
	var logo = _ref4.logo,
	    shortcut = _ref4.shortcut,
	    matchStatus = _ref4.matchStatus,
	    score = _ref4.score,
	    seriesScore = _ref4.seriesScore;
	return React.createElement(
		"div",
		{ className: "team" },
		React.createElement(
			"div",
			{ className: "team-container" },
			React.createElement("img", { src: logo, alt: "" }),
			React.createElement(
				"p",
				{ className: "team-name" },
				shortcut
			)
		),
		React.createElement(
			"div",
			{ className: "team-score " + (matchStatus == "před zápasem" ? "future-match" : matchStatus == "live" ? "active-match" : "") },
			score
		),
		seriesScore && seriesScore.length > 0 && React.createElement(
			"div",
			{ className: "series-score" },
			seriesScore
		)
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