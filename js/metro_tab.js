document.addEventListener('DOMContentLoaded', loadBookmarkFolder);

function loadBookmarkFolder() {
	MetroStorage.initStore().then(function () {
		fillTiles();
		applySorting();
		initEditorBackground();
	}, function (error) {
		console.log(error);
	});
}

function createTileHtml(tile, replace) {
	let item = document.createElement('a');
	item.setAttribute("id", tile.id);
	item.setAttribute("href", tile.url);
	item.setAttribute('class', 'flex-item');
	if (tile.isDbl) {
		item.classList.add('double');
	}
	item.setAttribute('data-id', tile.id);

	item.innerHTML = '<span class="tab-color" style="background-color: ' + tile.color + '"></span>' +
		'<span class="tab-thumbnail"></span>' +
		'<span class="tab-title">' + tile.title + '</span>';

	if (tile.icon && tile.icon.length > 0) {
		$class(item, 'tab-thumbnail').style.backgroundImage = 'url(' + tile.icon + ')';
	}
	let container = $id('site-container');
	container.style.fontSize = MetroStorage.getScale() + '%';
	if (replace) {
		container.replaceChild(item, $id(tile.id));
	} else {
		container.appendChild(item);
	}
}

function fillTiles() {
	let arrayTilesId = MetroStorage.getArrayTilesId();
	//console.log("tiles count: " + arrayTilesId.length);
	for (let i = 0; i < arrayTilesId.length; i++) {
		let id = arrayTilesId[i];
		let tile = MetroStorage.findTileById(id);
		if (tile) {
			createTileHtml(tile);
		}
	}
}

function applySorting() {
	let el = $id('site-container');
	Sortable.create(el, {
		animation: 100,
		onEnd: function (e) {// Element dragging ended
			if (e.oldIndex !== e.newIndex) {
				MetroStorage.moveTile(e.oldIndex, e.newIndex);
				console.log('moved: ' + e.oldIndex + ' to ' + e.newIndex);
			}
		}
	});
}

function deleteItemContextMenu(id) {
	console.log('delete id ' + id);
	MetroStorage.removeTileById(id);
	$id(id).remove();
}

function editItemContextMenu(id) {
	$id('modalState').click();
	setTimeout(function () {
		let tile = MetroStorage.findTileById(id);
		if (tile) {
			$id('tileId').value = tile.id;
			$id('addTitleId').value = tile.title;
			$id('tileBgId').value = tile.color;
			$id('addUrlId').value = tile.url;
			$id('tileDblId').checked = tile.isDbl;

			let img = new Image();
			img.addEventListener('load', function () {
				let canv = $id('canvasPickerId');
				canv.getContext('2d').drawImage(img, 0, 0, canv.width, canv.height);
			}, false);
			img.src = tile.icon;
		}
	}, 100);
}

function initEditorBackground() {
	let fileBack = $id('fileBkg');
	if (fileBack) {
		fileBack.addEventListener('change', function () {
			readFile(this, function (e) {
				let img = e.target.result;
				$id('backgroundContainerId').style.backgroundImage = 'url(' + img + ')';
				MetroStorage.setBackgroundImage(img);
			});
		});
	}
	let image = MetroStorage.getBackgroundImage();
	$id('backgroundContainerId').style.backgroundImage = 'url(' + (image ? image : 'img/background.jpg') + ')';
}