#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CrudBackendStack } from '../lib/crud-backend-stack';

const app = new cdk.App();
new CrudBackendStack(app, 'CrudBackendStack');
