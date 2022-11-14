import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";

export default function ProductDetails() {
    const {id} = useParams<{id: string}>();
    const [product, setProducts] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { // Making request to the API controller
        agent.Catalog.details(parseInt(id))
            .then(response => setProducts(response)) // If we get a successful response, then set the product to the response
            .catch(error => console.log(error)) // Catching error and logging out to console
            .finally(() => setLoading(false)); // Turn off any loading going on
    }, [id])

    if (loading) return <LoadingComponent message='Loading product...' />

    if(!product) return <NotFound />

    return( // Organizing product information and details
        <Grid container spacing={6}> {/*Setting grid size and spacing*/}
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow> {/*Retrieving product information and organizing them into a table cell format*/}
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}