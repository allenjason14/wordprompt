$( document ).ready(function() {

var topicArrs = [   
  randomWord = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "", 
    isFirst: true,
    isSavable: false,
    firstSet: true,
    target: "#one-prompt",
    selector: "#one-selector",
    reset: "none"
  },

  biome = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=biome&md=d",
    isFirst: false,
    isSavable: false,
    target: "#biome-prompt",
    selector: "#biome-selector",
    reset: "none"
  },

  characteristic = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=characteristic&md=d",
    isFirst: false,
    isSavable: false,
    target: "#characteristic-prompt",
    selector: "#characteristic-selector",
    reset: "none"
  },

  verb = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=verb&md=d",
    isFirst: false,
    isSavable: false,
    target: "#verb-prompt",
    selector: "#verb-selector",
    reset: "none"
  },

  vehicle = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=vehicle&md=d",
    isFirst: false,
    isSavable: false,
    target: "#vehicle-prompt",
    selector: "#vehicle-selector",
    reset: "none"
  },

  color = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=color&md=d",
    isFirst: false,
    isSavable: false,
    target: "#color-prompt",
    selector: "#color-selector",
    reset: "none"
  },

  animal = {
    word: "",
    defs: [],
    fos: [],
    defNums: "",
    defCounter: 0,
    urlVal: "https://api.datamuse.com/words?rel_jjb=animal&md=d",
    isFirst: false,
    isSavable: false,
    target: "#animal-prompt",
    selector: "#animal-selector",
    reset: "none"
  }
];

var errorInd = [];
var errorArr = [];
var fosArr = ["n", "adv", "adj", "v"];


function genRandom(wordz, i){
  $.ajax({
    url: wordz.urlVal,
    method: "GET"
  }).done(function(data) {
    var parsedData = data.filter(function(w){
      return typeof w.defs !== "undefined";
    })  
    if(parsedData.length < 1 && wordz.isFirst) {
      return getFirstWord(wordz);
    }
    else if(parsedData.length < 1 && wordz.isGen){
      document.querySelector(wordz.holder).remove();
      document.querySelector(wordz.sHolder).remove();
      errorInd.push(i);
      errorArr.push(wordz.initWord);
     }
    else {
      var random = Math.floor(Math.random() * parsedData.length);
      wordz.defNums = parsedData[random].defs.length;
      if(wordz.isFirst && wordz.firstSet) {
        firstSet(wordz, parsedData[random]);
      }
      else {
        secondSet(wordz, parsedData[random]);
      }
    }
  })
}  
 
function getFirstWord(wordz) { 
  $.ajax({
    url: "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minLength=5&maxLength=15&limit=1&api_key=4ed393f1514d189aadd500421d705d18a45d31ee8ca3851a1",
    method: "GET"
  }).done(function(data) {
    console.log("first", data[0].word);
    wordz.urlVal = "https://api.datamuse.com/words?sp=" + data[0].word + "&qe=sp&md=d";
    genRandom(topicArrs[0]);
  });
}

function firstSet(wordz, data) {
  wordz.word = data.word;
  wordz.isSavable = true;
  document.querySelector(wordz.selector).parentElement.classList.add('saving');
  wordz.firstSet = false;
  getFoS(data, wordz);
  setWords(wordz);  
} 

function secondSet(wordz, data) {
  wordz.word = data.word;
  wordz.isSavable = true;
  document.querySelector(wordz.target).parentElement.classList.remove("hidden"); 
  getFoS(data, wordz);
  document.querySelector(wordz.target).innerHTML = wordz.word;
  wordz.reset = "saving";
  document.querySelector(wordz.selector).parentElement.classList.remove('resetting');
  document.querySelector(wordz.selector).parentElement.classList.add('saving');
}

