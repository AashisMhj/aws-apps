import { MouseEvent, useState } from 'react';
import { Avatar, Button, Link, TextField, Typography, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//
import { avatarStyle, btnstyle, paperStyle } from '../../components/styles';
import FormLayout from '../../layouts/FormLayout';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
    const navigation = useNavigate();
    const [form_values, setFormValues] = useState<{
        username: string,
        password:string,
        address: string,
        birthdate: Dayjs | null,
        position: string
    }>({
        username: '',
        password: '',
        address: '',
        birthdate: null,
        position: ''
    });

    async function handleSubmit(event:MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...form_values,
                    birthdate: form_values.birthdate?.format('YYYY-MM-DD')
                })
            });
            if(!res.ok) throw `Error with: ${res.statusText}`;
            // show snack bar
            navigation("/login")
        } catch (error) {
            // TODO show snackbar
            console.log(error);
        }
    }


    return <FormLayout>
        <Paper elevation={12} style={paperStyle}>
            <Grid display={'flex'} alignItems={'center'} justifyContent={'center'} container={true} direction={'column'}>
                <Avatar style={avatarStyle}><LockOutlinedIcon style={{ color: '#002A57' }} /></Avatar>
                <h2>SignUp</h2>
            </Grid>
            <TextField style={{ margin: '6px 0px' }} value={form_values.username} onChange={(event) => setFormValues(prev => ({ ...prev, username: event.target.value }))} id="register-username" label="Username" variant="standard" placeholder='Enter Your Username' fullWidth required />
            <TextField style={{ margin: '6px 0px' }} value={form_values.password} onChange={(event) => setFormValues(prev => ({ ...prev, password: event.target.value }))} id="register-password" label="Password" variant="standard" placeholder='Enter Your Password' type='password' fullWidth required />
            <TextField style={{ margin: '6px 0px' }} value={form_values.address} onChange={(event) => setFormValues(prev => ({ ...prev, address: event.target.value }))} id="register-address" label="Address" variant="standard" placeholder='Enter Your Address' fullWidth required />
            <DatePicker label="Birth Date"  value={form_values.birthdate} slotProps={{textField: {variant: 'standard', fullWidth: true}}} onChange={(newValue) => setFormValues(prev => ({...prev, birthdate: newValue}))} />
            <TextField style={{ margin: '6px 0px' }} value={form_values.position} onChange={(event) => setFormValues(prev => ({ ...prev, position: event.target.value }))} id="register-position" label="Position" variant="standard" placeholder='Enter Your Username' fullWidth required />

            <Button style={btnstyle} onClick={handleSubmit} color='primary' variant="contained" fullWidth>Register</Button>

            <Typography textAlign={'center'}>Already have a Account ? <br />
                <Link href="/login" >
                    Login
                </Link>
            </Typography>
        </Paper>
    </FormLayout>

}