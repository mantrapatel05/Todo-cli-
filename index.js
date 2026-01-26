// import the file fn
const fs = require('fs');

const todo_file = './todo.json';

// load todos from the json file to return an array of objects

function loadTodos(){
    
    try{
        if(!fs.existsSync(todo_file)){
        return [];
        }

        const data = fs.readFileSync(todo_file,'utf-8');

        return JSON.parse(data);
    }catch(error){
        console.log("Error loading todos:", error.message);
        return [];
    }
}

//saving the data now loaded into the json file
function saveTodos(todos){
    try{
        const data = JSON.stringify(todos,null,2);

        fs.writeFileSync(todo_file,data,'utf-8');
    }catch(error){
        console.log("Error saving todos: ", error.message); 
    }
}

function addTodo(task){
    const todos = loadTodos();

    const newTodo = {
        id : Date.now(),
        task : task,
        completed : false,
        createdAt : new Date().toISOString()
    };

    todos.push(newTodo);
    saveTodos(todos);
    console.log(`Added: "${task}"`);
}

function listTodos(){
    const todos = loadTodos();


    if (todos.length == 0){
        console.log("No todos found. Please add new todos to see them.");
        return;
    }

    console.log("\nYour tasks\n");
    todos.forEach((todo,idx) => {
        const status = todo.completed ? 'x' : ' ';
        console.log(`${idx+1}.[${status}]${todo.task}`);
        console.log(`id: ${todo.id}`);
    });
}

function completeTodo(id){
    const todos = loadTodos();
    const todo = todos.find(t => t.id === parseInt(id));

    if(!todo){
        console.log("Todo not found!");
        return;
    }

    todo.completed = true;
    saveTodos(todos);
    console.log(`Completed "${todo.task}"`);
}

function deleteTodo(id){
    let todos = loadTodos();
    const intialLen = todos.length;

    todos = todos.filter(t => t.id != parseInt(id));

    if(todos.length === intialLen){
        console.log("Todo not found!");
        return;
    }
    saveTodos(todos);
    console.log("Todo Deleted");
}

function toggleTodo(id){
    const todos = loadTodos();

    const todo = todos.find(t => t.id != parseInt(id));

    if(!todo){
        console.log("Todo not found!");
        return;
    }

    todo.complete != todo.completed;

    saveTodos(todos);

    const state = todo.completed ? "completed!" : "pending";
    console.log(`Toggled: "${todo.task}" -> ${state}`);
}

const args = process.argv.slice(2);
const command = args[0];

switch(command){
    case 'add':
        const task = args.slice(1).join(' ');

        if(!task){
            console.log("Please provide a valid task description"); 
        }else{
            addTodo(task);
        }
        break;
    
    case 'list':
        listTodos();
        break;
    
    case 'complete':
        const completeId = args[1];
        if(!completeId){
            console.log("Please provide todo!");
        }else{
            completeTodo(completeId);
        }
        break;

    case 'delete':
        const deleteId = args[1];
        if(!deleteId){
            console.log("please provide a todo id!");
        }else{
            deleteTodo(deleteId);
        }
        break;

    case 'toggle':
        const toggleId = args[1];
        if(!toggleId){
            console.log("please provide a id to toggle");
        }else{
            toggleTodo(toggleId);
        }
        break;

    default:
        console.log("Unknown command");
}