function getFoS(def, word) {
   if(word.defNums === 1) {
    def = def.defs[0];
    for(var j = 0; j < fosArr.length; j++) {
      if (fosArr[j] === def.substr(0, fosArr[j].length)) {
        word.defs = def.substr(fosArr[j].length + 1);
        word.fos = def.substr(0, fosArr[j].length); 
        return
      }        
    }
  }
  else {
    for(var i = 0; i < def.defs.length; i++) {
      for(var j = 0; j < fosArr.length; j++) {
        if (fosArr[j] === def.defs[i].substr(0, fosArr[j].length)) {
           word.defs.push(def.defs[i].substr(fosArr[j].length + 1)); 
          word.fos.push(def.defs[i].substr(0, fosArr[j].length)); 
        }        
      }
    }
  }
} 

function setWords(wordz) {
  $("#def-name").text(wordz.word).addClass("defs");
  $("#next-arrow").attr("word", wordz.word); 
  if(wordz.defNums === 1) {
    $("#define").text(wordz.defs);
    $('#fos').text(wordz.fos);
    $("#next-arrow").addClass("fa fa-arrow-circle-right inactive");
  }
  else {
    $("#define").text(wordz.defs[0]);
    $('#fos').text(wordz.fos[0]);
    $("#next-arrow").addClass("fa fa-arrow-circle-right");
  }
}

function newPrompt(wordz, i) {
  wordz.word = "";
  wordz.defs = [];
  wordz.fos = [];
  wordz.defNums = "";
  if(wordz.isFirst === true) {
    getFirstWord(wordz);
  }
  else {
   genRandom(wordz, i); 
  }
}

function promptResetting(){
  $("#next-arrow").removeClass("fa fa-arrow-circle-right inactive");
  $("#define").text("Please hover over a word to define");
  $('#fos').text("");
  $("#next-arrow").removeClass("fa fa-arrow-circle-right");
  $("#def-name").text("");
}

function errorRun() {
  setTimeout(function(){
  if(errorInd.length > 2) {
    for(var i = 0; i < errorArr.length - 2; i++) {
    errorArr[i] += ",";
    }
  }
  if(errorInd.length > 1) {
    errorArr.splice(errorArr.length - 1, 0, "or ");
  }
  if(errorInd.length > 0) {
    $('#error-prompt-word').text(errorArr.join(" "));
    $("#no-word").removeClass("hidden");
    setTimeout(function(){
      $("#no-word").addClass("hidden");        
  }, 3000);
  }
  for(var i = errorInd.length - 1; i > -1; i--) {
    topicArrs.splice(errorInd[i], 1);
  }
  errorArr = [];
  errorInd = [];
  console.log(topicArrs);
}
, 1000);
}
  
getFirstWord(topicArrs[0]);


$("#submit").click(function() {
  promptResetting();
  for(var i = 0; i < topicArrs.length; i++ ) {

    if(topicArrs[i].reset !== "saving") {
      topicArrs[i].isSavable = false;
      document.querySelector(topicArrs[i].target).innerHTML = "";
      document.querySelector(topicArrs[i].target).parentElement.classList.add("hidden");
    }
    if(topicArrs[i].reset === "reset") {
      newPrompt(topicArrs[i], i);       
    }   
  }
  errorRun();
})


$(document).on("click", ".selector", function() {
  var target = "#" + $(this).children()[0].id;
  console.log($(this));
  for(var i = 0; i < topicArrs.length; i++) {
    if(topicArrs[i].selector === target){
      if(topicArrs[i].reset === "none"){
        topicArrs[i].reset = "reset";
        $(this).addClass("resetting");
      }
      else if(topicArrs[i].reset === "reset" && !topicArrs[i].isSavable) {
        topicArrs[i].reset = "none";
        $(this).removeClass("resetting");
      }
      else if(topicArrs[i].reset === "reset" && topicArrs[i].isSavable) {
          topicArrs[i].reset = "saving";
          $(this).removeClass("resetting");
          $(this).addClass("saving");
        }
      else if(topicArrs[i].reset === "saving"){
        console.log("this is currently saving");
          topicArrs[i].reset = "reset";
          $(this).removeClass("saving");
          $(this).addClass("resetting");
      }
      console.log(topicArrs[i].isSavable, topicArrs[i].reset, target );
      console.log("test 2", $(this));
    }
  }
});

