let fs = require('fs');
const https = require('https');
let header = fs.readFileSync('header.html', 'utf8');
let cover = fs.readFileSync('cover.html', 'utf8');
let footer = fs.readFileSync('footer.html', 'utf8');

let writeHtml = function(fileName, extra = '') {
	let html = fs.readFileSync(fileName, 'utf8');
	fs.writeFileSync('../' + fileName, header + cover + html + extra + footer);
}

let writeManual = function(fileNameOut, fileNameHeader, fileNameFooter, fileNameMd) {
	let showdown = require('./showdown.min.js');
    let converter = new showdown.Converter();
    let file_md = fs.readFileSync(fileNameMd, 'utf8');
    let converted_md = converter.makeHtml(file_md);
	let htmlHeader = fs.readFileSync(fileNameHeader, 'utf8');
	let htmlFooter = fs.readFileSync(fileNameFooter, 'utf8');
	fs.writeFileSync('../' + fileNameOut, header + htmlHeader + converted_md + htmlFooter + footer);
}

writeHtml('index.html');
writeHtml('community.html');
writeHtml('download.html');
writeHtml('login.html');
writeHtml('notes.html');
writeHtml('howto.html');
writeHtml('privacy.html');
writeHtml('news.html');
writeHtml('blog.html');
writeHtml('gallery.html');
writeManual('manual.html', 'manual_header.html', 'manual_footer.html', '../manual.md');

// cloud.html
{
	function download(url, dest) {
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream(dest);
			https.get(url, response => {
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					resolve();
				});
			}).on('error', err => {
				fs.unlink(dest);
				reject(err);
			});
		});
	}

	(async () => {
		// fs.rmSync('../img/cloud', { recursive: true, force: true });
		// fs.mkdirSync('../img/cloud');

		await download('https://cloud.armory3d.com/index.txt', 'index.txt');
		const content = fs.readFileSync('index.txt', 'utf8');
		const lines = content.split('\n');

		let icon_files = [];
		let pathToMaterialMap = new Map();

		for (let line of lines) {
			if (line.trim() === '') continue;
			const parts = line.split(' ');
			const path = parts[0];
			if (path.endsWith('_icon.jpg') || path.endsWith('_icon.png')) {
			icon_files.push(path);
			const file = path.split('/').pop();
			const isMaterial = path.indexOf('/materials') > 0;
			pathToMaterialMap.set(file, isMaterial);
			}
		}

		// for (let icon_file of icon_files) {
		// 	const url = 'https://cloud.armory3d.com/' + icon_file;
		// 	const file = icon_file.split('/').pop();
		// 	await download(url, '../img/cloud/' + file);
		// }

		let cloud_grid = `
		<div style="justify-content: center; display: grid; grid-template-columns: repeat(auto-fill, 170px); max-width: 900px; margin: auto;">
		`;

		fs.readdirSync('../img/cloud').sort().forEach(file => {
			const isIconJpg = file.endsWith('_icon.jpg');
			const isIconPng = file.endsWith('_icon.png');
			const isMaterial = pathToMaterialMap.get(file);
			if ((isMaterial && isIconPng) || (!isMaterial && isIconJpg)) {
				let label = file.slice(0, -9);
				if (label.length > 13) label = label.substring(0, 11) + '...';
				let filePath = 'img/cloud/' + file;
				cloud_grid += '<div style="width: 70%; text-align: center; margin: auto;"><img style="width: 128px;" src="' + filePath + '"/><br>' + label + '<br><br></div>';
			}
		});

		cloud_grid += '</div>';
		writeHtml('cloud.html', cloud_grid);

		fs.unlinkSync('index.txt');
	})();
}
