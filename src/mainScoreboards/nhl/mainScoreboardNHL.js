const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useEffect, createRoot, useRef } = React

const queryClient = new QueryClient()

const MainScoreboard = () => {
	const nhlKeys = ["425", "101"]
	const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]

	let date = new Date()
	//let date = new Date(2023, 4, 5)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	let today = year + "-" + month + "-" + day

	const [dayClicks, setDayClicks] = useState(0)
	const [dayName, setDayName] = useState(days[date.getDay()])
	const [displayDate, setDisplayDate] = useState(day + "." + month + "." + year)
	const [APIDate, setAPIDate] = useState(year + "-" + month + "-" + day)
	const [refetch, setRefetch] = useState(false)
	const [noData, setNoData] = useState(true)
	const [maxDate, setMaxDate] = useState(false)

	const prevDate = () => {
		setDayClicks(dayClicks - 1)
		setRefetch(false)
		setNoData(true)

		if (dayClicks >= 6) {
			setMaxDate(true)
		} else {
			setMaxDate(false)
		}

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks - 1)))
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		if (day < 10) day = "0" + day
		if (month < 10) month = "0" + month
		setDayName(days[date.getDay()])
		setDisplayDate(day + "." + month + "." + year)
		setAPIDate(year + "-" + month + "-" + day)
	}
	const nextDate = () => {
		setDayClicks(dayClicks + 1)
		setRefetch(false)
		setNoData(true)

		if (dayClicks >= 6) {
			setMaxDate(true)
		} else {
			setMaxDate(false)
		}

		date = new Date(new Date().setDate(new Date().getDate() + (dayClicks + 1)))
		year = date.getFullYear()
		month = date.getMonth() + 1
		day = date.getDate()
		if (day < 10) day = "0" + day
		if (month < 10) month = "0" + month
		setDayName(days[date.getDay()])
		setDisplayDate(day + "." + month + "." + year)
		setAPIDate(year + "-" + month + "-" + day)
	}

	/* API FETCHING */
	const apiURL = "https://s3-eu-west-1.amazonaws.com/nhl.cz/scoreboard/"

	const dataQuery = useQuery(["data"], () => fetch(`${apiURL}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: refetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => {
			setRefetch(5000)
		},
		onError: (res) => setRefetch(false),
		enabled: APIDate == today ? true : false,
	})
	/* END API FETCHING */

	useEffect(() => {
		dataQuery.refetch()
	}, [APIDate])

	useEffect(() => {
		if (dataQuery.data != undefined) {
			Object.entries(dataQuery.data).forEach((league) => {
				if (nhlKeys.includes(league[0])) setNoData(false)
			})
		}
	}, [dataQuery.data, dataQuery.isSuccess])

	return (
		<section className="mainScoreboard">
			{dataQuery.isFetching ? <div className="loadContainer"></div> : ""}
			<ScoreboardHeader prevDate={prevDate} nextDate={nextDate} dayName={dayName} displayDate={displayDate} />
			{dataQuery.isSuccess && !noData && !maxDate ? (
				<ScoreboardBody data={dataQuery.data} dayName={dayName} APIDate={APIDate} keys={nhlKeys} />
			) : (
				<NoData />
			)}
			{dataQuery.isSuccess && !noData && !maxDate && <ScoreboardButton />}
		</section>
	)
}

const ScoreboardHeader = ({ prevDate, nextDate, dayName, displayDate }) => (
	<header className="mainScoreboard-header">
		<div className="header-date">
			<div className="date-dayChanger prev" onClick={prevDate}>
				<img src="../img/ArrowLeftGrey.svg" alt="" />
				<h5>Předchozí den</h5>
			</div>
			<h1 className="date-currentDay">
				{dayName} {displayDate.replaceAll(".", ". ")}
			</h1>
			<div className="date-dayChanger next" onClick={nextDate}>
				<h5>Následující den</h5>
				<img src="../img/ArrowRightGrey.svg" alt="" />
			</div>
		</div>
	</header>
)

const ScoreboardBody = ({ APIDate, data, dayName, keys }) => (
	<div className="mainScoreBoard-body">
		{data != undefined &&
			Object.entries(data).map(([key, value]) => {
				if (keys.includes(key)) {
					return (
						<div key={key}>
							{value.matches.map((match) => {
								let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.logo_id}`
								let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.logo_id}`

								if (APIDate == match.date) {
									return (
										<a
											href={`https://www.nhl.cz/zapas/${match.hokejcz_id}/`}
											className="body-match"
											key={match.hokejcz_id != 0 ? match.hokejcz_id : match.onlajny_id}
										>
											<div className="match-infoContainer">
												<MatchTeam logo={homeLogo} shortName={match.home.short_name} shortcut={match.home.shortcut} left={true} />
												<MatchCenterInfo match={match} dayName={dayName} />
												<MatchTeam logo={visitorsLogo} shortName={match.visitor.short_name} shortcut={match.visitor.shortcut} />
											</div>
											<MatchTabs tipsport={match.bets.tipsport} matchStatus={match.match_status} hokejId={match.hokejcz_id} />
										</a>
									)
								}
							})}
						</div>
					)
				}
			})}
	</div>
)

