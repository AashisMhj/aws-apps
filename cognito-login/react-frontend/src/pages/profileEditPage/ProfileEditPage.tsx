import { Button, Grid, Paper, TextField, } from "@mui/material";
import FormLayout from "../../layouts/FormLayout";
import { btnstyle, paperStyle } from "../../components/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { MouseEvent, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { getTokens } from "../../context/Auth.context";
import { UserAttributesType } from "../../types";
import { useToastContext } from "../../context/Toast.context";

export default function ProfileEditPage() {
    const [form_values, setFormValues] = useState<{
        username: string,
        address: string,
        birthdate: Dayjs | null,
        position: string
    }>({
        username: '',
        address: '',
        birthdate: null,
        position: ''
    });
    const [is_loading, setIsLoading] = useState(false);
    const {setToastContent} = useToastContext();

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const tokens = getTokens();
        if(!tokens) {
            // Throw Error
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokens.accessToken}`
                },
                body: JSON.stringify({
                    ...form_values,
                    birthdate: form_values.birthdate?.format('YYYY-MM-DD')
                })
            });
            if (!res.ok) throw `Error with: ${res.statusText}`;
            setToastContent('Profile Saved')
            // show snack bar
        } catch (error) {
            setToastContent('Error Saving Profile')
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const tokens = getTokens();
        (async () => {
            if (tokens) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/profile`, {
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${tokens.accessToken}`
                        }
                    });
                    if (!res.ok) throw `Error: ${res.statusText}`;
                    const resJson = await res.json() as {data: UserAttributesType, username: string};
                    if (resJson) {
                        console.log(resJson);
                        setFormValues({
                            address: resJson.data[0].Value,
                            birthdate: dayjs(resJson.data[1].Value),
                            position: resJson.data[2].Value,
                            username: resJson.username
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })()
    }, [])

    return <FormLayout>
        <Paper elevation={12} style={paperStyle}>
            <Grid display={'flex'} alignItems={'center'} justifyContent={'center'} container={true} direction={'column'}>
                <h2>Edit Profile</h2>
            </Grid>
            <TextField style={{ margin: '6px 0px' }} value={form_values.username}  onChange={(event) => setFormValues(prev => ({ ...prev, username: event.target.value }))} id="register-username" label="Username" variant="standard" placeholder='Enter Your Username' fullWidth required disabled={true} />
            <TextField style={{ margin: '6px 0px' }} value={form_values.address} onChange={(event) => setFormValues(prev => ({ ...prev, address: event.target.value }))} id="register-address" label="Address" variant="standard" placeholder='Enter Your Address' fullWidth required />
            <DatePicker label="Birth Date" value={form_values.birthdate} slotProps={{ textField: { variant: 'standard', fullWidth: true } }} onChange={(newValue) => setFormValues(prev => ({ ...prev, birthdate: newValue }))} disabled={true} />
            <TextField style={{ margin: '6px 0px' }} value={form_values.position} onChange={(event) => setFormValues(prev => ({ ...prev, position: event.target.value }))} id="register-position" label="Position" variant="standard" placeholder='Enter Your Username' fullWidth required />

            <Button style={btnstyle} disabled={is_loading} onClick={handleSubmit} color='primary' variant="contained" fullWidth>Update</Button>
        </Paper>
    </FormLayout>
}