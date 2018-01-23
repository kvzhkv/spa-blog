const FS = require('fs');
const PATH = require('path');
const constants = {
	DIRECTORY: 'directory',
	FILE: 'file'
}

function safeReadDirSync (path) {
	let dirData = {};
	try {
		dirData = FS.readdirSync(path);
	} catch(ex) {
		if (ex.code == "EACCES")
			//User does not have permissions, ignore directory
			return null;
		else throw ex;
	}
	return dirData;
}

// function safeReadDir (path) {
//   // let dirData = {};
//   FS.readdir(path, (err, data) => {
//     if (err) {
//       if (err.code == "EACCES") {
//         return null;
//       }
//       throw err;
//     }
//     return data;
//   })
// }

function directoryTree (globalPath) {
  const name = PATH.basename(globalPath);

  let path = globalPath.substr(14);
	const item = { path, name };
  let stats;
  
  if (name === ".DS_Store") {
    return null;
  }

	try { stats = FS.statSync(globalPath); }
	catch (e) { return null; }

	if (stats.isFile()) {
		
		const ext = PATH.extname(globalPath).toLowerCase();

		item.size = stats.size;  // File size in bytes
		item.extension = ext;
		item.type = constants.FILE;
	}
	else if (stats.isDirectory()) {
		let dirData = safeReadDirSync(globalPath);
		if (dirData === null) return null;
		
		item.children = dirData
			.map(child => directoryTree(PATH.join(globalPath, child)))
			.filter(e => !!e);
		item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
		item.type = constants.DIRECTORY;
	} else {
		return null; // Or set item.size = 0 for devices, FIFO and sockets ?
	}
	return item;
}
 
// function directoryTree (path, options, onEachFile) {
//   const name = PATH.basename(path);
//   // console.log(path);
  
//   // console.log(name);
//   let cuttedPath = path.substr(14);
// 	const item = { path, name };
// 	let stats;

// 	try { stats = FS.statSync(path); }
// 	catch (e) { return null; }
// 	// Skip if it matches the exclude regex
// 	if (options && options.exclude && options.exclude.test(path))
// 		return null;

// 	if (stats.isFile()) {
		
// 		const ext = PATH.extname(path).toLowerCase();
		
// 		// Skip if it does not match the extension regex
// 		if (options && options.extensions && !options.extensions.test(ext))
// 			return null;

// 		item.size = stats.size;  // File size in bytes
// 		item.extension = ext;
// 		item.type = constants.FILE;
// 		if (onEachFile) {
// 			onEachFile(item, PATH);
// 		}
// 	}
// 	else if (stats.isDirectory()) {
// 		let dirData = safeReadDirSync(path);
// 		if (dirData === null) return null;
		
// 		item.children = dirData
// 			.map(child => directoryTree(PATH.join(path, child), options, onEachFile))
// 			.filter(e => !!e);
// 		item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
// 		item.type = constants.DIRECTORY;
// 	} else {
// 		return null; // Or set item.size = 0 for devices, FIFO and sockets ?
// 	}
// 	return item;
// }

module.exports = directoryTree;
