self.onInit = function() {
    self.ctx.varsRegex = /\$\{([^\}]*)\}/g;
    var imageUrl = self.ctx.settings.backgroundImageUrl ? self.ctx.settings.backgroundImageUrl :
    'data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnMiIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwIiB3aWR0aD0iMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgogPGcgaWQ9ImxheWVyMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtOTUyLjM2KSI+CiAgPHJlY3QgaWQ9InJlY3Q0Njg0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBoZWlnaHQ9Ijk5LjAxIiB3aWR0aD0iOTkuMDEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiB5PSI5NTIuODYiIHg9Ii40OTUwNSIgc3Ryb2tlLXdpZHRoPSIuOTkwMTAiIGZpbGw9IiNlZWUiLz4KICA8dGV4dCBpZD0idGV4dDQ2ODYiIHN0eWxlPSJ3b3JkLXNwYWNpbmc6MHB4O2xldHRlci1zcGFjaW5nOjBweDt0ZXh0LWFuY2hvcjptaWRkbGU7dGV4dC1hbGlnbjpjZW50ZXIiIGZvbnQtd2VpZ2h0PSJib2xkIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmb250LXNpemU9IjEwcHgiIGxpbmUtaGVpZ2h0PSIxMjUlIiB5PSI5NzAuNzI4MDkiIHg9IjQ5LjM5NjQ3NyIgZm9udC1mYW1pbHk9IlJvYm90byIgZmlsbD0iIzY2NjY2NiI+PHRzcGFuIGlkPSJ0c3BhbjQ2OTAiIHg9IjUwLjY0NjQ3NyIgeT0iOTcwLjcyODA5Ij5JbWFnZSBiYWNrZ3JvdW5kIDwvdHNwYW4+PHRzcGFuIGlkPSJ0c3BhbjQ2OTIiIHg9IjQ5LjM5NjQ3NyIgeT0iOTgzLjIyODA5Ij5pcyBub3QgY29uZmlndXJlZDwvdHNwYW4+PC90ZXh0PgogIDxyZWN0IGlkPSJyZWN0NDY5NCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgaGVpZ2h0PSIxOS4zNiIgd2lkdGg9IjY5LjM2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgeT0iOTkyLjY4IiB4PSIxNS4zMiIgc3Ryb2tlLXdpZHRoPSIuNjM5ODYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+Cg==';
    var div_img = document.createElement("div");
    div_img.setAttribute("id", "divImg");
    var bgImg = $('<img />');
    bgImg.hide();
    bgImg.bind('load', function()
    {
        self.ctx.bImageHeight = $(this).height();
        self.ctx.bImageWidth = $(this).width();
        self.onResize();
    });
    //self.ctx.$container.append(bgImg);
    bgImg.attr('src', imageUrl);
    div_img.append(bgImg[0]);
    self.ctx.$container.append(div_img);
    
    self.ctx.$container.css('background', 'url("'+imageUrl+'") no-repeat');
    self.ctx.$container.css('backgroundSize', 'contain');
    self.ctx.$container.css('backgroundPosition', '50% 50%');

    function processLabelPattern(pattern, data) {
        var match = self.ctx.varsRegex.exec(pattern);
        var replaceInfo = {};
        replaceInfo.variables = [];
        while (match !== null) {
            var variableInfo = {};
            variableInfo.dataKeyIndex = -1;
            var variable = match[0];
            var label = match[1];
            var valDec = 2;
            var splitVals = label.split(':');
            if (splitVals.length > 1) {
                label = splitVals[0];
                valDec = parseFloat(splitVals[1]);
            }
            variableInfo.variable = variable;
            variableInfo.valDec = valDec;
            if (label.startsWith('#')) {
                var keyIndexStr = label.substring(1);
                var n = Math.floor(Number(keyIndexStr));
                if (String(n) === keyIndexStr && n >= 0) {
                    variableInfo.dataKeyIndex = n;
                }
            }
            if (variableInfo.dataKeyIndex === -1) {
                for (var i = 0; i < data.length; i++) {
                     var datasourceData = data[i];
                     var dataKey = datasourceData.dataKey;
                     if (dataKey.label === label) {
                         variableInfo.dataKeyIndex = i;
                         break;
                     }
                }
            }
            replaceInfo.variables.push(variableInfo);
            match = self.ctx.varsRegex.exec(pattern);
            
        }
        return replaceInfo;
    }
    var configuredLabels = self.ctx.settings.labels;
    if (!configuredLabels) {
        configuredLabels = [];
    }
    
    self.ctx.labels = [];
    for (var l = 0; l < configuredLabels.length; l++) {
        var labelConfig = configuredLabels[l];
        var localConfig = {};
        localConfig.font = {};
        
        localConfig.pattern = labelConfig.pattern ? labelConfig.pattern : '${#0}';
        //localConfig.pattern = self.ctx.data[self.firstData(l)].data.toString().split(",")[1];
        localConfig.x = labelConfig.x ? labelConfig.x : 0;
        localConfig.y = labelConfig.y ? labelConfig.y : 0;
        localConfig.backgroundColor = labelConfig.backgroundColor ? labelConfig.backgroundColor : 'rgba(0,0,0,0)';
        
        var settingsFont = labelConfig.font;
        if (!settingsFont) {
            settingsFont = {};
        }
        
        localConfig.font.family = settingsFont.family || 'Roboto';
        localConfig.font.size = settingsFont.size ? settingsFont.size : 6;
        localConfig.font.style = settingsFont.style ? settingsFont.style : 'normal';
        localConfig.font.weight = settingsFont.weight ? settingsFont.weight : '500';
        localConfig.font.color = settingsFont.color ? settingsFont.color : '#fff';
        localConfig.replaceInfo = processLabelPattern(localConfig.pattern, self.ctx.data);

        for (var iDevice = 0; iDevice < self.ctx.datasources.length; iDevice++) {
            var label = {};
            var labelElement = $('<div/>');
            labelElement.css('position', 'absolute');
            labelElement.css('display', 'none');
            labelElement.css('top', '10%');
            //self.ctx.settings.labels[0].y[iDevice] = 10;
            labelElement.css('left', (iDevice*25 + 5).toString() + '%');
            //self.ctx.settings.labels[0].x[iDevice] = (iDevice*25 + 5);
            labelElement.css('backgroundColor', localConfig.backgroundColor);
            labelElement.css('color', localConfig.font.color);
            labelElement.css('fontFamily', localConfig.font.family);
            labelElement.css('fontStyle', localConfig.font.style);
            labelElement.css('fontWeight', localConfig.font.weight);
            labelElement.css('text-align', 'center');
            labelElement.html(localConfig.pattern);
            self.ctx.$container.append(labelElement);
            label.element = labelElement;
            label.config = localConfig;
            label.htmlSet = false;
            label.visible = false;
            self.ctx.labels.push(label);
            labelElement[0].setAttribute("class", "tooltip");
            labelElement[0].setAttribute("id", "labelCanne" + iDevice);
            labelElement[0].setAttribute("draggable", "true");
            labelElement[0].setAttribute("ondragstart", "drag(event)");
        }
    }
    var container = document.getElementsByTagName("body")[0];
    container.setAttribute("ondrop", "drop(event, self)");
    container.setAttribute("ondragover", "allowDrop(event)");
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    const scriptHTML = `
    function drag(ev){
        ev.dataTransfer.setData("Text", ev.target.id);
    }
    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drop(event, self){
        event.preventDefault();
        var data = event.dataTransfer.getData("Text");
        event.target.appendChild(document.getElementById(data));
        var elementDraged = document.getElementById(data);
        const ind = Number(elementDraged.id.substring(10));
        if(self.test_widget.PossibleGPS(ind)) {
            return;
        }
        var posX = event.layerX - elementDraged.offsetWidth / 2;
        var posY = event.layerY - elementDraged.offsetHeight / 2;
        elementDraged.style.left = posX + 'px';
        elementDraged.style.top = posY + 'px';
        const rect = document.getElementById("divImg").getBoundingClientRect();
        var labels = self.test_widget.ctx.labels;
        const offsetX = (1 - self.test_widget.ctx.backgroundRect.xRatio)*self.test_widget.ctx.width/2;
        const offsetY = (1 - self.test_widget.ctx.backgroundRect.yRatio)*self.test_widget.ctx.height/2;
        const ratioX = (posX - offsetX)/rect.width*100;
        const ratioY = (posY - offsetY)/rect.height*100;
        self.test_widget.onPositionsChange(ind, ratioX, ratioY);
        const button = document.getElementsByClassName("tb-btn-footer md-accent md-hue-2 md-fab md-button ng-scope md-ink-ripple ng-hide")[0];
        if (angular.element(button).scope() !== undefined) {
            angular.element(button).scope().vm.saveDashboard();
            console.log("dashboard save");
        }
     }`;
    
    
    script.innerHTML = scriptHTML;
    head.append(script);
    window.test_widget = self;
    self.onDataUpdated();
}

