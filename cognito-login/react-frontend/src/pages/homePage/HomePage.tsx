import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import {useEffect, useState} from 'react';
import { getTokens } from "../../context/Auth.context";
import { DashboardItemType } from "../../types";
import { useToastContext } from "../../context/Toast.context";


export default function HomePage() {
    const [items, setItems] = useState<DashboardItemType[]>([]);
    const {setToastContent} = useToastContext();
    useEffect(()=>{
        const tokens = getTokens();
        if(!tokens || !tokens.idToken) return ;
        (async()=>{
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/dashboard`, {
                    headers: {'Authorization': `Bearer ${tokens.idToken}`,},
                    method: 'GET',
                });
                if(!res.ok) throw `Error: ${res.statusText}`;
                const resJson = await res.json() as { data:DashboardItemType[]};
                if(resJson.data){
                    setItems(resJson.data);
                }
                // TODO update access token if expired;
            } catch (error) {
                setToastContent('Error Fetching Dashboard Data');
            }
        })()
    }, [setToastContent])
    return <Box marginY={2}>
        <Grid container columns={4} spacing={2} alignItems={'center'}>
            {
                items.map((el, index) => (
                    <Grid item key={index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{el.title}</Typography>
                                <Typography variant="h5" component="div">{el.sub_title}</Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">{el.secondary_text}</Typography>
                                <Typography variant="body2">{el.description}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    </Box>
}