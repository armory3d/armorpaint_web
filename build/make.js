let fs = require('fs');

let writeHtml = function(fileName, body = '') {
	let header = fs.readFileSync('header.html', 'utf8');
	let footer = fs.readFileSync('footer.html', 'utf8');
	let html = fs.readFileSync(fileName, 'utf8');
	fs.writeFileSync('../' + fileName, header + html + body + footer);
}

writeHtml('index.html');
writeHtml('news.html');
writeHtml('community.html');
writeHtml('download.html');
writeHtml('notes.html');
writeHtml('howto.html');

fs.rmdirSync('../img/cloud', { recursive: true });
fs.mkdirSync('../img/cloud');

cloud_grid = `
<div class="uk-section uk-section-secondary">
<div style="justify-content: center; display: grid; grid-template-columns: repeat(auto-fill, 170px); max-width: 900px; margin: auto;">
`;

let icon_folders = [
	'../../armorpaint_cloud/public/cloud/materials/procedural',
	'../../armorpaint_cloud/public/cloud/materials/scanned',
	'../../armorpaint_cloud/public/cloud/materials/cc0',
	'../../armorpaint_cloud/public/cloud/decals',
	'../../armorpaint_cloud/public/cloud/brushes',
	'../../armorpaint_cloud/public/cloud/hdri',
	'../../armorpaint_cloud/public/cloud/meshes'
];

for (folder of icon_folders) {
	fs.readdirSync(folder).forEach(file => {
		let isMaterial = folder.indexOf('/materials') > 0;
		if (file.endsWith(isMaterial ? '.png' : '.jpg')) {
			fs.copyFileSync(folder + '/' + file, '../img/cloud/' + file);
			label = file.slice(0, -9);
			if (label.length > 13) label = label.substring(0, 11) + '...';
			cloud_grid += '<div style="width: 70%; text-align: center; margin: auto;"><img src="' + (isMaterial ? 'img/cloud_raytraced/' : 'img/cloud/') + file + '"/><br>' + label + '<br><br></div>';
		}
	});
}

cloud_grid += '</div></div>';
cloud_grid += '<div class="uk-section uk-section-secondary"><div class="uk-text-center">Contains assets from <a href="https://armorlab.org/">ArmorLab</a>, <a href="https://cc0textures.com/">CC0 Textures</a> and <a href="https://hdrihaven.com/">HDRI Haven</a>. ❤️ Licensed under CC0.<br><br></div></div>';
cloud_grid += '<div class="uk-section uk-section-secondary"><div align="center"><img src="img/e.jpg"></div></div>';
writeHtml('cloud.html', cloud_grid);