self.onDataUpdated = function() {
    updateLabels();
    setInterval(updateLabels, 60000);
}

self.onResize = function() {
    if (self.ctx.bImageHeight && self.ctx.bImageWidth) {
        var backgroundRect = {};
        var imageRatio = self.ctx.bImageWidth / self.ctx.bImageHeight;
        var componentRatio = self.ctx.width / self.ctx.height;
        if (componentRatio >= imageRatio) {
            backgroundRect.top = 0;
            backgroundRect.bottom = 1.0;
            backgroundRect.xRatio = imageRatio / componentRatio;
            backgroundRect.yRatio = 1;
            var offset = (1 - backgroundRect.xRatio) / 2;
            backgroundRect.left = offset;
            backgroundRect.right = 1 - offset;
        } else {
            backgroundRect.left = 0;
            backgroundRect.right = 1.0;
            backgroundRect.xRatio = 1;
            backgroundRect.yRatio = componentRatio / imageRatio;
            var offset = (1 - backgroundRect.yRatio) / 2;
            backgroundRect.top = offset;
            backgroundRect.bottom = 1 - offset;
        }
        var div_img = document.getElementById("divImg");
        div_img.setAttribute("style", "height:" + backgroundRect.yRatio*100 + "%;width:" + (backgroundRect.xRatio*100).toFixed(2) + "%;");
        for (var l = 0; l < self.ctx.labels.length; l++) {
            var label = self.ctx.labels[l];
            var labelLeft = backgroundRect.left*100 + (label.config.x*backgroundRect.xRatio);
            var labelTop = backgroundRect.top*100 + (label.config.y*backgroundRect.yRatio);
            var fontSize = self.ctx.height * backgroundRect.yRatio * label.config.font.size / 100;
            //label.element.css('top', labelTop + '%');
            //label.element.css('left', labelLeft + '%');
            label.element.css('fontSize', fontSize + 'px');
            if (!label.visible) {
                label.element.css('display', 'block');
                label.visible = true;
            }
        }
        self.ctx.backgroundRect = backgroundRect;
        
    } 
}


