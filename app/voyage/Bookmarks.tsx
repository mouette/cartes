import { useLocalStorage } from 'usehooks-ts'
import { pointHash } from './BookmarkButton'
import Image from 'next/image'
import { buildAddress } from '@/components/voyage/Address'

export default function Favoris() {
	const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])
	console.log('purple', bookmarks)
	return (
		<section>
			<h2>Mes favoris</h2>

			<h3>Adresses</h3>
			<ul
				css={`
					padding-left: 0.6rem;
					li {
						display: flex;
						align-items: center;
					}
				`}
			>
				{bookmarks.map((bookmark) => (
					<Bookmark
						key={pointHash(bookmark)}
						bookmark={bookmark}
						setBookmarks={setBookmarks}
					/>
				))}
			</ul>
			<h3>Itinéraires</h3>
			<p>Bientôt.</p>
		</section>
	)
}

const Bookmark = ({ bookmark, setBookmarks }) => {
	const address = buildAddress(bookmark.properties, true)
	console.log('purple add', address, bookmark.properties)
	return (
		<li
			key={pointHash(bookmark)}
			css={`
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.3rem 0;
				margin-bottom: 0.4rem;
				border-bottom: 1px solid var(--lightestColor);
			`}
		>
			{address ? (
				<address
					css={`
						line-height: 1.2rem;
						font-style: normal;
					`}
				>
					{address}
				</address>
			) : (
				<div>
					Point <small>{pointHash(bookmark)}</small>
				</div>
			)}
			<button
				css={`
					line-height: 1rem;
					img {
						width: 1.2rem;
						height: auto;
					}
				`}
				onClick={() =>
					setBookmarks((bookmarks) =>
						bookmarks.filter((point) => {
							if (point.geometry.type !== 'Point') return true
							return pointHash(point) !== pointHash(bookmark)
						})
					)
				}
			>
				<Image
					src="/trash.svg"
					width="10"
					height="10"
					alt="Supprimer le favori"
				/>
			</button>
		</li>
	)
}
