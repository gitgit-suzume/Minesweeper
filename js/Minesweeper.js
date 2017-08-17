var Minesweeper = new Object({
	rule:{
		maxRows: 24,
		maxCols: 30,
		minRows:9,
		minCols:9,
		minMines:10,
		setColor:['oneMines', 'twoMines', 'threeMines', 
				'fourMines', 'fiveMines', 'sixMines', 
				'sevenMines', 'eightMines'],
	},
	val:{
		nrows: 9,
		ncols: 9,
		mines: 10,
		//二维数组，记录雷区情况
		minesNotes: new Array(),
		//游戏情况,-1为失败,0为游戏进行中,1为胜利
		gameOver:0,
	},
	setMinesCount: function(mines){
		if(mines < 0){
			return;
		}
		if(mines >= 0 && mines <= 9){
			$('.minesCount span')[0].innerHTML = '00' + mines;
		} else if(mines < 100 && mines > 9){
			$('.minesCount span')[0].innerHTML = '0' + mines;
		} else{
			$('.minesCount span')[0].innerHTML = mines;
		}
	},
	begin:function(rowsNum,colsNum,minesNum){
		var that=this;
		that.val.gameOver = 0;
		that.val.minesNotes = new Array();

		var rows = parseInt(rowsNum);
		var cols = parseInt(colsNum);
		var mines = parseInt(minesNum);
		$('.timeCount span')[0].innerHTML = '000';
		// 检查设置的长宽高有没有在范围之外
		// 高于上界则置为max...，低于下界则设置为min...
		//最大雷数为最终（行数-1）*（列数-1）
		if (rows > that.rule.maxRows ){
			rows = that.rule.maxRows;
		}
		if (cols > that.rule.maxCols){
			cols  = that.rule.maxCols;
		}
		if (mines > (rows - 1) * (cols - 1)){
			mines = (rows - 1) * (cols - 1);
		}

		if (rows < that.rule.minRows || isNaN(rows)){
			rows = that.rule.minRows;
		}
		if(cols < that.rule.minCols || isNaN(cols)){
			cols = that.rule.minCols;
		}
		if(mines < that.rule.minMines || isNaN(mines)){
			mines = that.rule.minMines;
		}

		// 设置对应的新值
		that.val.nrows = rows;
		that.val.ncols = cols;
		that.val.mines = mines;
		that.setMinesCount(mines);

		that.initBoard(rows, cols, mines);
		that.setMines(rows, cols, mines);
		that.countMimes();
		// that.openAllMines();
	},
	//关于游戏开始的时候的初始化
	//初始化雷区
	initBoard: function(rows, cols, mines){
		var that = this,
		container = $('.container'),
		tr, td, i, j;
		$('.minesField').children('*').remove();
		//绘制表格
		var table = $('.minesField')[0];
		container.css('width', cols * 20 + 'px');
		for (i = 0; i < rows;i ++){
			tr = $('<tr>')[0];
			temp = new Array();
			for(j = 0; j < cols; j ++){
				tr.appendChild($('<td>')[0]);
			}
			table.appendChild(tr);
		}
		that.gameOver = 0;
	},
	//放置雷
	setMines:function(rows, cols, mines){
		var that = this;
		// 初始化记录雷区情况的数组minesNotes
		var temp;
		for(var i = 0; i < rows; i++){
			temp = new Array();
			for(var j = 0; j < cols; j ++){
				temp.push(new Object({
					// 盒子是否被点开
					check: false,
					// 地雷情况, -1为有地雷, 0-8表示周围地雷数
					mines:0,
				}));
			}
			that.val.minesNotes.push(temp);
		}
		// 随机产生地雷
		var count = 0;
		var x;
		while( count < mines){
			i = Math.floor(Math.random() * rows);
			j = Math.floor(Math.random() * cols);
			//如果选择的格子处已有雷
			if(that.val.minesNotes[i][j].mines == -1){
				continue;
			}
			that.val.minesNotes[i][j].mines = -1;
			count ++;
		}
	},
	//计算每个格子周围雷的数目
	countMimes:function(){
		var that = this;
		var rows = that.val.nrows,
		cols = that.val.ncols,
		minesNotes = that.val.minesNotes;
		var count = 0;
		flag = false;
		for (var i = 0; i < rows; i ++){
			for (var j = 0; j < cols; j ++){
				count = 0;
				if (minesNotes[i][j].mines == -1){
					continue;
				}
				// 计算格子周围地雷数目
				try{
					if(minesNotes[i-1][j-1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i-1][j].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i-1][j+1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i][j-1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i][j+1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i+1][j-1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i+1][j].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				try{
					if(minesNotes[i+1][j+1].mines == -1){
						count ++;
					}					
				} catch (error){
					;
				}
				that.val.minesNotes[i][j].mines = count;
			}
		}
	},

	//关于游戏结束
	// 开启所有雷区
	openAllMines:function(){
		var that = this;
		var td = $('.minesField tr td');
		var rows = that.val.nrows,
		cols = that.val.ncols,
		table = $('.minesField')[0];
		var minesNotes = that.val.minesNotes;
		for (var i = 0; i < rows; i ++){
			for(var j = 0; j < cols; j ++){
				if(table.rows[i].cells[j].className.indexOf('stepMines') >= 0){
					continue;
				}
				if(table.rows[i].cells[j].className.indexOf('mark') >= 0 && minesNotes[i][j].mines == -1){
					continue;
				}
				if (minesNotes[i][j].mines == -1){
					td[i * cols + j].className = 'existMines blankClickon';
				}
				if(minesNotes[i][j].mines != -1 && table.rows[i].cells[j].className.indexOf('mark') >= 0){
					table.rows[i].cells[j].innerHTML = 'X';
					table.rows[i].cells[j].className = 'errorMark blankClickon';
					if(table.rows[i].cells[j].className.indexOf('existMines') == -1){
						table.rows[i].cells[j].className += ' existMines';
					} else {
						;
					}
				}
			}
		}
	},

	//玩家操作
	//判断传入格子是否应该打开，是否为炸弹
	openBox: function(div){
		var colNum = div.cellIndex;
		var rowNum = div.parentNode.rowIndex;
		var that = this;
		var flag = true;
		//检测传入的行列数是否正确
		var mines;
		try {
			mines = that.val.minesNotes[rowNum][colNum].mines;
		} catch (error){
			return true;
		}
		//如果格子已经被打开
		if (that.val.minesNotes[rowNum][colNum].check && div.className.indexOf('blankClickon') >= 0){
			return true;
		}
		//如果格子已经被标记
		if (div.className.indexOf('mark') >= 0){
			return true;
		}
		//如果格子没问题
		//格子上的雷数不为0		
		if (mines > 0){
			div.parentNode.parentNode.rows[rowNum].cells[colNum].className = that.rule.setColor[(mines - 1)] + ' blankClickon minesField';
			div.parentNode.parentNode.rows[rowNum].cells[colNum].innerHTML = mines;
			that.val.minesNotes[rowNum][colNum].check = true;
			flag = true;
		}
		//格子上的雷数为0
		if (mines == 0){
			div.parentNode.parentNode.rows[rowNum].cells[colNum].className = 'blankClickon';
			that.val.minesNotes[rowNum][colNum].check = true;
			try {
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum - 1].cells[colNum - 1]);
			} catch(error) {
				;
			}
			try {
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum - 1].cells[colNum])
			} catch(error) {
				;
			}
			try{
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum - 1].cells[colNum + 1]);
			} catch(error){
				;
			}

			try{
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum].cells[colNum - 1]);
			} catch(error){
				;
			}
			try{
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum].cells[colNum + 1]);
			} catch(error){
				;
			}
			try {
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum + 1].cells[colNum - 1]);
			} catch (error){
				;
			}
			try{
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum + 1].cells[colNum]);
			} catch (error){
				;
			}
			try{
				flag = flag && !!that.openBox(div.parentNode.parentNode.rows[rowNum + 1].cells[colNum + 1]);
			} catch (error){
				;
			}
		}
		//踩雷
		if(mines == -1){
			that.val.gameOver = -1;
			div.parentNode.parentNode.rows[rowNum].cells[colNum].className = 'clickBox stepMines';
			flag = false;
		} 
		that.val.gameOver = that.judgWin();
		that.dealJudge();
		return flag;
	},
	//插旗
	setMark:function(div){
		var that = this;
		var mines = $('.minesCount span')[0].innerHTML;
		if (div.className.indexOf('blankClickon') >= 0){
			return;
		}
		if(mines <= 0 && div.className.indexOf('mark') == -1){
			return;
		}
		if(div.innerHTML == '?'){
			div.innerHTML = ' ';
			return;
		}
		if (div.className.indexOf('mark') >= 0){
			div.className = div.className.replace('mark', '');
			div.className = 'removeMark';
			div.innerHTML = '?';
			that.setMinesCount( ++ mines);
			return;
		} else{
			that.setMinesCount( -- mines);
			div.className = 'mark';
			div.innerHTML = '';
		}
		that.val.gameOver = that.judgWin();
		that.dealJudge();
	},
	//按压小格子,allpress是布尔型,true表示左右键同时按下
	pressBoxes: function(div, allpress){
		var that = this;
		if (div.className.indexOf('blankClickon') == -1 && div.className.indexOf('mark') == -1){
			div.className += ' blankClickon';
		}

		if(allpress){
			var temp = div.parentNode.parentNode;
			var colNum = div.cellIndex;
			var rowNum = div.parentNode.rowIndex;
			try{
				that.pressBoxes(temp.rows[rowNum - 1].cells[colNum - 1]);
				that.pressBoxes(temp.rows[rowNum - 1].cells[colNum]);
				that.pressBoxes(temp.rows[rowNum - 1].cells[colNum + 1]);
				that.pressBoxes(temp.rows[rowNum].cells[colNum - 1]);
				that.pressBoxes(temp.rows[rowNum].cells[colNum + 1]);
				that.pressBoxes(temp.rows[rowNum + 1].cells[colNum - 1]);
				that.pressBoxes(temp.rows[rowNum + 1].cells[colNum]);
				that.pressBoxes(temp.rows[rowNum + 1].cells[colNum + 1]);
			} catch(error){
				;
			}
		}
	},
	// 计算周围标记情况，来决定是松开小格子还是打开周围的格子
	calculate: function(div){
		var mines = div.innerHTML;
		var flagCount = 0;
		var temp = div.parentNode.parentNode;
		var colNum = div.cellIndex;
		var rowNum = div.parentNode.rowIndex;
		if(!mines){
			return false;
		}
		try{
			if(temp.rows[rowNum - 1].cells[colNum - 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum - 1].cells[colNum ].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum - 1].cells[colNum + 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum].cells[colNum - 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum].cells[colNum + 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum + 1].cells[colNum - 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum + 1].cells[colNum].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		try{
			if(temp.rows[rowNum + 1].cells[colNum + 1].className.indexOf('mark') >= 0){
				flagCount ++;
			}
		} catch(error){
			;
		}
		return flagCount == mines;
	},
	// 松开小格子,allpress是布尔型,true表示左右键同时按下
	upBoxes: function(div, allpress){
		var that = this;
		var colNum = div.cellIndex;
		var rowNum = div.parentNode.rowIndex;
		var temp = div.parentNode.parentNode;
		if(!that.val.minesNotes[rowNum][colNum].check && div.className.indexOf('blankClickon') >= 0){
			div.className = div.className.replace('blankClickon', '');
		}
		if(allpress){
			try{
				that.upBoxes(temp.rows[rowNum - 1].cells[colNum - 1]);
				that.upBoxes(temp.rows[rowNum - 1].cells[colNum]);
				that.upBoxes(temp.rows[rowNum - 1].cells[colNum + 1]);
				that.upBoxes(temp.rows[rowNum].cells[colNum - 1]);
				that.upBoxes(temp.rows[rowNum].cells[colNum + 1]);
				that.upBoxes(temp.rows[rowNum + 1].cells[colNum - 1]);
				that.upBoxes(temp.rows[rowNum + 1].cells[colNum]);
				that.upBoxes(temp.rows[rowNum + 1].cells[colNum + 1]);
			} catch(error){
				;
			}
		}
	},
	judgWin:function(){
		var that = this;
		var table = $('.minesField')[0];
		//对战情况,-1为失败,0为尚未失败或胜利,1为胜利
		var flag = 1;
		var count = 0;
		if(that.val.gameOver == -1){
			flag = -1
			return flag;
		}
		var allCols = that.val.ncols;
		var allRows = that.val.nrows;
		for (var i = 0; i < allRows; i ++){
			for (var j = 0; j < allCols; j ++){
				if(table.rows[i].cells[j].className.indexOf('blankClickon') >= 0 
					&& that.val.minesNotes[i][j].check){
					count ++;
				}
			}
		}
		var allBoxes = that.val.ncols * that.val.nrows - that.val.mines;
		if(count == allBoxes){
			flag = 1;
		} else {
			flag = 0;
		}
		return flag;
	},
	dealJudge: function(){
		var that = this;
		var t = $('.timeCount span')[0].innerHTML;
		t = parseInt(t);
		if (that.val.gameOver == -1){
			console.log('游戏失败!\n');
			$('.expression')[0].className = 'expression youFail';
			that.openAllMines();
			return;
		} else if (that.val.gameOver == 1){
			console.log('你赢了!\n耗时:'  + t + 's');
			$('.expression')[0].className = 'expression youWin';
			return;
		} else {
			return;
		}
	},
	updateTime:function(time){
		time = parseInt(time);
		if(time>999){
			$('.timeCount span')[0].innerHTML = 999;
		} else if(time<= 999 && time >= 100){
			$('.timeCount span')[0].innerHTML = time;
		} else if(time>=10 && time <= 99){
			$('.timeCount span')[0].innerHTML = '0' + time;
		} else if(time >= 0 && time < 10){
			$('.timeCount span')[0].innerHTML = '00' + time;
		} else {
			return;
		}
	},
	userDefined:function(){
		var div = $('.setMines');
		var that = this;
		div.css('display','block');
		var x = $('.info').offset().top;
		div.css('top', x);
		$('.rowNum')[0].value = that.val.nrows;
		$('.colNum')[0].value = that.val.ncols;
		$('.minesNum')[0].value = that.val.mines;
	},
});
$(window).ready(function(){
	// 判断鼠标左右键是否同时按下
	// 左键按下标志位
	var leftClick = false;
	//右键按下标志位
	var rightClick = false;
	var doubleClick = false;
	var begin = false;
	Minesweeper.begin();
	$('.minesField').on('mouseup', function(e){
		if(Minesweeper.val.gameOver != 0){
			return;
		}
		if(!begin){
			begin = true;
			setTimeout(function() {
				var time = $('.timeCount span')[0].innerHTML;
				time = parseInt(time) + 1;
				Minesweeper.updateTime(time);
				if((time < 999 && time >= 0) && Minesweeper.val.gameOver == 0){
					setTimeout(arguments.callee, 1000);
				}
			}, 1000);
		}
		$('.expression')[0].className = 'expression smile';
		var flag = false;
		// 松开左键
		if (e.button == 0 && leftClick){
			flag = Minesweeper.calculate(e.target);
			leftClick = false;
			if(doubleClick){
				if(!flag){
					Minesweeper.upBoxes(e.target, true);
				} else{
					var colNum = e.target.cellIndex;
					var rowNum = e.target.parentNode.rowIndex;
					var temp = e.target.parentNode.parentNode;
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum + 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum].cells[colNum + 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum + 1]);
					}catch(e){;}
				}
				doubleClick = false;
			} else{
				Minesweeper.openBox(e.target);
			}
		}
		// 松开右键
		if(e.button == 2 && rightClick){
			flag = Minesweeper.calculate(e.target);
			rightClick = false;
			if(doubleClick){
				if(!flag){
					Minesweeper.upBoxes(e.target,true);
				} else{
					var colNum = e.target.cellIndex;
					var rowNum = e.target.parentNode.rowIndex;
					var temp = e.target.parentNode.parentNode;
					Minesweeper.openBox(e.target);
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum - 1].cells[colNum + 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum].cells[colNum + 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum - 1]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum]);
					}catch(e){;}
					try{
						Minesweeper.openBox(temp.rows[rowNum + 1].cells[colNum + 1]);
					}catch(e){;}
				}
				doubleClick = false;
			}
		}
	});
	//取消右击默认事件
	$('.minesField').on('contextmenu', function(){
		return false;
	});
	//按下鼠标
	$('.minesField').on('mousedown', function(e){
		if(Minesweeper.val.gameOver != 0){
			return;
		}
		$('.expression')[0].className = 'expression waiting';
		//按下右键
		if(e.button == 2){
			rightClick = true;
			e.preventDefault();
			if(!leftClick){
				Minesweeper.setMark(e.target);
			}
		}
		//按下左键
		if(e.button == 0){
			leftClick = true;
			if(!rightClick){
				Minesweeper.pressBoxes(e.target, false);
			}
		}
		//按下左右键
		if(rightClick && leftClick){
			doubleClick = true;
			Minesweeper.pressBoxes(e.target, true);
		}
	});
	$('.minesField').on('mouseover', function(e){
		//左右键同时按下不放
		if(rightClick && leftClick){
			Minesweeper.pressBoxes(e.target, true);
			return;
		}
		//按住左键不放
		if(leftClick && !rightClick){
			Minesweeper.pressBoxes(e.target);
		}
	});
	$('.minesField tr td').on('mouseleave', function(e){
		if(leftClick && rightClick){
			Minesweeper.upBoxes(e.target, true);
		}
		if(!rightClick && leftClick){
			Minesweeper.upBoxes(e.target);
		}
	});
	$('.minesField').on('mouseleave', function(){
		leftClick = false;
		rightClick = false;
		doubleClick = false;
	});
	//重新开始
	$('.buttonContainer button, .restart').on('click', function(e){
		var kind = e.target.innerHTML;
		var rowNum = Minesweeper.val.nrows;
		var colNum = Minesweeper.val.ncols;
		var minesNum = Minesweeper.val.mines;

		if(kind != '取消'){
			leftClick = false;
			rightClick = false;
			doubleClick = false;
			begin = false
			switch (kind){
				case '确定':
				case '开局':
					Minesweeper.begin(rowNum, colNum, minesNum);
					break;
				case '初级':
					Minesweeper.begin(9, 9, 10);
					break;
				case '中级':
					Minesweeper.begin(16, 16, 40);
					break;
				case '高级':
					Minesweeper.begin(16, 30, 99);
					break;
				default:
					break;
			}
			$('.minesField tr td').on('mouseleave', function(e){
				if(leftClick && rightClick){
					Minesweeper.upBoxes(e.target, true);
				}
				if(!rightClick && leftClick){
					Minesweeper.upBoxes(e.target);
				}
			});
		}
		$('.setMines').css('display','none');
	});
	$('.expression').on('click', function(e){
		$('.expression')[0].className = 'expression smile';
		var rowNum = Minesweeper.val.nrows;
		var colNum = Minesweeper.val.ncols;
		var minesNum = Minesweeper.val.mines;
		begin = false;

		Minesweeper.begin(rowNum, colNum, minesNum);

		$('.minesField tr td').on('mouseleave', function(e){
			if(leftClick && rightClick){
				Minesweeper.upBoxes(e.target, true);
			}
			if(!rightClick && leftClick){
				Minesweeper.upBoxes(e.target);
			}
		});
	});

});