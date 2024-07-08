import React from "react";

const Frame = ({ list }) => {
	// Function to get the class based on the value
	const getClass = (value) => {
		if (value === 0) return "cell";
		if (value === 1) return "cell current";
		return "cell done";
	};

	return (
		<div className="frame">
			<div className="array">
				{list.map((element, index) => (
					<div
						className={getClass(element.classType)}
						key={index}
						style={{ height: `${4 * element.key}px` }}
						value={element.key}></div>
				))}
			</div>
		</div>
	);
};

export default Frame;