function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function padValue(val, dec, int) {
    var i = 0;
    var s, strVal, n;

    val = parseFloat(val);
    n = (val < 0);
    val = Math.abs(val);

    if (dec > 0) {
        strVal = val.toFixed(dec).toString().split('.');
        s = int - strVal[0].length;

        for (; i < s; ++i) {
            strVal[0] = '0' + strVal[0];
        }

        strVal = (n ? '-' : '') + strVal[0] + '.' + strVal[1];
    }

    else {
        strVal = Math.round(val).toString();
        s = int - strVal.length;

        for (; i < s; ++i) {
            strVal = '0' + strVal;
        }

        strVal = (n ? '-' : '') + strVal;
    }

    return strVal;
}

function updateLabels() {
    for (var l = 0; l < self.ctx.labels.length; l++) {
        var label = self.ctx.labels[l];
        var text = label.config.pattern;
        var replaceInfo = label.config.replaceInfo;
        var updated = false;
        for (var v = 0; v < replaceInfo.variables.length; v++) {
            var variableInfo = replaceInfo.variables[v];
            var txtVal = '';
            if (variableInfo.dataKeyIndex > -1) {
                var varData = self.ctx.data[variableInfo.dataKeyIndex].data;
                if (varData.length > 0) {
                    var val = varData[varData.length-1][1];
                    if (isNumber(val)) {
                        txtVal = padValue(val, variableInfo.valDec, 0);
                        updated = true;
                    } else {
                        txtVal = val;
                        updated = true;
                    }
                }
            }
            text = text.split(variableInfo.variable).join(txtVal);
        }
        if (updated || !label.htmlSet) {
            label.element.html(self.ctx.data[self.firstData(l)].data.toString().split(",")[1]);
            if (self.DeviceType(l).type == "canne") {
                if (document.getElementById('ledDetect' + l) === null) {
                    var retourLigne = document.createElement('br');
                    label.element[0].append(retourLigne);
                
                    var newSpan = document.createElement('span');
                    newSpan.setAttribute("class", "dot");
                    newSpan.setAttribute("id", "ledDetect" + l);
                    if (self.ctx.backgroundRect !== undefined) {
                        var fontSize = self.ctx.height * self.ctx.backgroundRect.yRatio * label.config.font.size / 100;
                        newSpan.style.height = fontSize + 'px';
                        newSpan.style.width = fontSize + 'px';
                    }
                    if (self.ctx.data[6*l + 1] !== undefined) {
                        var array = new Object(self.ctx.data[6*l + 1].data[0]);
                        const detection = array.toString().split(',')[1];
                        switch(detection) {
                            case '0':
                                newSpan.style['background-color'] = 'purple';
                                break;
                            case '1':
                                newSpan.style['background-color'] = 'green';
                                break;
                            case '2':
                                newSpan.style['background-color'] = 'blue';
                                break;
                            case '3':
                                newSpan.style['background-color'] = 'black';
                                break;
                            case '4':
                                newSpan.style['background-color'] = 'red';
                                break;
                            default:
                                newSpan.style['background-color'] = 'yellow';
                                break;
                        }
                    } else {
                        newSpan.style['background-color'] = 'yellow';
                    }
                    label.element[0].append(newSpan);
                }
            } else {
                var retourLigne = document.createElement('br');
                label.element[0].append(retourLigne);
                
                var newSpan = document.createElement('span');
                newSpan.setAttribute("class", "dot");
                newSpan.setAttribute("id", "ledDetect" + l);
                label.element[0].append(newSpan);
            }
            if (document.getElementById('spanCanneText' + l) === null) {
                var newSpan = document.createElement('span');
                newSpan.setAttribute("class", "tooltiptext");
                newSpan.setAttribute("id", "spanCanneText" + l);
                newSpan.style['font-size'] = '12px';
                
                newSpan.innerHTML = self.getData(l);
                
                label.element[0].append(newSpan);
            }
            if (!self.PossibleGPS(l)) {
                self.onPositionsChange(l, self.ctx.settings.labels[0].x[l], self.ctx.settings.labels[0].y[l]);
            }
        }
        if (!label.htmlSet) {
            label.htmlSet = true;
        }
    }
}


