	// Static Page Application (SPA)
	// import { useEffect } from "react";

// Server Side Rendering (SSR)

// Static Site Generation (SSG) + Incremental Static Regeneration (ISR)

// SPA hooks: depends on server to fetch json data
// export default function Home() {
	// useEffect(() => {
	// 	fetch('http://localhost:3333/episodes')
	// 		.then(response => response.json())
	// 		.then(data => console.log(data))}, []);

// SSR/SSG
export default function Home(props) {
// console.log(props.episodes)
	return (
		<>
			<h1>Index</h1>
			<p>{JSON.stringify(props.episodes)}</p>
			</>
	);
}
 //SSR: every request fetches json data
// export async function getServerSideProps() {
// 	const response = await fetch('http://localhost:3333/episodes')
// 	const data = await response.json()
// 	return {
// 		props: {
// 			episodes: data
// 		}
// 	}
// }

//SSG: rendering needs a production build
//SSG+ISR: with revalidate, requests fetch json data every { dataRefresh } seconds.
 export async function getStaticProps() {
	const response = await fetch('http://localhost:3333/episodes')
	 const data = await response.json()
	 // Refresh every 8 hours
	const dataRefresh = 60 * 60 * 8
	return {
		props: {
			episodes: data
		},
		revalidate: dataRefresh
	}
}
