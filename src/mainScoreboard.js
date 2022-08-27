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

	const prevDate = () => {
		setDayClicks(dayClicks - 1)
		setActiveLeagueTab("")

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
		setActiveLeagueTab("")

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

	useEffect(() => {
		czechQuery.refetch()
		foreignQuery.refetch()
	}, [APIDate])

	useEffect(() => {
		if (LeagueTabs.current) {
			let firstTab = LeagueTabs.current.firstChild.id
			console.log(firstTab)
			setActiveLeagueTab(firstTab)
		}
	}, [LeagueTabs.current])

	useEffect(() => {
		Object.entries(scoreboardLeagues).map((value) => {
			if (value[1].id == activeLeagueTab) {
				setButtonsUrl(value[1])
			}
		})
	})

	return (
		<section className="mainScoreboard">
			{foreignQuery.isLoading || czechQuery.isLoading == true ? (
				<div className="loadContainer">
					<h3>Loading...</h3>
				</div>
			) : (
				""
			)}
			<header className={"mainScoreboard-header"}>
				<div className="header-date">
					<div className="date-dayChanger" onClick={prevDate}>
						<img src="../img/ArrowLeftGrey.svg" alt="" />
						<h5>Předchozí den</h5>
					</div>
					<h1 className="date-currentDay">
						{dayName} {displayDate}
					</h1>
					<div className="date-dayChanger" onClick={nextDate}>
						<h5>Následující den</h5>
						<img src="../img/ArrowRightGrey.svg" alt="" />
					</div>
				</div>
				{czechQuery.isSuccess || foreignQuery.isSuccess ? (
					<div ref={LeagueTabs} className={"header-tabs"}>
						{czechQuery.data != undefined &&
							Object.entries(czechQuery.data).map(([key, value]) => {
								return (
									<div
										className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
										id={key}
										onClick={() => {
											setActiveLeagueTab(key)
										}}
										key={value.league_name}
									>
										<p>{value.league_name}</p>
									</div>
								)
							})}
						{foreignQuery.data != undefined &&
							Object.entries(foreignQuery.data).map(([key, value]) => {
								let isFake = value.matches.every((match) => {
									return APIDate != match.date
								})
								if (!isFake) {
									return (
										<div
											className={"tab-container " + (key == activeLeagueTab ? "active" : "")}
											id={key}
											onClick={() => {
												setActiveLeagueTab(key)
											}}
											key={value.league_name}
										>
											<p>{value.league_name}</p>
										</div>
									)
								}
							})}
					</div>
				) : (
					<div></div>
				)}
			</header>
			{czechQuery.isSuccess || foreignQuery.isSuccess ? (
				<div className="mainScoreBoard-body">
					{czechQuery.data != undefined &&
						Object.entries(czechQuery.data).map(([key, value]) => {
							if (key == activeLeagueTab) {
								return (
									<div key={value.league_name}>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
											return (
												<a href={`/zapas/${match.hokejcz_id}/`} className="body-match" key={match.onlajny_id}>
													<div className="match-infoContainer">
														<div className="match-team match-team--left">
															<h3>{match.home.short_name != "" ? match.home.short_name : match.home.name}</h3>
															<h3 className="small-name">{match.home.shortcut}</h3>
															<img src={homeLogo} alt="" />
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
															{match.match_status == "po zápase" && (
																<div className="match-date">
																	<p>Konec</p>
																	<p>
																		{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
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
																<div className="match-date future-match">
																	<p>{match.match_actual_time_alias}</p>
																	{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
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
															<img src={visitorsLogo} alt="" />
															<h3>{match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name}</h3>
															<h3 className="small-name">{match.visitor.shortcut}</h3>
														</div>
													</div>

													<div className="match-tabsContainer">
														{value.league_name == "Tipsport extraliga" && match.match_status == "před zápasem" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/preview`} className="match-tab">
																<img src="../img/icoTextGray.svg" alt="" />
																<p>Preview</p>
															</a>
														)}
														{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
															<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																<img src="../img/icoTipsport.svg" alt="" />
																<div className="tab-tipsportData">
																	<p>{match.bets.tipsport.home_win}</p>
																	<p>{match.bets.tipsport.draw}</p>
																	<p>{match.bets.tipsport.away_win}</p>
																</div>
															</a>
														)}
														{value.league_name == "Tipsport extraliga" &&
															(match.match_status == "před zápasem" || match.match_status == "live") && (
																<div className="mediaTab-container">
																	<a href="#" target="_blank" className="match-tab--imgOnly">
																		<img src="../img/logoCT@2x.png" alt="" />
																	</a>
																	<a href="#" target="_blank" className="match-tab--imgOnly">
																		<img src="../img/logoO2@2x.png" alt="" />
																	</a>
																</div>
															)}
														{match.bets.tipsport.link != null && match.match_status == "live" && (
															<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																<img src="../img/icoTipsport.svg" alt="" />
																<p>Livesázka</p>
															</a>
														)}
														{match.match_status == "live" && value.league_name == "CHANCE LIGA" && (
															<a href={`https://www.hokej.cz/tv/hokejka/chl?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
																<img src="../img/icoPlay.svg" alt="" />
																<p>Živě</p>
															</a>
														)}
														{match.match_status == "live" && value.league_name == "Tipsport extraliga" && (
															<a href={`https://www.hokej.cz/tv/hokejka/elh?matchId=${match.hokejcz_id}/`} target="_blank" className="match-tab">
																<img src="../img/icoPlay.svg" alt="" />
																<p>Živě</p>
															</a>
														)}
														{match.match_status == "live" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`} target="_blank" className="match-tab">
																<img src="../img/icoText.svg" alt="" />
																<p>Text</p>
															</a>
														)}
														{match.match_status == "po zápase" && value.league_name == "Tipsport extraliga" && (
															<a href="https://www.hokej.cz/tv/hokejka/category/14" target="_blank" className="match-tab">
																<img src="../img/icoPlayBlack.svg" alt="" />
																<p>Záznam</p>
															</a>
														)}
														{match.match_status == "po zápase" && value.league_name == "CHANCE LIGA" && (
															<a href="https://www.hokej.cz/tv/hokejka/category/23" target="_blank" className="match-tab">
																<img src="../img/icoPlayBlack.svg" alt="" />
																<p>Záznam</p>
															</a>
														)}
														{match.match_status == "po zápase" && (
															<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="match-tab">
																<img src="../img/icoSummary.svg" alt="" />
																<p>Zápis</p>
															</a>
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
							if (key == activeLeagueTab) {
								return (
									<div key={value.league_name}>
										{value.matches.map((match) => {
											let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
											let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`

											if (APIDate == match.date) {
												return (
													<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="body-match" key={match.onlajny_id}>
														<div className="match-infoContainer">
															<div className="match-team match-team--left">
																<h3>{match.home.short_name != "" ? match.home.short_name : match.home.name}</h3>
																<h3 className="small-name">{match.home.shortcut}</h3>
																<img src={homeLogo} alt="" />
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
																{match.match_status == "po zápase" && (
																	<div className="match-date">
																		<p>Konec</p>

																		{match.score_periods != undefined && (
																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																			</p>
																		)}
																		{match.score_period != undefined && (
																			<p>
																				{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																			</p>
																		)}
																	</div>
																)}
																{match.match_status == "před zápasem" && (
																	<div className="match-date future-match">
																		<p>{APIDate == match.date ? dayName : "Zítra ráno"}</p>
																		<p>
																			{match.date.replace(/-/gi, ".")} • {match.time}
																		</p>
																	</div>
																)}
																{match.match_status == "live" && (
																	<div className="match-date active-match">
																		<p>{match.match_actual_time_name}</p>
																		{match.score_periods != undefined && (
																			<p>
																				{match.score_periods[0]}, {match.score_periods[1]}, {match.score_periods[2]}
																			</p>
																		)}
																		{match.score_period != undefined && (
																			<p>
																				{match.score_period[0]}, {match.score_period[1]}, {match.score_period[2]}
																			</p>
																		)}
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
																<img src={visitorsLogo} alt="" />
																<h3>{match.visitor.short_name != "" ? match.visitor.short_name : match.visitor.name}</h3>
																<h3 className="small-name">{match.visitor.shortcut}</h3>
															</div>
														</div>

														<div className="match-tabsContainer">
															{match.bets.tipsport.link != null && match.match_status == "před zápasem" && (
																<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																	<img src="../img/icoTipsport.svg" alt="" />
																	<div className="tab-tipsportData">
																		<p>{match.bets.tipsport.home_win}</p>
																		<p>{match.bets.tipsport.draw}</p>
																		<p>{match.bets.tipsport.away_win}</p>
																	</div>
																</a>
															)}
															{match.bets.tipsport.link != null && match.match_status == "live" && (
																<a href={match.bets.tipsport.link} target="_blank" className="match-tab">
																	<img src="../img/icoTipsport.svg" alt="" />
																	<p>Livesázka</p>
																</a>
															)}
															{match.match_status == "live" && (
																<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/on-line`} target="_blank" className="match-tab">
																	<img src="../img/icoText.svg" alt="" />
																	<p>Text</p>
																</a>
															)}
															{match.match_status == "po zápase" && (
																<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="match-tab">
																	<img src="../img/icoSummary.svg" alt="" />
																	<p>Zápis</p>
																</a>
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
				<div className="mainScoreBoard-body--noData">
					<h1>Žádné zápasy k zobrazení</h1>
				</div>
			)}
			<div className="scoreBoard-buttonsContainer">
				<a href={buttonsUrl ? buttonsUrl.url.matches : "#"} className="scoreBoard-button">
					Rozpis zápasů
				</a>
				<a href={buttonsUrl ? buttonsUrl.url.table : "#"} className="scoreBoard-button">
					Tabulka soutěže
				</a>
			</div>
		</section>
	)
}

const scoreboardLeagues = {
	9000: {
		id: "12",
		name: "Mistrovství světa",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "reprezentace/zapasy/15", table: "reprezentace/table/15" },
	},
	957: {
		id: "5884",
		name: "Repre",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: null, table: null },
	},
	950: {
		id: "2838",
		name: "Světový pohár",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/49", table: "/reprezentace/table/49" },
	},
	505: {
		id: "71",
		name: "Olympijské hry",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/reprezentace/zapasy/18", table: "/reprezentace/table/18" },
	},
	500: {
		id: "13",
		name: "Carlson Hockey Games",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/reprezentace/zapasy/21", table: "/reprezentace/table/21" },
	},
	100: {
		id: "101",
		name: "Tipsport extraliga",
		nick: "Tipsport ELH",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/tipsport-extraliga/zapasy", table: "/tipsport-extraliga/table" },
	},
	90: {
		id: "0",
		name: "NHL",
		nick: null,
		externalLink: true,
		sourceOnlajny: false,
		url: { matches: "/sezona/zapasy", table: "/sezona/table" },
	},
	85: {
		id: "1828",
		name: "Liga mistrů",
		nick: "CHL",
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/chl/zapasy", table: "/chl/table" },
	},
	80: {
		id: "82",
		name: "Chance liga",
		nick: "Chance liga",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/chance-liga/zapasy", table: "/chance-liga/table" },
	},
	77: {
		id: "3452",
		name: "2. liga – Sever",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6508",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6508",
		},
	},
	76: {
		id: "29",
		name: "2. liga – Střed",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6509",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6509",
		},
	},
	75: {
		id: "30",
		name: "2. liga – Východ",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: {
			matches: "/2-liga/zapasy?matchList-filter-season=2019&matchList-filter-competition=6510",
			table: "/2-liga/table?table-filter-season=2019&table-filter-competition=6510",
		},
	},
	74: {
		id: "147",
		name: "Univerzitní liga",
		nick: "ULLH",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "ullh/zapasy", table: "ullh/table" },
	},
	70: {
		id: "174",
		name: "turnaj O Pohár DHL",
		nick: "Pohár DHL",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/56", table: "/mladez/table/56" },
	},
	67: {
		id: "81",
		name: "REDSTONE Extraliga juniorů",
		nick: "ELJ",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/4", table: "/mladez/table/4" },
	},
	65: {
		id: "112",
		name: "ELIOD Extraliga dorostu",
		nick: "ELD",
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/53", table: "/mladez/table/53" },
	},
	60: {
		id: "67",
		name: "Starší dorost",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/5", table: "/mladez/table/5" },
	},
	50: {
		id: "68",
		name: "Mladší dorost",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/6", table: "/mladez/table/6" },
	},
	48: {
		id: "51",
		name: "Liga žen – Final Four",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: {
			matches: "zensky-hokej/zapasy/10",
			table: "/zensky-hokej/table/10?table-filter-season=2016&table-filter-competition=6008",
		},
	},
	46: {
		id: "657",
		name: "Repre 20",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/31", table: "/mladez/table/31" },
	},
	45: {
		id: "1258",
		name: "Repre 19",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/35", table: "/mladez/table/35" },
	},
	44: {
		id: "40",
		name: "Repre 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/32", table: null },
	},
	42: {
		id: "254",
		name: "Hlinka Gretzky Cup",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/32", table: "/mladez/table/32" },
	},
	41: {
		id: "131",
		name: "Repre 17",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/33", table: null },
	},
	39: {
		id: "3441",
		name: "Repre 16",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/34", table: "/mladez/table/34" },
	},
	35: {
		id: "954",
		name: "MS žen",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: "/zensky-hokej/table/39" },
	},
	25: {
		id: "405",
		name: "MS v para hokeji",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "sledge-hokej/zapasy/42", table: "sledge-hokej/table/42" },
	},
	22: {
		id: "781",
		name: "Repre žen",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/39", table: "/zensky-hokej/table/39" },
	},
	20: {
		id: "658",
		name: "Repre ženy 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: null },
	},
	19: {
		id: "3437",
		name: "Repre ženy 18",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/40", table: "/zensky-hokej/table/40" },
	},
	15: {
		id: "3162",
		name: "Repre ženy 16",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/41", table: null },
	},
	10: {
		id: "2849",
		name: "ZOH mládeže",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/zensky-hokej/zapasy/47", table: "/zensky-hokej/table/47" },
	},
	8: {
		id: "2885",
		name: "Škoda Hockey Cup",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/43", table: null },
	},
	7: {
		id: "63",
		name: "MMČR 8. tříd",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/44", table: "/mladez/table/44" },
	},
	6: {
		id: "856",
		name: "MMČR krajů",
		nick: null,
		externalLink: false,
		sourceOnlajny: true,
		url: { matches: "/mladez/zapasy/43", table: "/mladez/table/43" },
	},
	5: {
		id: "60",
		name: "Turnaj výběrů VTM",
		nick: null,
		externalLink: false,
		sourceOnlajny: false,
		url: { matches: "/mladez/zapasy/51", table: "/mladez/table/51" },
	},
}

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
