import addTodos from './addTodos';
import getTodos from './getTodos';
import deleteTodo from './deleteTodo';
import updateTodo from './updateTodo';
import Todo from './Todo';

type AppSyncEvent = {
    info:{
        fieldName: String
    },
    arguments: {
        todoId: String
        todo: Todo
    }
}

exports.handler = async (event:AppSyncEvent) => {
    switch(event.info.fieldName){
        case "addTodo":
            return await addTodos(event.arguments.todo);
        case "getTodos":
            return await getTodos
        case "deleteTodo": 
            return await deleteTodo(event.arguments.todoId);
        case "updateTodo":
            return await updateTodo(event.arguments.todo);
        default:
            return null;
    }
}