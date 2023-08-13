var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ReactQuery = ReactQuery,
    QueryClient = _ReactQuery.QueryClient,
    QueryClientProvider = _ReactQuery.QueryClientProvider,
    useQuery = _ReactQuery.useQuery;
var _React = React,
    useState = _React.useState,
    useRef = _React.useRef,
    useEffect = _React.useEffect;


var queryClient = new QueryClient();

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

	var _useState3 = useState(null),
	    _useState4 = _slicedToArray(_useState3, 2),
	    data = _useState4[0],
	    setData = _useState4[1];

	/* API FETCHING */


	var urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/";

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

	useEffect(function () {
		if (czechQuery.data) {
			setData(Object.entries(czechQuery.data).find(function (el) {
				return el[0] == 82;
			}));
		}
	}, [czechQuery.isSuccess, czechRefetch]);

	return React.createElement(
		"div",
		{ className: "topScoreboard-container" },
		data != null ? React.createElement(
			"section",
			{
				className: "topScoreboard",
				ref: scrollContainer,
				onMouseDown: mouseDownHandler,
				onMouseMove: mouseMoveHandler,
				onMouseUp: mouseUpHandler
			},
			data[1].matches.map(function (match) {
				var homeLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.home.onlajny_id;
				var visitorsLogo = "https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/" + match.visitor.onlajny_id;
				return React.createElement(
					"a",
					{ href: "https://www.hokej.cz/zapas/" + match.hokejcz_id + "/", className: "league-match", key: match.hokejcz_id },
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

var domContainer = document.querySelector("#top-scoreboard-chanceliga");
ReactDOM.render(React.createElement(Render), domContainer);
/* ReactDOM.createRoot(domContainer).render(<Render />) */