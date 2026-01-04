app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);

(function () {
  // Path to AI file — you can pass this in from Python by writing to a temp file
  var aiFilePath = "C:\\Users\\AZ\\Documents\\agnt\\artie_agent\\temp\\sample.ai";; // <-- replace dynamically

  var aiFile = new File(aiFilePath);
  if (!aiFile.exists) {
    alert("AI file not found: " + aiFilePath);
    return;
  }

  var doc = app.open(aiFile);

  // Set target size here (points)
  var newWidth = "595";
  var newHeight = "842";

  var defaultFolder = "C://Users/AZ/Documents/agnt/artie_agent/temp/out";
  var defaultName   = doc.name.replace(/\.[^\.]+$/, "") + "_resized.pdf";
  var pdfFile       = new File(defaultFolder + "/" + defaultName);

  // --- rest of your resizing and PDF save logic unchanged ---
  var abIndex = doc.artboards.getActiveArtboardIndex();
  var ab = doc.artboards[abIndex];
  var rect = ab.artboardRect;
  var left   = rect[0];
  var top    = rect[1];
  var right  = rect[2];
  var bottom = rect[3];

  var oldWidth  = right - left;
  var oldHeight = top - bottom;

  var scaleX = (newWidth  / oldWidth)  * 100.0;
  var scaleY = (newHeight / oldHeight) * 100.0;

  var items = doc.pageItems;
  if (items.length > 0) {
    var meta = [];
    for (var i = 0; i < items.length; i++) {
      meta.push({ item: items[i], locked: items[i].locked, hidden: items[i].hidden });
      items[i].locked = false;
      items[i].hidden = false;
    }

    var tempLayer = doc.layers.add();
    tempLayer.name = "__TEMP_SCALE__";

    for (var j = items.length - 1; j >= 0; j--) {
      try { items[j].move(tempLayer, ElementPlacement.PLACEATBEGINNING); } catch (e) {}
    }

    var tempGroup = tempLayer.groupItems.add();
    var layerItems = tempLayer.pageItems;
    for (var k = layerItems.length - 1; k >= 0; k--) {
      try { layerItems[k].move(tempGroup, ElementPlacement.PLACEATBEGINNING); } catch (e2) {}
    }

    tempGroup.resize(scaleX, scaleY, true, true, true, true, true, Transformation.TOPLEFT);

    var gb = tempGroup.visibleBounds;
    var dx = left - gb[0];
    var dy = top  - gb[1];
    tempGroup.translate(dx, dy);

    ab.artboardRect = [left, top, left + newWidth, top - newHeight];

    try {
      var children = tempGroup.pageItems;
      for (var m = children.length - 1; m >= 0; m--) {
        children[m].move(doc, ElementPlacement.PLACEATEND);
      }
      tempGroup.remove();
      tempLayer.remove();
    } catch (e3) {}

    for (var n = 0; n < meta.length; n++) {
      try {
        meta[n].item.locked = meta[n].locked;
        meta[n].item.hidden = meta[n].hidden;
      } catch (e4) {}
    }
  } else {
    ab.artboardRect = [left, top, left + newWidth, top - newHeight];
  }

  try {
    var pdfOptions = new PDFSaveOptions();
    pdfOptions.pDFPreset = "[High Quality Print]";
    pdfOptions.preserveEditability = false;
    pdfOptions.generateThumbnails = true;
    pdfOptions.optimization = true;

    doc.saveAs(pdfFile, pdfOptions);
    // alert("Resized and saved as PDF:\n" + pdfFile.fsName);
  } catch (err) {
    alert("Error saving PDF: " + err);
  }
})();
