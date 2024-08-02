import express, {Express, NextFunction, Request, Response} from "express";
import {
    AdminConfirmSignUpCommand, AdminConfirmSignUpRequest, 
    ChangePasswordCommand, 
    ChangePasswordRequest, 
    CognitoIdentityProviderClient, GetUserCommand, GetUserRequest, InitiateAuthCommand, 
    InitiateAuthRequest, SignUpCommand, SignUpRequest,
    UpdateUserAttributesCommand,
    UpdateUserAttributesRequest
} from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";
import cors from 'cors'
import {CloudWatchLogsClient, CreateLogGroupCommand, InputLogEvent, PutLogEventsCommand, PutLogEventsRequest} from '@aws-sdk/client-cloudwatch-logs';
import { verifyAccessToken } from "./util";
import { JWT_ERRORS } from "./types";


dotenv.config()

const app:Express = express();
const port = process.env.PORT || 5000;
const user_pool = process.env.USER_POOL_ID;
const client_id = process.env.CLIENT_ID;
const api_url = process.env.API_URL as string;
const log_group_name = process.env.LOG_GROUP_NAME as string;
const log_group_stream = process.env.LOG_STREAM_NAME as string;

const client = new CognitoIdentityProviderClient({region: 'us-east-1'});
const logClient = new CloudWatchLogsClient({region: 'us-east-1'});
app.use(cors());
app.use(express.json());


async function putLog(log_event:InputLogEvent){
    const input:PutLogEventsRequest = {
        logGroupName: log_group_name,
        logStreamName: log_group_stream,
        logEvents: [
            log_event
        ]
    };
    const command  = new PutLogEventsCommand(input);
    const response = await logClient.send(command);
}

async function refreshToken(refreshToken:string){
    const input:InitiateAuthRequest = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: client_id,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken
        }
    };
    const command = new InitiateAuthCommand(input);
    const response = await client.send(command);
    return response;
}

// logger middleware
app.use((req:Request, res:Response, next:NextFunction)=>{
    // TODO create a auth validation middleware
    // TODO log request
    putLog({
        timestamp: Date.now(),
        message: JSON.stringify({message: `${req.method} called on ${req.url}`, type: 'info'})
    })
    next();
});

function authCheck(req:Request, res:Response, next:NextFunction){
    const authToken = req.headers.authorization;
    if(!authToken) return res.status(401).json({
        msg: 'Unauthorized'
    });

    next();
}

app.get('/', (req:Request, res:Response)=>{
   
    res.json({
        msg: "hello from the other side"
    })
});

app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const body = req.body;
        const username = body.username;
        const password = body.password;
        if(!username || !password) return res.json(400).json({
            msg: 'Validation Fail'
        });
        const input:InitiateAuthRequest =   {
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                "USERNAME": username,
                "PASSWORD": password
            },
            ClientId: client_id
        }
        const command = new InitiateAuthCommand(input);
        const response = await client.send(command);
        return res.json({
            msg: 'Heavens Know',
            authTokens: response.AuthenticationResult
        })
    } catch (error) {
        next(error);
    }
});

app.post('/register', async (req: Request, res:Response, next:NextFunction)=>{
    try {
        const body = req.body;
        const input:SignUpRequest = {
            ClientId: client_id,
            Username: body.username,
            Password: body.password,
            UserAttributes: [
                {
                    Name: "address",
                    Value: body.address
                },
                {
                    Name: "birthdate",
                    Value: body.birthdate
                },
                {
                    Name: 'custom:position',
                    Value: body.position
                }
            ]
        };
        const command = new SignUpCommand(input);
        const response = await client.send(command);
        const confirmInput:AdminConfirmSignUpRequest = {
            UserPoolId: user_pool,
            Username: body.username
        };
        const confirmCommand = new AdminConfirmSignUpCommand(confirmInput);
        const confirmResponse = await client.send(confirmCommand);
        return res.json({
            msg: 'User Registered',
            userSub: response.UserSub
        });
    } catch (error) {
        next(error)
    }
});

app.get('/dashboard',authCheck, async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const token = req.headers.authorization as string;
        const url = api_url+'/static-Response';
        const apiRes = await fetch(url, {
            method: 'GET',
            headers: {"authorization": `${token}`, 'Content-Type': 'application/json' }
        });
        // if(!apiRes.ok) throw `Error with msg: ${apiRes.statusText}`
        const data = await apiRes.json();
        return res.json(data);
    } catch (error) {
        next(error)
    }
});

app.get('/profile',authCheck ,async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // TODO authorization token type to be required in type
        const authToken = req.headers.authorization as string;
        const input:GetUserRequest = {
            AccessToken: `${authToken.replace('Bearer ', '')}==`
        };
        const command = new GetUserCommand(input);
        const response = await client.send(command);
        return res.json({
            data: response.UserAttributes,
            username: response.Username
        });
    } catch (error) {
        next(error);
    }
});

app.post('/update-profile',authCheck ,async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const authToken = req.headers.authorization as string;
        const data = req.body;
        if(!data.position || !data.address) return res.status(400).json({
            msg: 'Validation Fail'
        });
        const input:UpdateUserAttributesRequest = {
            UserAttributes: [
                {
                    Name: "address",
                    Value: data.address
                },
                {
                    Name: "custom:position",
                    Value: data.position
                },
            ],
            AccessToken: `${authToken.replace('Bearer ','')}`
        };
        const command = new UpdateUserAttributesCommand(input);
        const response = await client.send(command);
        return res.json({
            data: 'Profile Updated'
        });
    } catch (error) {
        next(error);
    }
});

app.post('/update-password', authCheck, async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const authToken = req.headers.authorization as string;
        const data = req.body;
        if(!data.old_password || !data.new_password) return res.status(400).json({
            msg: 'Validation Error'
        });
        const input:ChangePasswordRequest = {
            PreviousPassword: data.old_password,
            ProposedPassword: data.new_password,
            AccessToken: authToken.replace('Bearer ','')
        };
        const command = new ChangePasswordCommand(input);
        const response = await client.send(command);
        return res.status(200).json({
            msg: 'Password Updated'
        });
    } catch (error) {
        next(error);
    }
})

app.use((err:Error,req:Request, res:Response, next:NextFunction)=>{
    putLog({
        timestamp: Date.now(),
        message: JSON.stringify({ message: err.message, type: "error"})
    })
    return res.status(500).json({
        msg: 'Server Error'
    })
});


app.listen(port, ()=>{
    console.log(`Server start at ${port}`);
})

