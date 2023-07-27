let fs = require('fs');
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
writeHtml('news.html');
writeHtml('community.html');
writeHtml('download.html');
writeHtml('notes.html');
writeHtml('howto.html');
writeHtml('privacy.html');
writeManual('manual.html', 'manual_header.html', 'manual_footer.html', '../manual.md');

// cloud.html
{
	fs.rmSync('../img/cloud', { recursive: true });
	fs.mkdirSync('../img/cloud');
	cloud_grid = `
		<div style="justify-content: center; display: grid; grid-template-columns: repeat(auto-fill, 170px); max-width: 900px; margin: auto;">
	`;
	let icon_folders = [
		'../../armorpaint_cloud/public/cloud/materials/procedural',
		'../../armorpaint_cloud/public/cloud/materials/scanned',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/approximated',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/multiangle',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/photogrammetry',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/procedural',
		'../../armorpaint_cloud/public/cloud/decals',
		'../../armorpaint_cloud/public/cloud/decals/ambientcg',
		'../../armorpaint_cloud/public/cloud/brushes',
		'../../armorpaint_cloud/public/cloud/hdri/ambientcg',
		'../../armorpaint_cloud/public/cloud/hdri/hdrihaven',
		'../../armorpaint_cloud/public/cloud/meshes'
	];
	for (folder of icon_folders) {
		fs.readdirSync(folder).forEach(file => {
			let isMaterial = folder.indexOf('/materials') > 0;
			if (file.endsWith(isMaterial ? '.png' : '.jpg')) {
				fs.copyFileSync(folder + '/' + file, '../img/cloud/' + file);
				label = file.slice(0, -9);
				if (label.length > 13) label = label.substring(0, 11) + '...';
				let filePath = 'img/cloud/' + file;
				if (isMaterial && fs.existsSync('../img/cloud_raytraced/' + file)) {
					filePath = 'img/cloud_raytraced/' + file;
				}
				cloud_grid += '<div style="width: 70%; text-align: center; margin: auto;"><img style="width: 128px;" src="' + filePath + '"/><br>' + label + '<br><br></div>';
			}
		});
	}
	cloud_grid += '</div>';
	writeHtml('cloud.html', cloud_grid);
}
