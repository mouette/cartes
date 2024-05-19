import { sortBy } from 'ramda'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MapButton } from '@/components/voyage/MapButtons'

const buildIconUrl = (icon) =>
	'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/weather/' +
	icon +
	'.svg'
export default function Meteo({ coordinates }) {
	const [data, setData] = useState(null)

	useEffect(() => {
		if (!coordinates) return
		//https://github.com/hacf-fr/meteofrance-api/blob/master/src/meteofrance_api/const.py#L1-L8
		const domain = `https://webservice.meteofrance.com`

		const rainUrl =
			domain +
			`/nowcast/rain?lon=${coordinates[0]}&lat=${coordinates[1]}&token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__`
		const forecastUrl =
			domain +
			`/forecast?lon=${coordinates[0]}&lat=${coordinates[1]}&token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__`

		const queries = [
			//['rain', rainUrl], // looks like rain forecast is now in weather
			//forecast !
			['weather', forecastUrl],
		]
		queries.map(async ([key, url]) => {
			const request = await fetch(url)
			const json = await request.json()
			setData((data) => ({ ...data, [key]: json }))
		})
	}, [setData, coordinates])

	console.log('meteo', data)
	if (!data?.weather) return
	const { weather } = data
	const now = new Date()
	const thisHour = sortBy((forecast) => new Date(forecast.dt * 1000))(
		weather.forecast.filter(({ dt }) => new Date(dt * 1000) > now)
	)[0]
	console.log('meteo this hour', thisHour)
	const rainIcon =
		thisHour.rain['1h'] > 0
			? 'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/rain/pluie-moderee.svg'
			: 'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/rain/pas-de-pluie.svg'
	return (
		<div
			css={`
				position: fixed;
				bottom: 2rem;
				right: 1rem;
				transform: translateX(-50%) translateY(-50%);
				img {
					width: 1.8rem;
					height: auto;
					margin: 0 0.2rem;
					display: inline-block;
				}
				z-index: 10;
				filter: drop-shadow(0 0 0.75rem white);

				background: #ffffff85;
				border: 0px solid lightgrey;
				text-align: center;
				border-radius: 4px;
				box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
				padding: 0.1rem;
				width: 6rem;
				height: 4rem;
				small {
					white-space: nowrap;
					overflow-x: scroll;
					max-width: 100%;
					display: block;
					height: 1.6rem;
					margin-top: 0.3rem;
				}
			`}
		>
			<small>{weather.position.name}</small>
			<div>
				<Image
					src={buildIconUrl(thisHour.weather.icon)}
					alt={thisHour.weather.desc}
					width="10"
					height="10"
				/>
				<Image src={rainIcon} width="10" height="10" />
			</div>
		</div>
	)
}
