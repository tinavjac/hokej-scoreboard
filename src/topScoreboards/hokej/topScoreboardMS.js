const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useRef } = React

const queryClientTop = new QueryClient()

const TopScoreboard = (props) => {
	let date = new Date()
	//let date = new Date(2023, 3, 16)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	let date2 = new Date(new Date().setDate(date.getDate() + 1))
	let year2 = date2.getFullYear()
	let month2 = date2.getMonth() + 1
	let day2 = date2.getDate()
	if (day2 < 10) day2 = "0" + day2
	if (month2 < 10) month2 = "0" + month2

	const today = year + "-" + month + "-" + day
	const tomorow = year2 + "-" + month2 + "-" + day2

	const [foreignRefetch, setForeignRefetch] = useState(false)

	/* API FETCHING */
	const urlForeignRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/onlajny/"

	const todayQuery = useQuery("today", () => fetch(`${urlForeignRoot}${today}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: foreignRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => setForeignRefetch(5000),
		onError: (res) => setForeignRefetch(false),
	})
	const tomorowQuery = useQuery("tomorow", () => fetch(`${urlForeignRoot}${tomorow}.json`).then((res) => res.json()), {
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
			{(todayQuery.data != undefined && Object.keys(todayQuery.data).includes("12")) ||
			(tomorowQuery.data != undefined && Object.keys(tomorowQuery.data).includes("12")) ? (
				<div className="topScoreboard-container ms">
					<section
						className="topScoreboard"
						ref={scrollContainer}
						onMouseDown={mouseDownHandler}
						onMouseMove={mouseMoveHandler}
						onMouseUp={mouseUpHandler}
					>
						<a href="https://www.tipsport.cz/PartnerRedirectAction.do?pid=61&sid=45&bid=3924&tid=11461" className="ms-logo-anchor" target="_blank">
							<img src="https://ban.tipsport.cz/c/1x1.php?pid=61&sid=45&bid=35610&tid=11274" alt="" title="" style={{ width: 0, height: 0 }} />
							<img className="ms-logo" src="../img/tipsport_logo.png" alt="" />
						</a>
						{todayQuery.data != undefined &&
							Object.entries(todayQuery.data).map(([key, value]) => {
								let isFake = value.matches.every((match) => {
									return today != match.date
								})
								if (key == 12 && !isFake) {
									return (
										<section className="League" key={key} style={{ pointerEvents: scroll.pointerEvents ? "all" : "none" }}>
											<div className={"league-name"}>
												<h3>
													MS {year} <br />
													{day}. {month}.
												</h3>

												<img src="../img/ArrowRightBlack.svg" alt="" />
											</div>
											{value.matches.map((match) => {
												let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.logo_id}`
												let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.logo_id}`
												if (today == match.date) {
													return (
														<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="league-match" key={match.onlajny_id}>
															<div className="league-team">
																<div className="team-container">
																	<img src={homeLogo} alt="" />
																	<p className="team-name">{match.home.shortcut}</p>
																</div>
																<div
																	className={
																		"team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_home}
																</div>
															</div>
															<div className="league-team">
																<div className="team-container">
																	<img src={visitorsLogo} alt="" />
																	<p className="team-name">{match.visitor.shortcut}</p>
																</div>
																<div
																	className={
																		"team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_visitor}
																</div>
															</div>
														</a>
													)
												}
											})}
										</section>
									)
								}
							})}
						{tomorowQuery.data != undefined &&
							Object.entries(tomorowQuery.data).map(([key, value]) => {
								let isFake = value.matches.every((match) => {
									return tomorow != match.date
								})
								if (key == 12 && !isFake) {
									return (
										<section className="League" key={key} style={{ pointerEvents: scroll.pointerEvents ? "all" : "none" }}>
											<div className={"league-name"}>
												<h3>
													MS {year} <br />
													{day2}. {month2}.
												</h3>

												<img src="../img/ArrowRightBlack.svg" alt="" />
											</div>
											{value.matches.map((match) => {
												let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.logo_id}`
												let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.logo_id}`
												if (tomorow == match.date) {
													return (
														<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="league-match" key={match.onlajny_id}>
															<div className="league-team">
																<div className="team-container">
																	<img src={homeLogo} alt="" />
																	<p className="team-name">{match.home.shortcut}</p>
																</div>
																<div
																	className={
																		"team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_home}
																</div>
															</div>
															<div className="league-team">
																<div className="team-container">
																	<img src={visitorsLogo} alt="" />
																	<p className="team-name">{match.visitor.shortcut}</p>
																</div>
																<div
																	className={
																		"team-score " + (match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
																	}
																>
																	{match.score_visitor}
																</div>
															</div>
														</a>
													)
												}
											})}
										</section>
									)
								}
							})}
					</section>
				</div>
			) : (
				""
			)}
		</React.Fragment>
	)
}

const Render = () => {
	return (
		<QueryClientProvider client={queryClientTop}>
			<TopScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#top-scoreboard")
ReactDOM.render(React.createElement(Render), domContainer)
/* ReactDOM.createRoot(domContainer).render(<Render />) */
