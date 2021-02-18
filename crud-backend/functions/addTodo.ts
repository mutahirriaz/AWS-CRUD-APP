const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
import Todo from './Todo';

async function addTodo(todo: Todo) {
    const params = {
        TableName: process.env.TODOS_TABLE,
        Item: todo
    }
    try {
        await documentClient.put(params).promise();
        return todo;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default addTodo;