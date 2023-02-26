
const themeBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const txtInput = document.getElementById("addt");
const addBtn = document.getElementById("add-btn");
const ul = document.querySelector(".todos");
const filter= document.querySelector(".filter");
const btnFilter=document.querySelector("#clear-completed");
function main() {
  // Day/night theme-switcher
  themeBtn.addEventListener('click', () => {
    bodyTag.classList.toggle("light");
    const themeImg = document.getElementById("imgMain")
    console.log(themeImg);

    themeImg.setAttribute("src",
      themeImg.getAttribute("src") === "./assets/images/icon-sun.svg" ? "./assets/images/icon-moon.svg"
        : "./assets/images/icon-sun.svg"
    );
  });

  makeTodoElements(JSON.parse(localStorage.getItem("todos")));

  ul.addEventListener('dragover', (e) => {
    e.preventDefault()
    if (e.target.classList.contains("card") && !e.target.classList.contains("dragging")) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currentPos, newPos);
      if (currentPos > newPos) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        ul.insertBefore(draggingCard, e.target.nextSibling)
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPos, 1);
      todos.splice(newPos, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos))

    }
  });


  // Add toDo in local storage
  addBtn.addEventListener('click', () => {
    // get the input value when it is typed by user
    const item = txtInput.value.trim();
    if (item) {
      txtInput.value = "";
      const todos = !localStorage.getItem("todos") ? []
        : JSON.parse(localStorage.getItem("todos"));
      const currentTodos = {
        item: item,
        isCompeleted: false
      }
      todos.push(currentTodos);
      localStorage.setItem("todos", JSON.stringify(todos));
      makeTodoElements([currentTodos]);
    }

  });
  txtInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
      addBtn.click();
    }
  })
  filter.addEventListener('click',(e)=>{
    const id=e.target.id;
    if(id){
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector('.todos').className=`todos ${id}`;
    }
  });
btnFilter.addEventListener('click',()=>{
  var deletIndexes=[];
  document.querySelectorAll(".card.checked").forEach((card)=>{
deletIndexes.push(
  [...document.querySelectorAll(".todos .card")].indexOf(card)
  );
card.classList.add("fall");
card.addEventListener('animationend',()=>{
  card.remove()
});
  });
  removeMultipleTodos(deletIndexes);
})
}
function RemoveTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));  
}

function removeMultipleTodos(indexes){
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos= todos.filter((todo,index)=>{
    return !indexes.includes(index);
  })
  localStorage.setItem("todos",JSON.stringify(todos));
}
function removeTodo(index,isCompelete){
const todos =JSON.parse(localStorage.getItem("todos"));
todos[index].isCompelete = isCompelete;
localStorage.setItem("todos", JSON.stringify(todos));

}
function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function makeTodoElements(todoArray) {
  if (!todoArray) {
    return null;
  }
  const itemsLeft=document.querySelector('#items-left');
  todoArray.forEach(todoObject => {
    //creat Html Element of ToDo
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const itemP = document.createElement("p");
    const clearBtn = document.createElement("button");
    const imgg = document.createElement("img");

    //add classes of ToDo
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    itemP.classList.add("item");
    cbContainer.classList.add("cb-container");
    clearBtn.classList.add("clear");

    //add atributes of ToDo
    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    imgg.setAttribute("src", "./assets/images/icon-cross.svg");
    imgg.setAttribute("alt", "Clear it");

    //show todos items 
    itemP.textContent = todoObject.item;

    if(todoObject.isCompeleted){
      card.classList.add('checked');
      cbInput.setAttribute('checked','checked');
    }
    //Add EventListener
    card.addEventListener('dragstart', () => {
      card.classList.add("dragging");
    })
    card.addEventListener('dragend', () => {
      card.classList.remove("dragging");
    });
    cbInput.addEventListener('click',(e)=>{
const currentCard=cbInput.parentElement.parentElement;
const checked= cbInput.checked;
const currentCardIndex= [...document.querySelectorAll(".todos .card")]
.indexOf(currentCard);
stateTodo(currentCardIndex,checked);
checked ? currentCard.classList.add('checked') : currentCard.classList.remove('checked');
itemsLeft.textContent=document.querySelectorAll(
".todos .card:not(.checked)"
).length;
    })
    clearBtn.addEventListener('click', (e) => {
      const currentCard = clearBtn.parentElement;
      currentCard.classList.add('fall');
      const IndexOfCurrentcard = [...document.querySelectorAll(".todos .card")]
      .indexOf(currentCard);
      RemoveTodo(IndexOfCurrentcard);
      currentCard.addEventListener('animationend', () => {

        //Todo set new value of items left
      
      setTimeout(()=>{
        currentCard.remove();
        itemsLeft.textContent=document.querySelectorAll(
          ".todos .card:not(.checked)"
          ).length;
      },150);
      })
    });

    //set elements by parent child 
    clearBtn.appendChild(imgg);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(itemP);
    card.appendChild(clearBtn);
    document.querySelector(".todos").appendChild(card);
  });
  itemsLeft.textContent=document.querySelectorAll(
    ".todos .card:not(.checked)"
    ).length;
}
document.addEventListener("DOMContentLoaded", main)