self.onDestroy = function() {
}

self.PossibleGPS = function(l) {
    //on reajuste d'abord le tooltiptext pour qu'il ne dépasse pas
    const div_img = document.getElementById("divImg").getBoundingClientRect();
    const divLabelRect = document.getElementById("labelCanne" + l).getBoundingClientRect();
    var span = document.getElementById("spanCanneText" + l);
    var debord = false;
    if (span != null) {
        const spanRect = span.getBoundingClientRect();
        const divContainer = document.getElementById("container");
        const margeY = (divContainer.clientWidth - div_img.width) / 2;
        const margeX = (divContainer.clientHeight - div_img.height) / 2;
        if ((spanRect.left  < div_img.left) && (spanRect.left != 0)) {
            span.style.top = (50*(1 - spanRect.height/divLabelRect.height)).toString() + '%';
            span.style.left = ((divLabelRect.width + 5)/divLabelRect.width*100 ).toString() + '%';
            debord = true;
        }
        if (((spanRect.x + spanRect.width) > (div_img.right + margeX)) && (spanRect.x != 0)){
            span.style.top = (50*(1 - spanRect.height/divLabelRect.height)).toString() + '%';
            span.style.left = (0 - (spanRect.width + 5)/divLabelRect.width*100 ).toString() + '%';
            debord = true;
        }
        if (((spanRect.y + spanRect.height) > (div_img.bottom + margeY)) && (spanRect.y != 0)) {
            span.style.top = (0 - (spanRect.height + 5)/divLabelRect.height*100 ).toString() + '%';
            span.style.left = (50*(1 - spanRect.width/divLabelRect.width)).toString() + '%';
            debord = true;
        }
        if (!debord) {
            span.style.top = ((divLabelRect.height + 5)/divLabelRect.height*100 ).toString() + '%';
            span.style.left = (50*(1 - spanRect.width/divLabelRect.width)).toString() + '%';
        }
    }
    
    var long = self.findKey('longitude', l);
    var lat = self.findKey('latitude', l);
    if (long < 0) {
        return;
    }
    if (lat < 0) {
        return;
    }
    
    if (self.ctx.settings.mapConfig !== undefined) {
        var array = new Object(self.ctx.data[self.firstData(l) + lat].data[0]);
        const latLabel = Number(array.toString().split(',')[1]);
        array = new Object(self.ctx.data[self.firstData(l) + long].data[0]);
        const lonLabel = Number(array.toString().split(',')[1]);
        const settingsMapHG = self.ctx.settings.mapConfig.CornerTop;
        const settingsMapBD = self.ctx.settings.mapConfig.CornerBot;
        if (isNaN(latLabel) || isNaN(lonLabel) || (self.ctx.settings.mapConfig.GPSautoPlacement === false)) {
            // si lat ou long non définies || mode non placement avec le GPS
            return false;
        } else  {
            if ((latLabel > settingsMapHG.latitude) || (lonLabel < settingsMapHG.longitude)) {
                return false;
                
            } else {
                if ((latLabel < settingsMapBD.latitude) || (lonLabel > settingsMapBD.longitude)) {
                    return false;
                } else {
                    const largeurLabel = document.getElementById("labelCanne" + l).getBoundingClientRect().width/2;
                    const largeurImg = document.getElementById("divImg").getBoundingClientRect().width;
                    const ratioCentreY = largeurLabel / largeurImg * 100;
                    const hauteurLabel = document.getElementById("labelCanne" + l).getBoundingClientRect().height;
                    const hauteurImg = document.getElementById("divImg").getBoundingClientRect().height;
                    const ratioCentreX = hauteurLabel / hauteurImg * 100;
                    const newX = (settingsMapHG.latitude - latLabel)/(settingsMapHG.latitude - settingsMapBD.latitude)*100 - ratioCentreX;
                    const newY = 100 - (settingsMapBD.longitude - lonLabel)/(settingsMapBD.longitude - settingsMapHG.longitude)*100 - ratioCentreY;
                    self.onPositionsChange(l, newY,  newX);
                    return true;
                }
            }
        }
        return false;
    }
    return false;
}

