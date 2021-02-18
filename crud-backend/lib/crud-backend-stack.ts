import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class CrudBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-todos-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });
    
    const todosLambda = new lambda.Function(this, 'AppSyncNotesHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });

    const datasource = api.addLambdaDataSource('lambdaDatasource', todosLambda);

    datasource.createResolver({
      typeName: "Query",
      fieldName: "getTodos"
    });

    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo"
    });

    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo"
    });

    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo"
    });

    const todosTable = new dynamodb.Table(this, 'CDKTodosTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
    todosTable.grantFullAccess(todosLambda)
    todosLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

  }
}
