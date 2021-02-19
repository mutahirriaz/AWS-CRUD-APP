import Amplify from "aws-amplify";
import React from "react";
import AmplifyClient from "../amplifyContext/client";

export default ({ element }) => <AmplifyClient>{element}</AmplifyClient>