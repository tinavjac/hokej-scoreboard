const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useRef } = React

const queryClientTop = new QueryClient()

const TopScoreboard = () => {
	let date = new Date()
	//let date = new Date(2023, 4, 5)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	let date2 = new Date(new Date().setDate(date.getDate() + 1))
	//let date2 = new Date(2023, 4, 6)
	let year2 = date2.getFullYear()
	let month2 = date2.getMonth() + 1
	let day2 = date2.getDate()
	if (day2 < 10) day2 = "0" + day2
	if (month2 < 10) month2 = "0" + month2

	const today = year + "-" + month + "-" + day
	const tomorow = year2 + "-" + month2 + "-" + day2

	const [refetch, setRefetch] = useState(false)

	/* API FETCHING */
	const apiURL = "https://json.esports.cz/nhlcz/scoreboard/"

	const todayQuery = useQuery("today", () => fetch(`${apiURL}${today}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: refetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => setRefetch(5000),
		onError: (res) => setRefetch(false),
	})
	const tomorowQuery = useQuery("tomorow", () => fetch(`${apiURL}${tomorow}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: true,
	})
	/* END API FETCHING */

	const scrollContainer = useRef(null)

	const [scroll, setScroll] = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0,
	})

	const mouseDownHandler = function (e) {
		scrollContainer.current.style.cursor = "grabbing"
		scrollContainer.current.style.userSelect = "none"
		setScroll({
			pointerEvents: true,
			isScrolling: true,
			left: scrollContainer.current.scrollLeft,
			x: e.clientX,
		})
	}
	const mouseMoveHandler = function (e) {
		e.stopPropagation()
		if (scroll.isScrolling) {
			setScroll({ ...scroll, pointerEvents: false })
			const dx = e.clientX - scroll.x
			scrollContainer.current.scrollLeft = scroll.left - dx
		}
	}
	const mouseUpHandler = function (e) {
		scrollContainer.current.style.cursor = "grab"
		scrollContainer.current.style.removeProperty("user-select")
		setScroll({ ...scroll, isScrolling: false, pointerEvents: true })
		e.stopPropagation()
	}

	return (
		<React.Fragment>
			{todayQuery.data != undefined || tomorowQuery.data != undefined ? (
				<div className="topScoreboard-container">
					<section
						className="topScoreboard"
						ref={scrollContainer}
						onMouseDown={mouseDownHandler}
						onMouseMove={mouseMoveHandler}
						onMouseUp={mouseUpHandler}
					>
						{todayQuery.data != undefined && <DayMatches data={todayQuery.data} date={date} apiDate={today} day={day} month={month} year={year} />}
						{tomorowQuery.data != undefined && (
							<DayMatches data={tomorowQuery.data} date={date2} apiDate={tomorow} day={day2} month={month2} year={year2} />
						)}
					</section>
				</div>
			) : (
				<React.Fragment />
			)}
		</React.Fragment>
	)
}

const DayMatches = ({ data, date, apiDate, day, month, year }) => {
	const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]
	const nhlKeys = ["425", "101"]
	return (
		<React.Fragment>
			{Object.entries(data).map(([leagueKey, league]) => {
				let isFake = league.matches.every((match) => {
					return apiDate != match.date
				})
				if (!isFake && nhlKeys.includes(leagueKey)) {
					return (
						<section className="day-container" key={leagueKey} style={{ pointerEvents: scroll.pointerEvents ? "all" : "none" }}>
							<div className={"day-name"}>
								<h3>
									{days[date.getDay()]} <br />
									{day}.{month}.{year}
								</h3>

								<img src="../img/ArrowRightBlack.svg" alt="" />
							</div>
							{league.matches.map((match) => {
								let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.logo_id}`
								let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.logo_id}`
								if (apiDate == match.date) {
									return (
										<a href={`https://www.nhl.cz/zapas/${match.hokejcz_id}/`} className="match" key={match.onlajny_id}>
											<Team
												logo={homeLogo}
												shortcut={match.home.shortcut}
												matchStatus={match.match_status}
												score={match.score_home}
												seriesScore={match.series[0]}
											/>
											<Team
												logo={visitorsLogo}
												shortcut={match.visitor.shortcut}
												matchStatus={match.match_status}
												score={match.score_visitor}
												seriesScore={match.series[2]}
											/>
										</a>
									)
								}
							})}
						</section>
					)
				}
			})}
		</React.Fragment>
	)
}

const Team = ({ logo, shortcut, matchStatus, score, seriesScore }) => (
	<div className="team">
		<div className="team-container">
			<img src={logo} alt="" />
			<p className="team-name">{shortcut}</p>
		</div>
		<div className={"team-score " + (matchStatus == "před zápasem" ? "future-match" : matchStatus == "live" ? "active-match" : "")}>{score}</div>
		{seriesScore && seriesScore.length > 0 && <div className="series-score">{seriesScore}</div>}
	</div>
)

const Render = () => {
	return (
		<QueryClientProvider client={queryClientTop}>
			<TopScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#top-scoreboard")
ReactDOM.render(React.createElement(Render), domContainer)