var watchChange;

$(document).on("mouseenter", ".prompt-container", function() {  
  var target = "#" + $(this).children()[1].id
  console.log($(this).children()[1].id);
  $(".prompt-container").addClass("waiting");
  for(var i = 0; i < topicArrs.length; i++) {
    if(topicArrs[i].target === target){
     var check = i;
      watchChange = setTimeout(() => {
        setWords(topicArrs[check]);
        $(".prompt-container").removeClass("waiting");
    },
       2000);
    }
  }
}).on("mouseleave", ".prompt-container", function() {  
  var target = "#" + $(this).attr("id");
  $(".prompt-container").removeClass("waiting");
  for(var i = 0; i < topicArrs.length; i++) {
    if(topicArrs[i].target === target){
      clearTimeout(watchChange);
    }
  } 
});


$("#next-arrow").click(function() {
  $(this).attr("word");
  for(var i = 0; i < topicArrs.length; i++) {
      if($(this).attr("word") === topicArrs[i].word && topicArrs[i].defNums > 1){
        console.log(topicArrs[i]);
        if(topicArrs[i].defNums - 1 === topicArrs[i].defCounter) {
          topicArrs[i].defCounter = 0;
          $("#define").text(topicArrs[i].defs[topicArrs[i].defCounter]);
          $("#fos").text(topicArrs[i].fos[topicArrs[i].defCounter])  
        }
        else {
          topicArrs[i].defCounter++;
          $("#define").text(topicArrs[i].defs[topicArrs[i].defCounter]);
          $("#fos").text(topicArrs[i].fos[topicArrs[i].defCounter]);
        }
      }
    }
});

  function genNewSelector(wordz) {
    $("#prompt-selector").append('<button id="' + wordz.holder.slice(1) + '" class="selector"><p id="' + wordz.selector.slice(1) + '">' + wordz.initWord + '<p></button>');
    $("#advanced-prompt").append('<div class = "prompt-container hidden" id="' + wordz.sHolder.slice(1) + '"><div>' + wordz.initWord +': </div><div id="' + wordz.target.slice(1) +'" class="prompt"></div></div>');
}

  function Prompt(wordz) {
    this.initWord = wordz.charAt(0).toUpperCase() + wordz.slice(1);
    this.word = "";
    this.fos = [];
    this.defNums = [];
    this.defCounter = 0;
    this.urlVal = "https://api.datamuse.com/words?sp=" + wordz + "&qe=sp&md=d";
    this.isFirst = false;
    this.isSavable = false;
    this.isGen = true;
    this.target = "#" + wordz + "-prompt";
    this.selector = "#" + wordz + "-selector";
    this.holder = "#" + wordz + "-holder";
    this.sHolder = "#" + wordz + "-sHolder";
    this.reset = "none";
  }
  
  $("#submit-new").on("click", function(){
      var checking = $("#new-prompt").val().trim();
      var Regex=/^[a-zA-Z]+$/;
      console.log("Regex Test", Regex.test(checking));
      console.log(checking);
      if(checking !== "" && Regex.test(checking)){
        console.log("firing");
        topicArrs.push(new Prompt(checking));
        genNewSelector(topicArrs[topicArrs.length - 1]);
      } 
      else {
        $("#only-letters").removeClass("hidden");
        setTimeout(function(){
          $("#only-letters").addClass("hidden");        
        }, 3000)
      }
      $("#new-prompt").val("");   
  });


  $("#advanced").on("click", function(){
      $(".prompt-selector").removeClass("hidden");
      $("#advanced").addClass("hidden"); 
  });

  $("#back").on("click",function(){
      $(".prompt-selector").addClass("hidden");
      $("#advanced").removeClass("hidden"); 
  });

});








