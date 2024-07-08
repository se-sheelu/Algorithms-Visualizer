import React, { useState, useEffect } from "react";

// algorithms
import { bubbleSort } from "./algorithms/bubbleSort";
import { insertionSort } from "./algorithms/insertionSort";
import { selectionSort } from "./algorithms/selectionSort";
import { mergeSort } from "./algorithms/mergeSort";
import { quickSort } from "./algorithms/quickSort";

import Navbar from "./navbar";
import Frame from "./frame";
import Footer from "./footer";
import pause from "./helper/pause";
import generator from "./helper/generator";
import {
	ALGORITHM,
	SPEED,
	SIZE,
	SWAP,
	CURRENT,
	NORMAL,
	DONE,
} from "./helper/constants";
import { getKeysCopy } from "./helper/keys";

const Visualizer = () => {
	const [list, setList] = useState([]);
	const [size, setSize] = useState(10);
	const [speed, setSpeed] = useState(1);
	const [algorithm, setAlgorithm] = useState(1);
	const [running, setRunning] = useState(false);

	useEffect(() => {
		generateList();
	}, []);

	const generateList = (value = 0) => {
		if ((list.length !== size && !running) || Number(value) === 1) {
			const newList = generator(size);
			setList(newList);
		}
	};

	const onChange = (value, option) => {
		if (option === ALGORITHM && !running) {
			setAlgorithm(Number(value));
		} else if (option === SPEED) {
			setSpeed(Number(value));
		} else if (option === SIZE && !running) {
			setSize(Number(value));
			generateList();
		}
	};

	const start = async () => {
		setRunning(true);
		const moves = await getMoves(algorithm);
		await visualizeMoves(moves);
		await done();
		setRunning(false);
	};

	const getMoves = async (name) => {
		let moves = [];
		const array = await getKeysCopy(list, size);
		switch (name) {
			case 1:
				moves = await bubbleSort(array, array.length);
				break;
			case 2:
				moves = await selectionSort(array, array.length);
				break;
			case 3:
				moves = await insertionSort(array, array.length);
				break;
			case 4:
				moves = await mergeSort(array, array.length);
				break;
			case 5:
				moves = await quickSort(array, array.length);
				break;
			default:
				break;
		}
		return moves;
	};

	const visualizeMoves = async (moves) => {
		if (moves.length === 0) return;
		if (moves[0].length === 4) {
			await visualizeMovesInRange(moves);
		} else {
			await visualizeMovesBySwapping(moves);
		}
	};

	const visualizeMovesInRange = async (moves) => {
		let prevRange = [];
		while (moves.length > 0 && moves[0].length === 4) {
			if (prevRange !== moves[0][3]) {
				await updateElementClass(prevRange, NORMAL);
				prevRange = moves[0][3];
				await updateElementClass(moves[0][3], CURRENT);
			}
			await updateElementValue([moves[0][0], moves[0][1]]);
			moves.shift();
		}
		await visualizeMoves(moves);
	};

	const visualizeMovesBySwapping = async (moves) => {
		while (moves.length > 0) {
			const currMove = moves[0];
			if (currMove.length !== 3) {
				await visualizeMoves(moves);
				return;
			} else {
				const indexes = [currMove[0], currMove[1]];
				await updateElementClass(indexes, CURRENT);
				if (currMove[2] === SWAP) {
					await updateList(indexes);
				}
				await updateElementClass(indexes, NORMAL);
			}
			moves.shift();
		}
	};

	const updateList = async (indexes) => {
		const array = [...list];
		const stored = array[indexes[0]].key;
		array[indexes[0]].key = array[indexes[1]].key;
		array[indexes[1]].key = stored;
		await updateStateChanges(array);
	};

	const updateElementValue = async (indexes) => {
		const array = [...list];
		array[indexes[0]].key = indexes[1];
		await updateStateChanges(array);
	};

	const updateElementClass = async (indexes, classType) => {
		const array = [...list];
		for (let i = 0; i < indexes.length; ++i) {
			array[indexes[i]].classType = classType;
		}
		await updateStateChanges(array);
	};

	const updateStateChanges = async (newList) => {
		setList(newList);
		await pause(speed);
	};

	const done = async () => {
		const indexes = [];
		for (let i = 0; i < size; ++i) {
			indexes.push(i);
		}
		await updateElementClass(indexes, DONE);
	};

	const response = () => {
		const navbar = document.querySelector(".navbar");
		if (navbar.className === "navbar") navbar.className += " responsive";
		else navbar.className = "navbar";
	};

	return (
		<React.Fragment>
			<Navbar
				start={start}
				response={response}
				newList={generateList}
				onChange={onChange}
			/>
			<Frame list={list} />
			<Footer />
		</React.Fragment>
	);
};

export default Visualizer;
