const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

async function getTodos() {
    const params = {
        TableName: process.env.TODOS_TABLE,
    }
    try {
        const data = await documentClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default getTodos;