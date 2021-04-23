import React from 'react';
import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
	return (
		<PlayerContextProvider>
			<div>
				<h4 className={styles.helloWorld}>
					Hello World! 🥴
				</h4>
				<div className={styles.wrapper}>
					<main>
						<Header />
						<Component {...pageProps} />
					</main>
					<Player />
				</div>
			</div>
		</PlayerContextProvider>
	);
}

export default MyApp;
