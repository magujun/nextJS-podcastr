import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';

import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

import { usePlayer } from '../contexts/PlayerContext';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

// Static Page Application (SPA)
// import { useEffect } from "react";
// SPA hooks: depends on server to fetch json data
// export default function Home() {
// useEffect(() => {
// 	fetch('http://localhost:3333/episodes')
// 		.then(response => response.json())
// 		.then(data => console.log(data))}, []);
// Server Side Rendering (SSR)
// Static Site Generation (SSG) + Incremental Static Regeneration (ISR)

type Episode = {
	id: string;
	title: string;
	thumbnail: string;
	members: string;
	duration: number;
	durationAsString: string;
	publishedAt: string;
	url: string;
};

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
};

// SSR/SSG
export default function Home({
	latestEpisodes,
	allEpisodes,
}: HomeProps) {
	const { playList } = usePlayer();
	const episodeList = [...latestEpisodes, ...allEpisodes];
	return (
		<>
			{/* <h1>Index</h1>
			<p>{JSON.stringify(props.episodes)}</p> */}
			<div className={styles.homePage}>
				<Head>
					<title>Home | Podcastr</title>
				</Head>
				<section className={styles.latestEpisodes}>
					<h2>Últimos lançamentos</h2>
					<ul>
						{latestEpisodes.map((episode, index) => {
							return (
								<li key={episode.id}>
									<Image
										width={192}
										height={192}
										src={episode.thumbnail}
										alt={episode.title}
										objectFit='cover'
									/>
									<div className={styles.episodeDetails}>
										<Link href={`/episodes/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
										<p>{episode.members}</p>
										<span>{episode.publishedAt}</span>
										<span>{episode.durationAsString}</span>
									</div>
									<button
										type='button'
										onClick={() =>
											playList(episodeList, index)
										}>
										<img
											src='/play-green.svg'
											alt='Tocar episódio'
										/>
									</button>
								</li>
							);
						})}
					</ul>
				</section>
				<section className={styles.allEpisodes}>
					<h2>Todos episódios</h2>
					<table cellSpacing={0}>
						<thead>
							<tr>
								<th></th>
								<th>Podcast</th>
								<th>integrantes</th>
								<th>Data</th>
								<th>Duração</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{allEpisodes.map((episode, index) => {
								return (
									<tr key={episode.id}>
										<td>
											<Image
												width={120}
												height={120}
												src={episode.thumbnail}
												objectFit='cover'
											/>
										</td>
										<td>
											<Link
												href={`/episodes/${episode.id}`}>
												<a>{episode.title}</a>
											</Link>
										</td>
										<td>{episode.members}</td>
										<td style={{ width: 100 }}>
											{episode.publishedAt}
										</td>
										<td>{episode.durationAsString}</td>
										<td>
											<button
												type='button'
												onClick={() =>
													playList(
														episodeList,
														index + latestEpisodes.length,
													)
												}>
												<img
													src='/play-green.svg'
													alt='Tocar episódio'
												/>
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>
			</div>
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
export const getStaticProps: GetStaticProps = async () => {
	// const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc');
	// const data = await response.json();

	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	// const response = await api.get('episodes?_limit=12&_sort=published_at&_order=desc');
	// const data = response.data;

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(
				parseISO(episode.published_at),
				'd MMM yy',
				{
					locale: ptBR,
				},
			),
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(
				Number(episode.file.duration),
			),
			url: episode.file.url,
		};
	});

	// Refresh every 8 hours
	const dataRefresh = 60 * 60 * 8;
	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes,
			allEpisodes,
		},
		revalidate: dataRefresh,
	};
};
