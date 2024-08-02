import { MouseEvent, useState } from "react";
import { Button, Grid, Paper, TextField } from "@mui/material";
//
import FormLayout from "../../layouts/FormLayout";
import { btnstyle, paperStyle } from "../../components/styles";
import { getTokens } from "../../context/Auth.context";
import { useToastContext } from "../../context/Toast.context";

export default function PasswordChangePage(){
    const [form_values, setFormValues] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [is_loading, setIsLoading] = useState(false);
    const {setToastContent} = useToastContext();

    async function handleSubmit(event:MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        const tokens = getTokens();
        if(!tokens) return;
        try {
            setIsLoading(true);
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/update-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokens.accessToken}`
                },
                body: JSON.stringify(form_values)
            });
            if(!res.ok) throw `Error: ${res.statusText}`;
            setToastContent('Password Changed Successfully');
        } catch (error) {
            setToastContent('Error Changing Password');
        }finally{
            setIsLoading(false);
        }
    }
    return <FormLayout>
    <Paper elevation={12} style={paperStyle}>
        <Grid display={'flex'} alignItems={'center'} justifyContent={'center'} container={true} direction={'column'}>
            <h2>Change Password</h2>
        </Grid>
        <TextField style={{margin: '6px 0px'}} value={form_values.old_password} onChange={(event) => setFormValues(prev => ({...prev, old_password: event.target.value}))} id="old-password" label="Old Password" variant="standard" placeholder='Enter Your Old Password' fullWidth required />
        <TextField style={{margin: '6px 0px'}} value={form_values.new_password} onChange={(event) => setFormValues(prev => ({...prev, new_password: event.target.value}))} id="new-password" label="New Password" variant="standard" placeholder='Enter New Password' type='password' fullWidth required />
        <TextField style={{margin: '6px 0px'}} value={form_values.confirm_new_password} onChange={(event) => setFormValues(prev => ({...prev, confirm_new_password: event.target.value}))} id="confirm-password" label="Confirm Password" variant="standard" placeholder='Confirm Password' type='password' fullWidth required />

        <Button style={btnstyle} disabled={is_loading} onClick={handleSubmit} color='primary' variant="contained" fullWidth>Login</Button>
    </Paper>
</FormLayout>
}