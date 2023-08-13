const { QueryClient, QueryClientProvider, useQuery } = ReactQuery
const { useState, useRef, useEffect } = React

const queryClient = new QueryClient()

const TopScoreboard = (props) => {
	let date = new Date()

	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (day < 10) day = "0" + day
	if (month < 10) month = "0" + month

	const APIDate = year + "-" + month + "-" + day

	const [czechRefetch, setCzechRefetch] = useState(false)
	const [data, setData] = useState(null)

	/* API FETCHING */
	const urlCzechRoot = "//s3-eu-west-1.amazonaws.com/hokej.cz/scoreboard/"

	const czechQuery = useQuery("czech", () => fetch(`${urlCzechRoot}${APIDate}.json`).then((res) => res.json()), {
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: czechRefetch,
		refetchIntervalInBackground: true,
		onSuccess: (res) => setCzechRefetch(5000),
		onError: (res) => setCzechRefetch(false),
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

	useEffect(() => {
		if (czechQuery.data) {
			setData(Object.entries(czechQuery.data).find((el) => el[0] == 101))
		}
	}, [czechQuery.isSuccess, czechRefetch])

	return (
		<div className="topScoreboard-container">
			{data != null ? (
				<section
					className="topScoreboard"
					ref={scrollContainer}
					onMouseDown={mouseDownHandler}
					onMouseMove={mouseMoveHandler}
					onMouseUp={mouseUpHandler}
				>
					{data[1].matches.map((match) => {
						let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`
						let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`
						return (
							<a href={`https://www.hokej.cz/zapas/${match.hokejcz_id}/`} className="league-match" key={match.hokejcz_id}>
								<div className="league-team">
									<div className="team-container">
										<img src={homeLogo} alt="" />
										<p className="team-name">{match.home.shortcut}</p>
									</div>
									<div
										className={
											"team-score " +
											(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
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
											"team-score " +
											(match.match_status == "před zápasem" ? "future-match" : match.match_status == "live" ? "active-match" : "")
										}
									>
										{match.score_visitor}
									</div>
								</div>
							</a>
						)
					})}
				</section>
			) : (
				""
			)}
		</div>
	)
}

const Render = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<TopScoreboard />
		</QueryClientProvider>
	)
}

const domContainer = document.querySelector("#top-scoreboard-tipsport")
ReactDOM.render(React.createElement(Render), domContainer)
/* ReactDOM.createRoot(domContainer).render(<Render />) */
