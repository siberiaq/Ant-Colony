var BlackList = new Array();
var Probabilities = new Object();
var NewCurrentPoint = 0;
var TrailLength = 0;
var NextPoint = 0;
var TrailScheme = new Array();
var BestTrialScheme = new Array();
var BestTrialLength = 999;
var NewBestTrialLength = 1000;
var cont = 0;
var PointsNum = 10;
var DelBuffer;
var actuallyBestTrial = '';

Array.prototype.in_array = function(p_val) {
	for(var i = 0, l = this.length; i < l; i++)	{
		if(this[i] == p_val) {
			return true;
		}
	}
	return false;
}


/*
Поиск оптимального пути по оставленному феромону.
*/
function GetBestTrial() {
	for (var vara = 0; vara < 10; vara++) {
		var max = FerValues[vara][0];
		for (var vara2 = 0; vara2 < 10; vara2++) {
			if ((FerValues[vara][vara2] > max) && (Graph[vara][vara2] != 0)) {
				max = FerValues[vara][vara2];
				actuallyBestTrial = (vara2 + 1) + '->';
			}
		}
	}
	console.log(actuallyBestTrial);
	/*
	BestTrialScheme.push(StartPoint + 1);
	for (var a = 0; a < PointsNum; a++) {
		var max = Math.max.apply({}, FerValues[a]);
		if (!Graph[a][BestTrialScheme[BestTrialScheme.length] - 1]) {
			for (var c = 0; c < PointsNum; c++) {
				if (FerValues[a][c] == max) {
					DelBuffer = FerValues[a][c];
					FerValues[a][c] = 0;
					max = Math.max.apply({}, FerValues[a]);
					FerValues[a][c] = DelBuffer;
				}
			}
		}
		//console.log('MAX: ' + max);
		for (var b = 0; b < PointsNum; b++) {
			if ((Graph[a][b] != 0) && (FerValues[a][b] == max) && (b != StartPoint) && (FerValues[a][b] != 1) && (!BestTrialScheme.in_array(b + 1))) {
				//BestTrialLength = BestTrialLength + Graph[a][b];
				BestTrialScheme.push(b + 1);
				if (b == EndPoint) return;
			}
		}
	}
	console.log(' ' + BestTrialScheme);*/
}

/*
Отрисовка графа после изменения количества вершин/весов ребер.
*/
function DisplayGraphOnce() {
	var edges = [];
	var nodes = [];
	var DrawG = {id: 0, label: 0, color: '#4caf50', font: {}};
	var DrawValues = {from: 0, to: 0, label: '', color: '#4caf50', font: {align: 'middle'}};

	for (var a = 0; a < PointsNum; a++) {
		DrawG = {};
		DrawG.id = a;
		DrawG.label = a + 1;
		DrawG.color = '#4caf50';
		DrawG.font = {color: 'white' };
		nodes.push(DrawG);
	}

	var c = 0;

	for (var a = 0; a < Graph.length; a++) {
		for (var b = a; b < Graph.length; b++) {
			if (Graph[a][b] != 0) {
				DrawValues = {};
				DrawValues.from = a;
				DrawValues.to = b;
				DrawValues.label = '' + Graph[a][b];
				DrawValues.color = '#4caf50';
				DrawValues.font = {align: 'middle'};
				edges[c] = DrawValues;
				c++;
			}
		}
	}
	
		  // create a network
		  var container = document.getElementById('Graph');
		  var data = {
		    nodes: nodes,
		    edges: edges
		  };
		  var options = {
			layout:{randomSeed:2},
	        edges: {
	          smooth: true,
	          arrows: {to : true, from : true }
	        },
		    nodes : {
		      size: 12
		    }
		  };
		  
		  var network = new vis.Network(container, data, options);	
}