self.onPositionsChange = function (indice, newX, newY) {
    const pourcentPadding = 3;
    if (newX < pourcentPadding) {
        newX = pourcentPadding;
    }
    if (newY < pourcentPadding) {
        newY = pourcentPadding;
    }
    if (newX > 100 - pourcentPadding) {
        newX = 100 - pourcentPadding;
    }
    if (newY > 100 - pourcentPadding) {
        newY = 100 - pourcentPadding;
    }
    var id = self.ctx.dashboard.widgetIds[0];

    console.log(newX, newY, indice);
    self.ctx.settings.labels[0].x[indice] = newX ;
    self.ctx.settings.labels[0].y[indice] = newY ;
    console.log(self.ctx.settings.labels);
    var div = document.getElementById('labelCanne' + indice);
    div.style.left = newX + '%';
    div.style.top = newY + '%';
}


self.DeviceType = function (indice) {
    var freturn = new Object();
    if (self.ctx.datasources[indice].entity !== undefined) {
        freturn.type= self.ctx.datasources[indice].entity.type;
        freturn.entityId = self.ctx.datasources[indice].entityId;
        freturn.nkeys = self.ctx.datasources[indice].dataKeys.length; 
   }
    return freturn;
}

self.getData = function (indice) {
    const data = self.ctx.data;
    const device = self.DeviceType(indice);
    var text = "";
    const offsetTab = self.firstData(indice);

    for (var i=0; i < device.nkeys; i++) {
        if (data[i + offsetTab].dataKey.name != 'name') {
            const dataValue = data[i + offsetTab].data.toString().split(",")[1];
            text += "<i><u>" +  data[i + offsetTab].dataKey.name + " :</u></i> " + dataValue + "<br>";
        }
    }
    return text;
}

self.firstData = function (indice) {
    var firstData = 0;
    for (var i=0; i < indice; i++) {
        if (self.ctx.datasources[i] !== undefined) {
            firstData += self.ctx.datasources[i].dataKeys.length;
        }
        else {
            return -1;
        }
    }
    return firstData;
}

self.findKey = function(strKey, l) {
    var DeviceType = self.DeviceType(l);
    const firstData = self.firstData(l);
    for (var i = 0; i < DeviceType.nkeys; i++) {
        if (self.ctx.data[firstData + i].dataKey.name == strKey) {
            return i;
        }
    }
    return -1;
}
