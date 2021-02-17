const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
import Todo from '../functions/Todo'

async function addTodo(todo: Todo){

    const params = {
        TableName: process.env.CRUD_TABLE || '',
        Item: todo
    }

    try{
        await documentClient.put(params).promise();
        return todo;
    }
    catch(error) {
        return error
    }
}

export default addTodo