/*
Отрисовка графа и настроек после изменения количества вершин/весов ребер.
*/
function UpdateSettings() {
	BlackList = [];
	Probabilities = {};
	NewCurrentPoint = 0;
	TrailLength = 0;
	NextPoint = 0;
	TrailScheme = [];
	BestTrialScheme = [];
	BestTrialLength = 999;
	NewBestTrialLength = 1000;
	cont = 0;
	UpdateValues(PointsNum);
	DisplaySettings();
	DisplayGraphOnce();
}

/*
Округление для красоты вывода.
*/
function RoundPlus(x) { //x - число, 2 - количество знаков после запятой
	var m = Math.pow(10,2);
	return Math.round(x*m)/m;
}

/*
UpdateFer - обновление феромона на не пройденных ребрах.
На пройденных ребрах феромон обновляется во время прохождения.
*/
function UpdateFer(TrailScheme) {
	for(var e = 0; e < PointsNum; e++) {
		for (var f = 0; f < PointsNum; f++) {
			if (Graph[e][f] != 0) {
				//для всех ребер
				FerValues[e][f] = (1 - P) * FerValues[e][f];				
			}
		}
	}
	for (var e = 0; e < BestTrialScheme.length - 1; e++) {
		FerValues[BestTrialScheme[e]][BestTrialScheme[e + 1]] = FerValues[BestTrialScheme[e]][BestTrialScheme[e + 1]] + 20;
	}
}

/*
InBlackList - входит ли ребро в список пройденных.
*/
function InBlackList(c) {
	for (var d = 0; d < BlackList.length; d++) {
		if (BlackList[d] == c) {
			return true;
			break;
    	}
	}
	return false;
}

/*
WhereIsNextPoint - нахождение вершины для последующего хода.
*/
function WhereIsNextPoint(CurrentPoint) {
	
	var DenominatorOfProbability = 0;
	var ProbabilitiesCount = 0;
	var AvailablePoints = [];
	for (var c = 0; c < PointsNum; c++) {
		if (InBlackList(c)) continue;
		if (Graph[CurrentPoint][c] != 0) {
			DenominatorOfProbability = DenominatorOfProbability + Math.pow(FerValues[CurrentPoint][c], Aplha) * Math.pow(1 / Graph[CurrentPoint][c], Beta);
		}
	}
	for (var c = 0; c < PointsNum; c++) {
		if (InBlackList(c)) {
			Probabilities[c] = -1;
			continue;
		}
		if (Graph[CurrentPoint][c] != 0) {
			Probabilities[c] = 100 * (Math.pow(FerValues[CurrentPoint][c], Aplha) * Math.pow(1 / Graph[CurrentPoint][c], Beta) / DenominatorOfProbability);
			ProbabilitiesCount++;
			AvailablePoints.push(c);
		}
	}
	
	if (ProbabilitiesCount != 0) {
		var RandomNumber = Math.round(0 + Math.random() * (ProbabilitiesCount - 1));
	} else {
		return -1;
	}
	//document.write('Дост.вершины: ' + AvailablePoints + '<br>');
	NextPoint = AvailablePoints[RandomNumber];

	Probabilities = [];
	return NextPoint;
}

/*
Обновление значений.
*/
function UpdateValues() {
	for (var r = 0; r < PointsNum; r++) {
		for (var f = 0; f < PointsNum; f++) {
			Graph[r][f] = parseInt(document.getElementById('graph' + r + '_' + f).value, 10);
			FerValues[r][f] = parseInt(document.getElementById('fer' + r + '_' + f).value, 10);
		}
	}
	Aplha = parseFloat(document.getElementById('Alpha').value);
	Beta = parseFloat(document.getElementById('Beta').value);
	AntNum = parseInt(document.getElementById('AntNum').value, 10);
	Q = parseInt(document.getElementById('Q').value, 10);
	P = parseFloat(document.getElementById('P').value);
	StartPoint = parseInt(document.getElementById('StartPoint').value, 10) - 1;
	EndPoint = parseInt(document.getElementById('EndPoint').value, 10) - 1;
	IterationNum = parseInt(document.getElementById('IterationNum').value, 10);
	PointsNum = parseInt(document.getElementById('PointsNum').value, 10);
}

