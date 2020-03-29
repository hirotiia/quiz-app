
(() => {

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';


const gameState = {
    quizzes: [],
    currentIndex: 0,
    numberOfCorrects: 0
};



const questionElement = document.getElementById('question');
const ulContainer = document.getElementById('ulcontainer');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restart-button');
const lastPage = document.getElementById('lastpage');
const evoluationElement = document.getElementById('evoluation');
const finishedContainer = document.getElementById('finished');

window.addEventListener('load', (event) => {
  fetchQuizData();
});


restartButton.addEventListener('click', (event) => {
    fetchQuizData();
});



const fetchQuizData = async() => {
    questionElement.textContent = 'Now loading...';
    resultElement.textContent = '';
    restartButton.hidden = true;
    finishedContainer.hidden = true;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // console.log('response',response);
        
        console.log('data',data);
        gameState.quizzes = data.results;
        gameState.currentIndex = 0;
        gameState.numberOfCorrects = 0;
        setNextQuiz();
    }catch(error) {
        console.log('error',error);

    }


};


const setNextQuiz = () => {
    questionElement.textContent = '';
    removeAllAnswers();
    if(gameState.currentIndex < gameState.quizzes.length){
        const quiz = gameState.quizzes[gameState.currentIndex];
        makeQuiz(quiz);

    }else{
        finishQuiz();
        
    }
};


const finishQuiz = () => {
    const corrects = gameState.numberOfCorrects;
    lastPage.textContent = '----------結果発表-----------';
    resultElement.textContent = `${corrects}/${gameState.quizzes.length} corrects`;
    if(corrects === gameState.quizzes.length){
      evoluationElement.textContent = '大変よくできました!!';
    }else if(corrects > 6 && corrects < gameState.quizzes.length){
      evoluationElement.textContent = 'よくできました!';
    }else{
      evoluationElement.textContent = 'もう一回チャレンジしてみてね!';
    }
    restartButton.hidden = false;
    finishedContainer.hidden = false;
};


const removeAllAnswers = () => {
    while(ulContainer.firstChild){
        ulContainer.removeChild(ulContainer.firstChild);
    }
};



const makeQuiz = (quiz) => {
    questionElement.textContent = unescapeHTML(quiz.question);
    const answers = builtAnswers(quiz);
    answers.forEach((answer, index) => {
      const liElement = document.createElement('li');
      liElement.textContent = unescapeHTML(answer);
      ulContainer.appendChild(liElement);

      liElement.addEventListener('click', (event) => {
        const correct = unescapeHTML(quiz.correct_answer);
        if(liElement.textContent === correct){
          alert('Correct answer!!');
          gameState.numberOfCorrects++;
        }else{
          alert(`Wrong answer... (The correct answer is ${correct})`);
        }
        gameState.currentIndex++;
        setNextQuiz();
      });
    });
};



const builtAnswers = (quiz) => {
    
    const answers = [
        quiz.correct_answer,
        ...quiz.incorrect_answers
    ];
    // console.log(answers);
    return shuffle(answers);

};





const shuffle = (array) => {
    const copiedArray = array.slice();
    for (let i = copiedArray.length - 1; i >= 0; i--){
        const rand = Math.floor( Math.random() * ( i + 1 ) );
        [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]];
      }
      return copiedArray;

};


const unescapeHTML = (str) => {
    const div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                       .replace(/>/g,"&gt;")
                       .replace(/ /g, "&nbsp;")
                       .replace(/\r/g, "&#13;")
                       .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  };

})();