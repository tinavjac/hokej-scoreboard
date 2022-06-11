const topScoreboard = (props) => {
	const { useState, useEffect } = React;
	const [czechLeagueData, setCzechLeagueData] = useState();
	const [foreignLeagueData, setForeignLeagueData] = useState();

	let date = new Date();

	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (day < 10) day = "0" + day;
	if (month < 10) month = "0" + month;

	const [APIDate, setAPIDate] = useState(year + "-" + month + "-" + day);
	const [noDataCzech, setNoDataCzech] = useState(false);
	const [noDataForeign, setNoDataForeign] = useState(false);

	/* API FETCHING */
	const urlForeignRoot = "https://hokej.cz.s3.amazonaws.com/scoreboard/onlajny/";
	const urlCzechRoot = "https://hokej.cz.s3.amazonaws.com/scoreboard/";

	const config = {
		taskForeignUrl: `${urlForeignRoot}${APIDate}.json`,
		taskCzechUrl: `${urlCzechRoot}${APIDate}.json`,
	};

	const fetchCzechData = () => {
		fetch(config.taskCzechUrl)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setCzechLeagueData(Object.entries(data));
				setNoDataCzech(false);
			})
			.catch(function (error) {
				setNoDataCzech(true);
				console.log(error);
			});
	};
	const fetchForeignData = () => {
		fetch(config.taskForeignUrl)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setForeignLeagueData(Object.entries(data));
				setNoDataForeign(false);
			})
			.catch(function (error) {
				setNoDataForeign(true);
				console.log(error);
			});
	};

	useEffect(() => {
		fetchCzechData();
		fetchForeignData();
	}, []);
	/* END API FETCHING */
	return (
		<div className="topScoreboard-container">
			{!noDataCzech || !noDataForeign ? (
				<section className="topScoreboard">
					{czechLeagueData != undefined &&
						czechLeagueData.map(([key, value]) => {
							return (
								<section className="League">
									<a href="" className={"league-name" + (value.league_name.length > 14 ? " set-width" : "")}>
										<h3>{value.league_name}</h3>
										<img src="../img/ArrowRightBlack.svg" alt="" />
									</a>
									{value.matches.map((match) => {
										let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`;
										let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`;
										return (
											<a href="" className="league-match">
												<div className="league-team">
													<div className="team-container">
														<img src={homeLogo} alt="" />
														<p className="team-name">{match.home.shortcut}</p>
													</div>
													<div
														className={
															"team-score " +
															(match.match_status == "před zápasem"
																? "future-match"
																: match.match_status == "live"
																? "active-match"
																: "")
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
															(match.match_status == "před zápasem"
																? "future-match"
																: match.match_status == "live"
																? "active-match"
																: "")
														}
													>
														{match.score_visitor}
													</div>
												</div>
											</a>
										);
									})}
								</section>
							);
						})}
					{foreignLeagueData != undefined &&
						foreignLeagueData.map(([key, value]) => {
							return (
								<section className="League">
									<a href="" className={"league-name" + (value.league_name.length > 10 ? " set-width" : "")}>
										<h3>{value.league_name}</h3>
										<img src="../img/ArrowRightBlack.svg" alt="" />
									</a>
									{value.matches.map((match) => {
										let homeLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.home.onlajny_id}`;
										let visitorsLogo = `https://s3-eu-west-1.amazonaws.com/onlajny/team/logo/${match.visitor.onlajny_id}`;
										return (
											<a href="" className="league-match">
												<div className="league-team">
													<div className="team-container">
														<img src={homeLogo} alt="" />
														<p className="team-name">{match.home.shortcut}</p>
													</div>
													<div
														className={
															"team-score " +
															(match.match_status == "před zápasem"
																? "future-match"
																: match.match_status == "live"
																? "active-match"
																: "")
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
															(match.match_status == "před zápasem"
																? "future-match"
																: match.match_status == "live"
																? "active-match"
																: "")
														}
													>
														{match.score_visitor}
													</div>
												</div>
											</a>
										);
									})}
								</section>
							);
						})}
				</section>
			) : (
				console.log("Top Scoreboard: NO DATA")
			)}
		</div>
	);
};

const domContainer = document.querySelector("#top-scoreboard");
ReactDOM.render(React.createElement(topScoreboard), domContainer);
