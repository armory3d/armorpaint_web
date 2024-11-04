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
	let cloud_grid = `
		<div style="justify-content: center; display: grid; grid-template-columns: repeat(auto-fill, 170px); max-width: 900px; margin: auto;">
	`;
	let icon_folders = [
		'../../armorpaint_cloud/public/cloud/materials/procedural',
		'../../armorpaint_cloud/public/cloud/materials/armorlab',
		'../../armorpaint_cloud/public/cloud/materials/polyhaven',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/approximated',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/multiangle',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/photogrammetry',
		'../../armorpaint_cloud/public/cloud/materials/ambientcg/procedural',
		'../../armorpaint_cloud/public/cloud/decals',
		'../../armorpaint_cloud/public/cloud/decals/ambientcg',
		'../../armorpaint_cloud/public/cloud/brushes',
		'../../armorpaint_cloud/public/cloud/hdri/ambientcg',
		'../../armorpaint_cloud/public/cloud/hdri/polyhaven',
		'../../armorpaint_cloud/public/cloud/meshes'
	];
	for (let folder of icon_folders) {
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

// rss.xml
{
	let rss = `<?xml version="1.0" encoding="UTF-8" ?>
	<rss version="2.0">
	<channel>
		<title>ArmorPaint</title>
		<link>https://armorpaint.org/news</link>
		<description>3D Painting Software</description>
	`;

	let news = fs.readFileSync("news.html", "utf8");
	let h3s = news.split(`<h3 class="fw-normal text-muted mb-3">`);
	let items = [];
	h3s.shift();
	h3s.shift();
	for (let h3 of h3s) {
		items.push(h3.split("</h3>")[0]);
	}

	for (let item of items) {
		rss += `
			<item>
	    		<title>ArmorPaint News</title>
	    		<link>https://armorpaint.org/news</link>
	    		<description>${item}</description>
			</item>

		`;
	}

	rss += `
	</channel>
	</rss>
	`;

	fs.writeFileSync('../rss.xml', rss);
}
