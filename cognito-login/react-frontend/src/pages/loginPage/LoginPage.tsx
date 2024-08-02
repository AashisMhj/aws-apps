import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { MouseEvent, useState } from 'react';
import { Avatar, Button, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
//
import { avatarStyle, btnstyle, paperStyle } from '../../components/styles';
import FormLayout from '../../layouts/FormLayout';
import { useAuthContext } from '../../context/Auth.context';
import { useToastContext } from '../../context/Toast.context';

export default function LoginPage() {
    const [form_values, setFormValues] = useState({
        username: '',
        password: '',
    });
    const {loginUser} = useAuthContext();
    const {setToastContent} = useToastContext();
    const [is_loading, setIsLoading] = useState(false);

    async function handleSubmit(event:MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        try {
            setIsLoading(true);
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form_values)
            });
            if(!res.ok) throw `Api Error: ${res.statusText}`;
            const resJson = await res.json();
            if(resJson.authTokens && resJson.authTokens.AccessToken && resJson.authTokens.RefreshToken){
                loginUser(resJson.authTokens.AccessToken, resJson.authTokens.RefreshToken, resJson.authTokens.IdToken);
            }
            // TODO set login credentials
            setToastContent('Login Successful')
        } catch (error) {
            setToastContent('Login Error');
        }finally{
            setIsLoading(false);
        }
    }

    return <FormLayout>
        <Paper elevation={12} style={paperStyle}>
            <Grid display={'flex'} alignItems={'center'} justifyContent={'center'} container={true} direction={'column'}>
                <Avatar style={avatarStyle}><LockOutlinedIcon style={{ color: '#002A57' }} /></Avatar>
                <h2>Login</h2>
            </Grid>
            <TextField style={{margin: '6px 0px'}} value={form_values.username} onChange={(event) => setFormValues(prev => ({...prev, username: event.target.value}))} id="login-username" label="Username" variant="standard" placeholder='Enter Your Username' fullWidth required />
            <TextField style={{margin: '6px 0px'}} value={form_values.password} onChange={(event) => setFormValues(prev => ({...prev, password: event.target.value}))} id="login-password" label="Password" variant="standard" placeholder='Enter Your Password' type='password' fullWidth required />
            <Button style={btnstyle} disabled={is_loading} onClick={handleSubmit} color='primary' variant="contained" fullWidth>Login</Button>
            <Typography textAlign={'center'}>Don't have an account? <br />
                <Link href="/sign-up" >
                    Sign Up Here.
                </Link>
            </Typography>
        </Paper>
    </FormLayout>

}