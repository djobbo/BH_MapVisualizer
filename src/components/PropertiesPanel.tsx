import React, { useContext, useState } from 'react';
import useInterval from '../hooks/useInterval';
import { EditorStateContext } from '../providers/EditorStateProvider';
import { MapNodesContext } from '../providers/MapNodesProvider';
import styles from '../styles/PropertiesPanel.module.scss';
import { createMapXML } from '../util/createMapXML';
import { parseMapXML } from '../util/parseMapXML';
import { Button } from './Button';
import { CollisionSettings } from './CollisionSettings';

export function PropertiesPanel() {
	const { addCollision, mapData, setMapData } = useContext(MapNodesContext);

	const {
		setTheme,
		currentFrame,
		setCurrentFrame,
		showCollisions,
		setShowCollisions,
		showMapBounds,
		setShowMapBounds,
	} = useContext(EditorStateContext);

	const [timeFlow, setTimeFlow] = useState(0);

	useInterval(
		() => {
			setCurrentFrame((frame) => frame + timeFlow / 60);
		},
		timeFlow === 0 ? null : 1000 / 60
	);

	function getRandomCol(): Collision {
		return {
			id: Math.random().toString(),
			type: 'Hard',
			isDragging: false,
			x1: Math.round(Math.random() * 250 + 250),
			x2: Math.round(Math.random() * 250 + 250),
			y1: Math.round(Math.random() * 250 + 250),
			y2: Math.round(Math.random() * 250 + 250),
		};
	}

	return (
		<div className={styles.container}>
			<CollisionSettings />
			<div>
				<Button onClick={() => addCollision(getRandomCol())}>
					Add Collision
				</Button>
				<Button onClick={() => console.log(createMapXML(mapData))}>
					Generate XML
				</Button>
			</div>
			<input
				type='file'
				name='mapFile'
				onChange={async (e) => {
					if (e.target.files.length <= 0) return;
					const file = e.target.files[0];
					setMapData(parseMapXML(await file.text()));
				}}
			/>
			<select
				onChange={(e) => {
					setTheme(e.target.value);
				}}
			>
				<option value=''>None</option>
				{mapData.themes.map((theme) => (
					<option value={theme} key={theme}>
						{theme}
					</option>
				))}
			</select>
			<input
				type='number'
				value={Math.round(currentFrame)}
				onChange={(e) => {
					const f = parseInt(e.target.value);
					setCurrentFrame(f >= 0 ? f : 0);
				}}
			/>
			<input
				type='number'
				value={timeFlow}
				onChange={(e) => {
					const flow = parseInt(e.target.value);
					setTimeFlow(isNaN(flow) ? 0 : flow);
				}}
			/>
			<label>
				Show Collisions
				<input
					type='checkbox'
					checked={showCollisions}
					onChange={(e) => setShowCollisions(e.target.checked)}
				/>
			</label>
			<label>
				Show Map Bounds
				<input
					type='checkbox'
					checked={showMapBounds}
					onChange={(e) => setShowMapBounds(e.target.checked)}
				/>
			</label>
		</div>
	);
}