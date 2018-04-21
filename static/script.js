
/************** start page columns and set sizes *************/

var $ = jQuery;

$( document ).ready(function() {
	map_page_setup();
});

// size of each column for every stage of the page
var map_stages = {
	stage0: {
		col1: "100%"
	},
	stage1: {
		col1: "30%",
		col2: "70%"
	},
	stage2: {
		col1: "7%",
		col2: "30%",
		col3: "63%"
	},
	stage3: {
		col1: "30%",
		col2: "63%",
		col3: "7%"
	}
};



/************** idk what this does yet but it looks important *************/

// OLD COLHEIGHT THING
// let colHeight = window.innerHeight - $("#navbarToggleExternalContent").height() - 
// $("#top_nav").height() -$("#bottom_nav").height() - 40;

let colHeight = window.innerHeight;

function generateColumns() {

	var column = document.createElement('div');
	column.className = 'column';
	$(column).css("background-color", 'lightgray');
	// column.innerText = 'Sample Text\n';

	var column_wrapper = document.createElement('div');
	column_wrapper.className = 'wrapper column_wrapper';
	column_wrapper.appendChild(column);
	column_wrapper.content = column;
	// var dockHeight = $("#navbarToggleExternalContent").hasClass('show') ? 40 : $("#navbarToggleExternalContent").height();
	// var height = window.innerHeight - dockHeight - $("#top_nav").height() -$("#bottom_nav").height() - 40;
	$(column_wrapper).css("height", colHeight);
	return column;
};

// idk if this fcn actually works yet
function resizeColumnHeight() {
	var dockHeight = $("#navbarToggleExternalContent").hasClass('show') ? 40 : $("#navbarToggleExternalContent").height();
	colHeight = window.innerHeight - dockHeight - $("#top_nav").height() -$("#bottom_nav").height() - 10;
	$('#page_viewer').css("height", colHeight);
	$('.column_wrapper').animate({
		height: colHeight,
	});
}

resizeColumnHeight();

/**************  page setup ****************/

// tells browser what size of column to use (hopefully??)
var currentStage = map_stages.stage0;

// these are containers for the content
var map_col_1; 
var map_col_2;
var map_col_3;

// these will be appended to the map_col_X later
var map_col1_ABD; 
var map_col1_C;
var map_col2_BCD;
var map_col3_CD;

var map_page; // the entire page container holding all the columns
var queue = true; // for animations (not implemented yet)


// SET UP ENTIRE PAGE
function map_page_setup() {
	if(map_page == undefined) {
		map_page = document.createElement('div');
		map_page.id = 'map_page';
		document.getElementById('page_viewer').append(map_page);
		mapStageFcns.stageA(); // start columns
	} 

	$(map_page).css("display", "block");
};

// ********* overarching master stages for columns  ********* 

// COLUMN STAGES
var mapStageFcns = {
	stageA: function () {
		currentStage = map_stages.stage0;
		
		if(map_col_1 == undefined) {
			map_col_1 = generateColumns();
			map_page.append(map_col_1.parentElement);
			map_populate_col_1();
		}

		$(map_col_1.parentElement).css("width", currentStage.col1);
	},
	stageB: function () {
		currentStage = map_stages.stage1;
		
		if(map_col_2 == undefined) {
			map_col_2 = generateColumns();
			map_page.append(map_col_2.parentElement);
			map_populate_col_2();
		}

		$(map_col_2.parentElement).css("width", currentStage.col2);
	},
	stageC: function (){
		currentStage = map_stages.stage2;
		map_hide_col_1();	
		
		if(map_col_3 == undefined) {
			map_col_3 = generateColumns();
			map_page.append(map_col_3.parentElement);
			map_populate_col_3();
		}
		
		$(map_col_1).click(mapStageFcns.stageD);
	},
	stageD: function (){
		currentStage = map_stages.stage3;
		$(map_col_3.parentElement).css("width", currentStage.col3);
		map_populate_col_1();

		$(map_col_2).click(mapStageFcns.stageC);
	}
};





