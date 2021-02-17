import {DynamoDB} from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

async function getTodos (){

    const params = {
        TableName: process.env.CRUD_TABLE || ''
    }

    try{
        const data = await documentClient.scan(params).promise()
        return data.Items
    }
    catch(error){
        return error
    }
}

export default  getTodos