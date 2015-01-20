var myBaseRef = new Firebase("https://askqueue.firebaseio.com");
var myQRef = myBaseRef.child('-Jg4e7XT_OaCuXONRNM1/questions');

var createQuestionTags = function(qData) {
  var wrapper = document.createElement('div'),
      question = document.createElement('div'),
      votes = document.createElement('div'),
      upvote = document.createElement('div'),
      delq = document.createElement('div'),
      qText = document.createElement('p');

  question.className = 'question';
  question.setAttribute('data-key', qData.key());
  votes.className = 'votes';
  votes.textContent = qData.val().votes.toString();
  upvote.className = 'upvote';
  upvote.textContent = '+';
  delq.className = 'delete';
  delq.textContent = 'x';
  qText.textContent = qData.val().question;

  votes.appendChild(upvote);
  votes.appendChild(delq);
  question.appendChild(votes);
  question.appendChild(qText);
  wrapper.appendChild(question);

  return wrapper.innerHTML;
};

var updateQuestion = function(qData) {
  var wrapper = document.createElement('div'),
      votes = document.createElement('div'),
      upvote = document.createElement('div'),
      delq = document.createElement('div'),
      qText = document.createElement('p');

  votes.className = 'votes';
  votes.textContent = qData.val().votes.toString();
  upvote.className = 'upvote';
  upvote.textContent = '+';
  delq.className = 'delete';
  delq.textContent = 'x';
  qText.textContent = qData.val().question;

  votes.appendChild(upvote);
  votes.appendChild(delq);
  wrapper.appendChild(votes);
  wrapper.appendChild(qText);

  return wrapper.innerHTML;
};

var LoadQuestion = function(qData, updated) {
  var el = createQuestionTags(qData);

  document.getElementsByClassName('questions')[0].innerHTML += el;
};

myQRef.on('child_added', function(snap){
  LoadQuestion(snap);
});

myQRef.on('child_changed', function(snap){
  $(".questions").find("[data-key='" + snap.key() + "']")[0].innerHTML = updateQuestion(snap);
});

myQRef.on('child_removed', function(snap){
  $(".questions").find("[data-key='" + snap.key() + "']")[0].remove();
});

var submitQ = function() {
  myQRef.push({
    question: document.getElementsByClassName('input')[0].value,
    votes: 0
  });
  $('.input').val("");
};

document.getElementsByClassName('input')[0].addEventListener('keydown', function(e) {
  if(e.keyCode == 13) { submitQ(); }
}, false);

document.getElementsByClassName('submit')[0].addEventListener('click', function() {
  submitQ();
});

$('.questions').on('click', '.upvote', function(e) {
  var myKey = $(e.target).parents('.question')[0].getAttribute('data-key');
  myQRef.child(myKey + '/votes').transaction(function(votes) { return votes + 1; });
});

$('.questions').on('click', '.delete', function(e) {
  var myKey = $(e.target).parents('.question')[0].getAttribute('data-key');
  myQRef.child(myKey).remove();
});

$('header a').on('click', function() {
  $('.halp').show();
});

$('.halp').on('click', function() {
  $('.halp').hide();
});
