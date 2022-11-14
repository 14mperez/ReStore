import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";

export default function SererError() {
    // Hooks
    const history = useHistory();
    const {state} = useLocation<any>();
    return (
        <Container component={Paper}>
            {state?.error ? (
                <> {/*Catching server error*/}
                <Typography variant="h3" color='error' gutterBottom>{state.error.title}</Typography>
                <Divider />
                <Typography>{state.error.detail || 'internal server error'}</Typography>    
                </>
            ): (
                <Typography variant="h5" gutterBottom>Server error</Typography>
            )}
            {/*Creating button for user to go back after error*/}
            <Button onClick={() => history.push('/catalog')}>Go back to the store</Button>
            
        </Container>
    )
}