/*
Отрисовка графа с отмеченым путем.
*/
function DisplayGraph(Graph, BestTrialScheme) {
	var edges = [];
	var nodes = [];
	var DrawG = {id: 0, label: 0, color: '#4caf50', font: {}};
	var DrawValues = {from: 0, to: 0, label: '', color: '#4caf50',  font: {align: 'middle'}};

	for (var a = 0; a < PointsNum; a++) {
		DrawG = {};
		DrawG.id = a;
		DrawG.label = a + 1;
		DrawG.color = '#4caf50';
		DrawG.font = {color: 'white' };
		nodes.push(DrawG);
	}

	var c = 0;

	for (var a = 0; a < Graph.length; a++) {
		for (var b = a; b < Graph.length; b++) {
			if (Graph[a][b] != 0) {
				DrawValues = {};
				DrawValues.from = a;
				DrawValues.to = b;
				DrawValues.label = '' + Graph[a][b];
				DrawValues.color = '#4caf50';
				DrawValues.font = {align: 'middle'};
				for (d = 0; d < BestTrialScheme.length - 1; d++) {
					if ((a == (BestTrialScheme[d] - 1) && b == (BestTrialScheme[d + 1]) - 1) || (b == (BestTrialScheme[d] - 1) && a == (BestTrialScheme[d + 1]) - 1)) DrawValues.color = 'red';
				}
				edges[c] = DrawValues;
				c++;
			}
		}
	}
	
		  // create a network
		  var container = document.getElementById('Graph');
		  var data = {
		    nodes: nodes,
		    edges: edges
		  };
		  var options = {
			layout:{randomSeed:2},
	        edges: {
	          smooth: true,
	          arrows: {to : true, from : true }
	        },
		    nodes : {
		      size: 12
		    }
		  };
		  var network = new vis.Network(container, data, options);
}

/*
Вывод результатов работы алгоритма.
*/
function DisplayResult(BestTrialLength,BestTrialScheme) {
	var Result = '<h2 class="content-sub-heading">Результат</h2><button onclick="Go(0);" style="float: right;" class="btn btn-blue waves-button waves-light waves-effect" type="submit">Повторить</button><b>Длина: </b>' + BestTrialLength + '<br><b>Путь: </b>' + BestTrialScheme.join('-->');
	Result = Result + '<br><b>Феромон на ребрах:</b><br>';
	for (var g = 0; g < PointsNum; g++){
		for (var h = 0; h < PointsNum; h++) {
			Result = Result + '&nbsp;&nbsp;&nbsp;<input class="form-control" style="cursor: none; width: 24px; display: inline; font-size: 12px;" id="text-disable" placeholder="" type="text" disabled="" value="' + RoundPlus(FerValues[g][h]) + '">';
		}
		Result = Result + '<br>';
	}
	document.getElementById('Results').innerHTML = Result;
}

/*
Main
*/
function Go(cont) {
	UpdateSettings();
	UpdateValues();
	for (var f = 0; f < IterationNum; f++) {
		for (var e = 0; e < AntNum; e++) {
			var CurrentPoint = StartPoint;
			TrailScheme.push(StartPoint);
			BlackList[0] = StartPoint;
			while ((CurrentPoint != EndPoint)) {
				if (WhereIsNextPoint(CurrentPoint) != -1) {
					NewCurrentPoint = WhereIsNextPoint(CurrentPoint);
					TrailScheme.push(NewCurrentPoint + 1);
					BlackList.push(NewCurrentPoint);
					TrailLength = TrailLength + Graph[CurrentPoint][NewCurrentPoint];
					FerValues[CurrentPoint][NewCurrentPoint] = FerValues[CurrentPoint][NewCurrentPoint] + (1 / Graph[CurrentPoint][NewCurrentPoint]);
					CurrentPoint = NewCurrentPoint;
					if (CurrentPoint == EndPoint) {
						NewBestTrialLength = TrailLength;
						if (NewBestTrialLength < BestTrialLength) {
							BestTrialLength = NewBestTrialLength;
							BestTrialScheme = TrailScheme;
						}
					}
				} else {
					break;
				}
			}
			
			if (cont == 0)  UpdateFer(TrailScheme);
			TrailScheme[0] = TrailScheme[0] + 1;
			BlackList = [];
			TrailScheme = [];
			TrailLength = 0;
		}
	}
	//GetBestTrial();
	UpdateFer(TrailScheme);
	DisplayGraph(Graph, BestTrialScheme);
	DisplayResult(BestTrialLength, BestTrialScheme);
	GetBestTrial();
}