// ********* ADD CONTENT TO EACH COLUMN  ********* 


// For StageA - put stuff in col 1, has map pic
function map_populate_col_1() {
	if(map_col1_ABD == undefined) {
		map_col1_ABD = document.createElement('div');
		var title = document.createElement("h3");
		title.innerHTML = "STAGE A";
		title.style.paddingTop="5%";
		map_col1_ABD.appendChild(title);

		// placeholder
		var map = document.createElement('img');
		$(map).css('max-width', '100%');
            map.src = "map.png";
            map.style = 'float:left; margin: 0px 20px 0px 10px;';
            map.className = 'ingredients_recipe_img';
            map_col1_ABD.appendChild(map);

		// This will be replaced by the map later
		var button = document.createElement('button');
		button.setAttribute("class", "searchbutton");
		button.id = 'addIngredient';
		button.innerHTML = 'Add Ingredient +';
		// generate second column
		button.onclick = function () {
			mapStageFcns.stageB();
		}
		map_col1_ABD.appendChild(button);
	}

	map_col_1.appendChild(map_col1_ABD);
};

// stageB - put stuff in col 2
function map_populate_col_2() {

	if(map_col2_BCD == undefined) {
		map_col2_BCD = document.createElement('div');
		
		var title = document.createElement("h3");
		title.innerHTML = "STAGE B";
		title.style.paddingTop="5%";
		map_col2_BCD.appendChild(title);

		// This will be replaced by the map later
		var button = document.createElement('button');
		button.setAttribute("class", "searchbutton");
		button.innerHTML = 'Add B +';
		
		// generate second column on button click
		button.onclick = function () {
			mapStageFcns.stageC();
		}
		map_col2_BCD.appendChild(button);
	}

	map_col_2.appendChild(map_col2_BCD);
};

//stageC - hide stage A stuff, add + button to stage A
function map_hide_col_1() {
	if(map_col1_ABD != undefined) {
		map_col_1.removeChild(map_col1_ABD);
	}

	if(map_col1_C == undefined) {
		map_col1_C = document.createElement('div');
		map_col1_C.className = 'row';
		
		var expandBtn = document.createElement('div');
		expandBtn.innerHTML = '+';
		$(expandBtn).css('top', '50%')
		expandBtn.className = 'btn col';
		map_col1_C.appendChild(expandBtn);
	}

	map_col_1.appendChild(map_col1_C);

};

// stage C - put stuff into column 3
function map_populate_col_3() {
	map_col_3.innerHTML = '';
	
	if(map_col3_CD == undefined) {
		map_col3_CD = document.createElement('div');

		var title = document.createElement("h3");
		title.innerHTML = "STAGE C";
		title.style.paddingTop="5%";
		map_col3_CD.appendChild(title);

		var paragraph = document.createElement("p");
		paragraph.innerHTML = "There are many variations of passages of Lorem" +
		" Ipsum available, but the majority have suffered alteration in some "+ 
		"form, by injected humour, or randomised words which don't look even " + 
		"slightly believable. If you are going to use a passage of Lorem Ipsum, " + 
		"you need to be sure there isn't anything embarrassing hidden in the " + 
		"middle of text. All the Lorem Ipsum generators on the Internet tend to " +
		"repeat predefined chunks as necessary, making this the first true " + 
		"generator on the Internet. It uses a dictionary of over 200 Latin words, " + 
		"combined with a handful of model sentence structures, to generate Lorem" + 
		"Ipsum which looks reasonable. The generated Lorem Ipsum is therefore " + 
		"always free from repetition, injected humour, or non-characteristic words etc.";
		paragraph.style.paddingTop="5%";
		map_col3_CD.appendChild(paragraph);
	}
	
	map_col_3.appendChild(map_col3_CD);
}