const MatchCenterInfo = ({ match, dayName }) => (
	<div className="match-scoreContainer">
		<MatchScore matchStatus={match.match_status} score={match.score_home} />
		{match.match_status == "zrušeno" && (
			<div className="match-date">
				<p>Odloženo</p>
			</div>
		)}
		{match.match_status == "před zápasem" && <MatchFutureInfo dayName={dayName} matchDate={match.date} matchTime={match.time} />}
		{match.match_status == "live" && (
			<MatchLiveInfo
				actualTime={match.match_actual_time_alias}
				scorePeriod={match.score_period}
				scoreHome={match.score_home}
				scoreVisitor={match.score_visitor}
			/>
		)}
		{match.match_status == "po zápase" && (
			<MatchPlayedInfo
				actualTime={match.match_actual_time_alias}
				scorePeriod={match.score_period}
				scoreHome={match.score_home}
				scoreVisitor={match.score_visitor}
			/>
		)}
		<MatchScore matchStatus={match.match_status} score={match.score_visitor} />
	</div>
)

const MatchScore = ({ matchStatus, score }) => (
	<div className={"match-score " + (matchStatus == "před zápasem" ? "future-match" : matchStatus == "live" ? "active-match" : "")}>
		{score}
	</div>
)

const MatchFutureInfo = ({ dayName, matchDate, matchTime }) => (
	<div className="match-date future-match">
		<p>{dayName}</p>
		<p>
			{matchDate.replace(/-/gi, ".")} • {matchTime}
		</p>
	</div>
)

const MatchLiveInfo = ({ actualTime, scorePeriod, scoreHome, scoreVisitor }) => (
	<div className="match-date active-match">
		<p>
			{actualTime == "0"
				? "1. př."
				: actualTime == "10"
				? "1. př."
				: actualTime == "20"
				? "2. př."
				: actualTime == "30"
				? "3. př."
				: actualTime == "4"
				? "P"
				: actualTime == "N"
				? "SN"
				: actualTime == "1P"
				? "po 1. tř"
				: actualTime == "2P"
				? "po 2. tř"
				: actualTime == "3P"
				? "po 3. tř"
				: `${actualTime}. tř.`}
		</p>
		<p>
			{scorePeriod[0]}, {scorePeriod[1]}, {scorePeriod[2]}
			{actualTime == "KP" && ` - ${scoreHome > scoreVisitor ? "1:0" : "0:1"}`}
			{actualTime == "KN" && " - 0:0"}
			{actualTime == "KN" && " - 0:0"}
		</p>
	</div>
)

const MatchPlayedInfo = ({ actualTime, scorePeriod, scoreHome, scoreVisitor }) => (
	<div className="match-date">
		<p>{actualTime == "KP" ? "Po prodloužení" : actualTime == "KN" ? "Po nájezdech" : "Konec"}</p>
		<p>
			{scorePeriod[0]}, {scorePeriod[1]}, {scorePeriod[2]}
			{actualTime == "KP" && ` - ${scoreHome > scoreVisitor ? "1:0" : "0:1"}`}
			{actualTime == "KN" && " - 0:0"}
		</p>
	</div>
)

const MatchTeam = ({ logo, shortName, shortcut, left }) => (
	<div className={`match-team${left ? " match-team--left" : ""}`}>
		{!left && (
			<div className="match-team--img">
				<img src={logo} alt="" />
			</div>
		)}
		<h3 className="shortName">{shortName ? shortName : shortcut}</h3>
		<h3>{shortcut}</h3>
		{left && (
			<div className="match-team--img">
				<img src={logo} alt="" />
			</div>
		)}
	</div>
)

const MatchTabs = ({ hokejId, tipsport, matchStatus }) => {
	const handleMatchClick = (e, path, newTab) => {
		e.stopPropagation()
		e.preventDefault()
		if (newTab == true) {
			window.open(path, "_blank")
		} else {
			window.location.href = path
		}
	}

	return (
		<div className="match-tabsContainer">
			{matchStatus == "před zápasem" && (
				<div onClick={(e) => handleMatchClick(e, tipsport.link, true)} className="match-tab">
					<img src="../img/icoTipsport.svg" alt="" />
					<div className="tab-tipsportData">
						<p>{tipsport.home_win}</p>
						<p>{tipsport.draw}</p>
						<p>{tipsport.away_win}</p>
					</div>
				</div>
			)}
			{matchStatus == "live" && (
				<div onClick={(e) => handleMatchClick(e, `https://www.tipsport.cz/live`, true)} className="match-tab">
					<img src="../img/icoPlay.svg" alt="" />
					<p>Živě</p>
				</div>
			)}
			{matchStatus == "live" && (
				<div onClick={(e) => handleMatchClick(e, `https://www.nhl.cz/zapas/${hokejId}/on-line`)} className="match-tab">
					<img src="../img/icoText.svg" alt="" />
					<p>Text</p>
				</div>
			)}
			{matchStatus == "live" && (
				<div onClick={(e) => handleMatchClick(e, `https://www.tipsport.cz/live`, true)} className="match-tab">
					<img src="../img/icoTipsport.svg" alt="" />
					<p>Livesázka</p>
				</div>
			)}
			{matchStatus == "po zápase" && (
				<div onClick={(e) => handleMatchClick(e, `https://www.nhl.cz/zapas/${hokejId}/`)} className="match-tab">
					<img src="../img/icoSummary.svg" alt="" />
					<p>Zápis</p>
				</div>
			)}
		</div>
	)
}

const ScoreboardButton = () => (
	<a href={"https://nhl.cz/sezona/zapasy"} className="scoreBoard-button">
		Rozpis zápasů
	</a>
)

const NoData = () => (
	<div className="mainScoreBoard-body--noData">
		<h1>Žádné zápasy k zobrazení</h1>
	</div>
)

const Render = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<MainScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#main-scoreboard")
ReactDOM.render(React.createElement(Render), domContainer)
