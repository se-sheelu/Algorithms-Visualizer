export const getKeysCopy = async (array, length) => {
	console.log(array);
	let list = [];
	for (let i = 0; i < length; ++i) {
		list.push(Number(array[i].key));
	}
	console.log(list);
	return list;
};