/*
Вывод настроек.
*/
function DisplaySettings() {
	var Settings = '<b>Вершин</b> <input class="form-control" style="width: 40px; display: inline; font-size: 15px;" id="PointsNum" type="number" value="' + PointsNum + '"><b>Найти путь из </b><input type="number" class="form-control" id= "StartPoint" style= "width: 30px; display: inline; font-size: 15px;" placeholder= "" type= "text" value= "' + (StartPoint + 1) +
		'"><b> в</b>&nbsp;&nbsp;<input type="number" class="form-control" id="EndPoint" style="width: 30px; display: inline; font-size: 15px;" placeholder="" type="text" value="' + (EndPoint + 1) + '"><br>' +
		'<b>Alpha:</b> <input class="form-control" id="Alpha" style="width: 25px; display: inline; font-size: 15px;" placeholder="" type="text" value="' + Aplha + '">' +
		'<b>&nbsp;&nbsp;Beta:</b> <input class="form-control" id="Beta" style="width: 25px; display: inline; font-size: 15px;"  placeholder="" type="text" value="' + Beta + '">' +
		'<b>&nbsp;&nbsp;P:</b> <input class="form-control" id="P" style="width: 25px; display: inline; font-size: 15px;" placeholder="" type="text" value="' + P + '">' +
		'<b>&nbsp;&nbsp;Q: </b><input class="form-control" id="Q" style="width: 25px; display: inline; font-size: 15px;" placeholder="" type="text" value="' + Q + '"><br>' +
		'<b>Размер колонии:</b> <input class="form-control" id="AntNum" style="width: 25px; display: inline; font-size: 15px;" id="text-disable" placeholder="" type="text" value="' + AntNum + '">' +
		'<b>Итераций:</b> <input class="form-control" id="IterationNum" style="width: 25px; display: inline; font-size: 15px;" id="text-disable" placeholder="" type="text" value="' + IterationNum + '">' +
		'<br><br><button onclick="UpdateSettings(PointsNum);" class="btn btn-blue waves-button waves-light waves-effect" type="submit">Применить настройки</button>&nbsp;&nbsp;&nbsp;<button onclick="Go(1);" class="btn btn-blue waves-button waves-light waves-effect" type="submit">Запуск</button>';
	
		Settings = Settings + '<h2 class="content-sub-heading">Вес ребер:</h2>';	
		for (var g = 0; g < PointsNum; g++){
			for (var h = 0; h < PointsNum; h++) {
				Settings = Settings + '&nbsp;&nbsp;&nbsp;<input class="form-control" style="width: 20px; display: inline; font-size: 12px;" id="graph'+g+'_'+h+'" placeholder="" type="text" value="' + Graph[g][h] + '">';
			}
			Settings = Settings + '<br>';
		}
		Settings = Settings + '<br><h2 class="content-sub-heading">Феромон:</h2>';
		for (var g = 0; g < PointsNum; g++){
			for (var h = 0; h < PointsNum; h++) {
				Settings = Settings + '&nbsp;&nbsp;&nbsp;<input class="form-control" style="width: 20px; display: inline; font-size: 12px;" id="fer'+g+'_'+h+'" placeholder="" type="text" value="' + FerValues[g][h] + '">';
			}
			Settings = Settings + '<br>';
		}
		document.getElementById('Settings').innerHTML = Settings;
}