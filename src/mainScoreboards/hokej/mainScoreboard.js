const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useEffect, createRoot, useRef } = React

const queryClient = new QueryClient()

const MainScoreboard = (props) => {
	const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]
	let date = new Date()

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

	let mladezLeagues = [
		81, 112, 109, 41, 3079, 657, 39, 40, 168, 38, 254, 894, 131, 1656, 634, 975, 49, 962, 3441, 3912, 293, 2802, 868, 1864, 2712,
		1258, 179, 856, 119, 63, 112, 110, 80, 174, 176, 198,
	]

	let womanLeagues = [658, 342, 3162, 2380, 3086]

	const onlineLeagues = ["1828", "33", "112", "3969", "28", "26", "3853", "30", "197", "32", "3282"]

	const isMladez = () => {
		if (typeof shownLeagues != "undefined") {
			if (shownLeagues.length == mladezLeagues.length) {
				shownLeagues.forEach((league) => {
					if (!mladezLeagues.includes(league)) {
						return false
					}
				})
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	const isOnlineLeague = (key) => {
		return onlineLeagues.some((item) => item === key)
	}

	const renderOnPage = () => {
		if (typeof shownLeagues != "undefined") {
			if (shownLeagues.length == 1 && shownLeagues.includes(147)) {
				return false
			} else if (shownLeagues.length == womanLeagues.length) {
				shownLeagues.forEach((league) => {
					if (!womanLeagues.includes(league)) {
						return true
					}
				})
				return false
			} else {
				return true
			}
		} else {
			return true
		}
	}

	const prevDate = () => {
		setDayClicks(dayClicks - 1)
		setForeignRefetch(false)
		setCzechRefetch(false)
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
		setForeignRefetch(false)
		setCzechRefetch(false)
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
	const [czechRefetch, setCzechRefetch] = useState(false)
	const [foreignRefetch, setForeignRefetch] = useState(false)
	const [activeLeagueTab, setActiveLeagueTab] = useState("")
	const [buttonsUrl, setButtonsUrl] = useState(null)
	const [noData, setNoData] = useState(true)
	const [maxDate, setMaxDate] = useState(false)

	const urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/"
	const urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/"

	const foreignQuery = useQuery(["foreign"], () => fetch(`${urlForeignRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => {
			setForeignRefetch(5000)
		},
		onError: (res) => setForeignRefetch(false),
		enabled: APIDate == today ? true : false,
	})
	const czechQuery = useQuery(["czech"], () => fetch(`${urlCzechRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => {
			setCzechRefetch(5000)
		},
		onError: (res) => setCzechRefetch(false),
		enabled: APIDate == today ? true : false,
	})
	const LeagueTabs = useRef(null)
	const MainScoreboard = useRef(null)

	const [scroll, setScroll] = useState({
		pointerEvents: true,
		isScrolling: false,
		left: 0,
		x: 0,
	})

	const mouseDownHandler = function (e) {
		LeagueTabs.current.style.cursor = "grabbing"
		LeagueTabs.current.style.userSelect = "none"
		setScroll({
			pointerEvents: true,
			isScrolling: true,
			left: LeagueTabs.current.scrollLeft,
			x: e.clientX,
		})
	}
	const mouseMoveHandler = function (e) {
		e.stopPropagation()
		if (scroll.isScrolling) {
			setScroll({ ...scroll, pointerEvents: false })
			const dx = e.clientX - scroll.x
			LeagueTabs.current.scrollLeft = scroll.left - dx
		}
	}
	const mouseUpHandler = function (e) {
		LeagueTabs.current.style.cursor = "grab"
		LeagueTabs.current.style.removeProperty("user-select")
		setScroll({ ...scroll, isScrolling: false, pointerEvents: true })
		e.stopPropagation()
	}

	const handleMatchClick = (e, path, newTab) => {
		e.stopPropagation()
		e.preventDefault()
		if (newTab == true) {
			window.open(path, "_blank")
		} else {
			window.location.href = path
		}
	}

	const displayStreamMatch = (time, state) => {
		let matchTime = time.split(":").map((el) => Number(el))

		if (date.getHours() === matchTime[0] && date.getMinutes() + 15 >= matchTime[1]) {
			return true
		} else if (state == "live") {
			return true
		} else {
			return false
		}
	}

	useEffect(() => {
		czechQuery.refetch()
		foreignQuery.refetch()
	}, [APIDate])

	const [scoreboardWidth, setScoreboardWidth] = useState(undefined)
	useEffect(() => {
		if (MainScoreboard.current) {
			setScoreboardWidth(MainScoreboard.current.clientWidth)
		}
	}, [])

	useEffect(() => {
		let leagues = []
		if (LeagueTabs.current) {
			LeagueTabs.current.childNodes.forEach((data) => {
				leagues.push({
					id: data.getAttribute("id"),
					priority: data.getAttribute("data-order"),
				})
			})
			leagues.sort((a, b) => {
				return b.priority - a.priority
			})
			if (leagues.length > 0) {
				setNoData(false)
				setActiveLeagueTab(leagues[0].id)
			}
		}
	}, [czechRefetch, foreignRefetch, czechQuery.isSuccess, foreignQuery.isSuccess])

	useEffect(() => {
		Object.entries(scoreboardLeagues).map((value) => {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1])
			}
		})
	})

	return (
		<React.Fragment>
			{renderOnPage() && (
				<section className={"mainScoreboard" + (scoreboardWidth < 730 && !isMladez() ? " small" : "")} ref={MainScoreboard}>
					{foreignQuery.isFetching || czechQuery.isFetching == true ? <div className="loadContainer"></div> : ""}
					<header className={"mainScoreboard-header"}>
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
						{(czechQuery.isSuccess || foreignQuery.isSuccess) && !maxDate ? (
							<div
								onMouseDown={mouseDownHandler}
								onMouseMove={mouseMoveHandler}
								onMouseUp={mouseUpHandler}
								ref={LeagueTabs}
								className={"header-tabs"}
							>
								{czechQuery.data != undefined &&
									Object.entries(czechQuery.data).map(([key, value]) => {
										let isFake = value.matches.every((match) => {
											return displayDate != match.date.replaceAll("-", ".")
										})
										let priority
										let render = false
										let leaguName
										Object.entries(scoreboardLeagues).map((value) => {
											if (value[1].id == key) {
												priority = value[1].priority
												leaguName = value[1].name
												if (value[1].sourceOnlajny === false) {
													if (typeof shownLeagues != "undefined") {
														shownLeagues.forEach((league) => {
															if (league == key) {
																render = true
															}
														})
													} else {
														render = true
													}
												}
											}
										})
										if (!isFake && render) {
											return (
												<div
													className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
													id={key}
													onClick={() => {
														setActiveLeagueTab(key)
													}}
													key={key}
													data-order={priority}
													style={{ order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }}
												>
													<p>{leaguName}</p>
												</div>
											)
										}
									})}
								{foreignQuery.data != undefined &&
									Object.entries(foreignQuery.data).map(([key, value]) => {
										let isFake = value.matches.every((match) => {
											return APIDate != match.date
										})
										let render = false
										let priority
										let leagueName
										Object.entries(scoreboardLeagues).map((value) => {
											if (value[1].id == key) {
												priority = value[1].priority
												leagueName = value[1].name
												if (value[1].sourceOnlajny === true) {
													if (typeof shownLeagues != "undefined") {
														shownLeagues.forEach((league) => {
															if (league == key) {
																render = true
															}
														})
													} else {
														render = true
													}
												}
											}
										})
										if (!isFake && render) {
											return (
												<div
													className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
													id={key}
													onClick={() => {
														setActiveLeagueTab(key)
													}}
													key={key}
													data-order={priority}
													style={{ order: -priority, pointerEvents: scroll.pointerEvents ? "all" : "none" }}
												>
													<p>{leagueName}</p>
												</div>
											)
										}
									})}
							</div>
						) : (
							<div></div>
						)}
					</header>
					{(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate ? (
						<div className="mainScoreBoard-body">
							{czechQuery.data != undefined &&
								Object.entries(czechQuery.data).map(([key, value]) => {
									if (key == activeLeagueTab) {
										console.log(value.matches)
										return (
											<div key={key}>
												{value.matches.map((match, index) => {
													let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
													let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
													let streamInfo

													if (streamMatch && displayStreamMatch(match.time, match.match_status)) {
														streamInfo = streamMatch[match.hokejcz_id]
													}

													return (
														<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="body-match" key={index}>
															<div className="match-infoContainer">
																<div className="match-team match-team--left">
																	<h3 className="shortName">{match.home.short_name ? match.home.short_name : match.home.shortcut}</h3>
																	<h3>{match.home.shortcut}</h3>
																	<div className="match-team--img">
																		<img src={homeLogo} alt="" />
																	</div>
																</div>
																<div className="match-scoreContainer">
																	<div
																		className={
																			"match-score " +
																			(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																		}
																	>
																		{match.score_home}
																	</div>
																	{match.match_status == "zrušeno" && (
																		<div className="match-date">
																			<p>Odloženo</p>
																		</div>
																	)}
																	{match.match_status == "po zápase" && (
																		<div className="match-date">
																			<p>
																				{match.match_actual_time_alias == "KP"
																					? "Po prodloužení"
																					: match.match_actual_time_alias == "KN"
																					? "Po nájezdech"
																					: "Konec"}
																			</p>

																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																				{match.match_actual_time_alias == "KP" &&
																					` - ${
																						match.score_home > match.score_visitor ? "1:0" : match.score_home < match.score_visitor ? "0:1" : "0:0"
																					}`}
																				{match.match_actual_time_alias == "KN" && " - 0:0"}
																			</p>
																		</div>
																	)}
																	{match.match_status == "před zápasem" && (
																		<div className="match-date future-match">
																			<p>{dayName}</p>
																			<p>
																				{match.date.replace(/-/gi, ".")} • {match.time}
																			</p>
																		</div>
																	)}
																	{match.match_status == "live" && (
																		<div className="match-date active-match">
																			<p>
																				{match.match_actual_time_alias == "0"
																					? "1. př."
																					: match.match_actual_time_alias == "10"
																					? "1. př."
																					: match.match_actual_time_alias == "20"
																					? "2. př."
																					: match.match_actual_time_alias == "30"
																					? "3. př."
																					: match.match_actual_time_alias == "P"
																					? "P"
																					: match.match_actual_time_alias == "N"
																					? "SN"
																					: match.match_actual_time_alias == "1P"
																					? "po 1. tř"
																					: match.match_actual_time_alias == "2P"
																					? "po 2. tř"
																					: match.match_actual_time_alias == "3P"
																					? "po 3. tř"
																					: `${match.match_actual_time_alias}. tř.`}
																			</p>

																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																				{match.match_actual_time_alias == "KP" &&
																					` - ${
																						match.score_home > match.score_visitor ? "1:0" : match.score_home < match.score_visitor ? "0:1" : "0:0"
																					}`}
																				{match.match_actual_time_alias == "KN" && " - 0:0"}
																			</p>
																		</div>
																	)}

																	<div
																		className={
																			"match-score " +
																			(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																		}
																	>
																		{match.score_visitor}
																	</div>
																</div>
																<div className="match-team">
																	<div className="match-team--img">
																		<img src={visitorsLogo} alt="" />
																	</div>
																	<h3 className="shortName">{match.visitor.short_name ? match.visitor.short_name : match.visitor.shortcut}</h3>
																	<h3>{match.visitor.shortcut}</h3>
																</div>
															</div>
															<div className="match-tabsContainer">
																<div className="mediaTab-container">
																	{streamInfo && (
																		<div
																			onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/adhoc-stream`, true)}
																			className="match-tab--imgOnly"
																		>
																			<img src="../img/cro.svg" alt="" />
																		</div>
																	)}
																	{(value.league_name == "Tipsport extraliga" || value.league_name == "CHANCE LIGA") &&
																		(match.match_status == "před zápasem" || match.match_status == "live") && (
																			<React.Fragment>
																				{match.stream_url == "ct" && (
																					<div
																						onClick={(e) => handleMatchClick(e, `https://sport.ceskatelevize.cz/#live`, true)}
																						className="match-tab--imgOnly"
																					>
																						<img src="../img/logoCT@2x.png" alt="" />
																					</div>
																				)}
																				{match.stream_url == "o2" && (
																					<div onClick={(e) => handleMatchClick(e, `https://www.o2tv.cz/`, true)} className="match-tab--imgOnly">
																						<img src="../img/logoO2@2x.png" alt="" />
																					</div>
																				)}
																				{match.stream_url == "cto2" && (
																					<React.Fragment>
																						<div
																							onClick={(e) => handleMatchClick(e, `https://sport.ceskatelevize.cz/#live`, true)}
																							className="match-tab--imgOnly"
																						>
																							<img src="../img/logoCT@2x.png" alt="" />
																						</div>
																						<div onClick={(e) => handleMatchClick(e, `https://www.o2tv.cz/`, true)} className="match-tab--imgOnly">
																							<img src="../img/logoO2@2x.png" alt="" />
																						</div>
																					</React.Fragment>
																				)}
																			</React.Fragment>
																		)}
																</div>
																{(match.match_status == "live" || match.match_status == "před zápasem") && value.league_name == "CHANCE LIGA" && (
																	<div>
																		{match.stream_url == "ct" && (
																			<div onClick={(e) => handleMatchClick(e, `https://sport.ceskatelevize.cz/#live`, true)} className="match-tab">
																				<img src="../img/icoPlay.svg" alt="" />
																				<p>Živě</p>
																			</div>
																		)}
																		{match.stream_url == "o2" && (
																			<div onClick={(e) => handleMatchClick(e, `https://www.o2tv.cz/`, true)} className="match-tab">
																				<img src="../img/icoPlay.svg" alt="" />
																				<p>Živě</p>
																			</div>
																		)}
																		{!match.stream_url && (
																			<div
																				onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/tv/hokejka/chl?matchId=${match.hokejcz_id}/`)}
																				className="match-tab"
																			>
																				<img src="../img/icoPlay.svg" alt="" />
																				<p>Živě</p>
																			</div>
																		)}
																	</div>
																)}
																{(match.match_status == "live" || match.match_status == "před zápasem") &&
																	value.league_name == "Tipsport extraliga" && (
																		<div>
																			{match.stream_url == "ct" && (
																				<div onClick={(e) => handleMatchClick(e, `https://sport.ceskatelevize.cz/#live`, true)} className="match-tab">
																					<img src="../img/icoPlay.svg" alt="" />
																					<p>Živě</p>
																				</div>
																			)}
																			{match.stream_url == "o2" && (
																				<div onClick={(e) => handleMatchClick(e, `https://www.o2tv.cz/`, true)} className="match-tab">
																					<img src="../img/icoPlay.svg" alt="" />
																					<p>Živě</p>
																				</div>
																			)}
																		</div>
																	)}
																{match.match_status == "live" &&
																	(value.league_name == "Tipsport extraliga" || value.league_name == "CHANCE LIGA") && (
																		<div
																			onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`)}
																			className="match-tab"
																		>
																			<img src="../img/icoText.svg" alt="" />
																			<p>Text</p>
																		</div>
																	)}
																{value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && (
																	<div
																		onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/preview`)}
																		className="match-tab"
																	>
																		<img src="../img/icoTextGray.svg" alt="" />
																		<p>Preview</p>
																	</div>
																)}
																{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
																	<div onClick={(e) => handleMatchClick(e, match.bets.tipsport.link, true)} className="match-tab">
																		<img src="../img/icoTipsport.svg" alt="" />
																		<div className="tab-tipsportData">
																			<p>{match.bets.tipsport.home_win}</p>
																			<p>{match.bets.tipsport.draw}</p>
																			<p>{match.bets.tipsport.away_win}</p>
																		</div>
																	</div>
																)}
																{match.bets.tipsport.link != null && match.match_status == "live" && (
																	<div onClick={(e) => handleMatchClick(e, `https://www.tipsport.cz/live`, true)} className="match-tab">
																		<img src="../img/icoTipsport.svg" alt="" />
																		<p>Livesázka</p>
																	</div>
																)}
																{match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && (
																	<div onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/tv/hokejka/category/14`)} className="match-tab">
																		<img src="../img/icoPlayBlack.svg" alt="" />
																		<p>Záznam</p>
																	</div>
																)}
																{match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && (
																	<div onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/tv/hokejka/category/23`)} className="match-tab">
																		<img src="../img/icoPlayBlack.svg" alt="" />
																		<p>Záznam</p>
																	</div>
																)}
																{match.match_status == "po zápase" && (
																	<div
																		onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/`)}
																		className="match-tab"
																	>
																		<img src="../img/icoSummary.svg" alt="" />
																		<p>Zápis</p>
																	</div>
																)}
															</div>
														</a>
													)
												})}
											</div>
										)
									}
								})}
							{foreignQuery.data != undefined &&
								Object.entries(foreignQuery.data).map(([key, value]) => {
									if (key == activeLeagueTab && value.league_name != "NHL") {
										return (
											<div key={key}>
												{value.matches.map((match) => {
													let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.logo_id}`
													let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.logo_id}`

													if (APIDate == match.date) {
														return (
															<a
																href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`}
																className="body-match"
																key={match.hokejcz_id != 0 ? match.hokejcz_id : match.onlajny_id}
															>
																<div className="match-infoContainer">
																	<div className="match-team match-team--left">
																		<h3 className="shortName">{match.home.short_name ? match.home.short_name : match.home.shortcut}</h3>
																		<h3>{match.home.shortcut}</h3>
																		<div className="match-team--img">
																			<img src={homeLogo} alt="" />
																		</div>
																	</div>
																	<div className="match-scoreContainer">
																		<div
																			className={
																				"match-score " +
																				(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																			}
																		>
																			{match.score_home}
																		</div>
																		{match.match_status == "zrušeno" && (
																			<div className="match-date">
																				<p>Odloženo</p>
																			</div>
																		)}
																		{match.match_status == "po zápase" && (
																			<div className="match-date">
																				<p>
																					{match.match_actual_time_alias == "KP"
																						? "Po prodloužení"
																						: match.match_actual_time_alias == "KN"
																						? "Po nájezdech"
																						: "Konec"}
																				</p>

																				<p>
																					{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																					{match.match_actual_time_alias == "KP" && ` - ${match.score_home > match.score_visitor ? "1:0" : "0:1"}`}
																					{match.match_actual_time_alias == "KN" && " - 0:0"}
																				</p>
																			</div>
																		)}
																		{match.match_status == "před zápasem" && (
																			<div className="match-date future-match">
																				<p>{dayName}</p>
																				<p>
																					{match.date.replace(/-/gi, ".")} • {match.time}
																				</p>
																			</div>
																		)}
																		{match.match_status == "live" && (
																			<div className="match-date active-match">
																				<p>
																					{match.match_actual_time_alias == "0"
																						? "1. př."
																						: match.match_actual_time_alias == "10"
																						? "1. př."
																						: match.match_actual_time_alias == "20"
																						? "2. př."
																						: match.match_actual_time_alias == "30"
																						? "3. př."
																						: match.match_actual_time_alias == "4"
																						? "P"
																						: match.match_actual_time_alias == "N"
																						? "SN"
																						: match.match_actual_time_alias == "1P"
																						? "po 1. tř"
																						: match.match_actual_time_alias == "2P"
																						? "po 2. tř"
																						: match.match_actual_time_alias == "3P"
																						? "po 3. tř"
																						: `${match.match_actual_time_alias}. tř.`}
																				</p>

																				<p>
																					{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																					{match.match_actual_time_alias == "KP" && ` - ${match.score_home > match.score_visitor ? "1:0" : "0:1"}`}
																					{match.match_actual_time_alias == "KN" && " - 0:0"}
																					{match.match_actual_time_alias == "KN" && " - 0:0"}
																				</p>
																			</div>
																		)}

																		<div
																			className={
																				"match-score " +
																				(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																			}
																		>
																			{match.score_visitor}
																		</div>
																	</div>
																	<div className="match-team">
																		<div className="match-team--img">
																			<img src={visitorsLogo} alt="" />
																		</div>
																		<h3 className="shortName">{match.visitor.short_name ? match.visitor.short_name : match.visitor.shortcut}</h3>
																		<h3>{match.visitor.shortcut}</h3>
																	</div>
																</div>
																<div className="match-tabsContainer">
																	{isOnlineLeague(key) && (
																		<div
																			onClick={(e) =>
																				handleMatchClick(
																					e,

																					`https://www.onlajny.com/match/index/date/${APIDate}/id/${match.onlajny_id}`,

																					true
																				)
																			}
																			className="match-tab"
																		>
																			<img src="../img/icoText.svg" alt="" />
																			<p>On-line přenos</p>
																		</div>
																	)}
																	{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
																		<div onClick={(e) => handleMatchClick(e, match.bets.tipsport.link, true)} className="match-tab">
																			<img src="../img/icoTipsport.svg" alt="" />
																			<div className="tab-tipsportData">
																				<p>{match.bets.tipsport.home_win}</p>
																				<p>{match.bets.tipsport.draw}</p>
																				<p>{match.bets.tipsport.away_win}</p>
																			</div>
																		</div>
																	)}
																	{match.match_status == "live" && !isOnlineLeague(key) && (
																		<div
																			onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`, true)}
																			className="match-tab"
																		>
																			<img src="../img/icoText.svg" alt="" />
																			<p>Text</p>
																		</div>
																	)}
																	{match.bets.tipsport.link != null && match.match_status == "live" && (
																		<div onClick={(e) => handleMatchClick(e, `https://www.tipsport.cz/live`, true)} className="match-tab">
																			<img src="../img/icoTipsport.svg" alt="" />
																			<p>Livesázka</p>
																		</div>
																	)}
																	{match.match_status == "po zápase" && (
																		<div
																			onClick={(e) => handleMatchClick(e, `https://www.hokej.cz/zapas/${match.hokejcz_id}/`)}
																			className="match-tab"
																		>
																			<img src="../img/icoSummary.svg" alt="" />
																			<p>Zápis</p>
																		</div>
																	)}
																</div>
															</a>
														)
													}
												})}
											</div>
										)
									}
								})}
						</div>
					) : (
						<NoData />
					)}
					{(czechQuery.isSuccess || foreignQuery.isSuccess) && !noData && !maxDate && (
						<div className="scoreBoard-buttonsContainer">
							<ScoreboardButton link={buttonsUrl ? buttonsUrl.url.matches : "#"} label={"Rozpis zápasů"} />
							<ScoreboardButton link={buttonsUrl ? buttonsUrl.url.table : "#"} label={"Tabulka soutěže"} />
						</div>
					)}
				</section>
			)}
		</React.Fragment>
	)
}

const ScoreboardButton = ({ link, label }) => (
	<a href={link} className="scoreBoard-button">
		{label}
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
/* ReactDOM.createRoot(domContainer).render(<Render />) */
ReactDOM.render(React.createElement(Render), domContainer)
