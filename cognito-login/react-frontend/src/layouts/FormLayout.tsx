import { ReactNode } from "react";
import { Avatar, Grid } from "@mui/material";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { logoStyle } from "../components/styles";

export default function FormLayout({ children }: { children: ReactNode }) {
    return (
        <Grid>
            <Grid display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                <Avatar style={logoStyle}><LocationCityIcon style={{ color: '#002A57', width: 56, height: 56 }} /></Avatar>
            </Grid>
            {children}
        </Grid>
    )
}