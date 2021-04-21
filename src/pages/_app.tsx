import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<h1>Hello World! 🥴</h1>
			<div className={styles.wrapper}>
			<main>
				<Header />
				<Component {...pageProps} />
			</main>
			<Player />
		</div>
		</>
	);
}

export default MyApp;

