import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class TodoBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'crudApi' , {
      name: "cdk-appsync-crud-app",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });

    const lambda_function = new lambda.Function (this, 'crudLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('function'),
      handler: 'main.handler'
    });

    const datasource = api.addLambdaDataSource('CrudDatasource', lambda_function);

    datasource.createResolver({
      typeName: 'Query',
      fieldName: 'getTodos'
    });

    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addTodo'
    })

    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteTodo'
    })

    datasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTodo'
    })

    const table = new dynamodb.Table(this, "crudNoteTable", {
      partitionKey:{
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    });

    table.grantFullAccess(lambda_function);

    lambda_function.addEnvironment('CRUD_TABLE', table.tableName)



  }

}
