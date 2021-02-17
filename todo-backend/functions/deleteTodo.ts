const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

async function deleteTodo(todoId: String){

    const params = {
        TableName: process.env.CRUD_TABLE || '',

        Key: {
            id: todoId
        }
    }

    try{
        await documentClient.delete(params).promise()
        return todoId
    }
    catch(error){
        return error
    }
}

export default deleteTodo