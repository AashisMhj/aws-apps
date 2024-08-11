import { Box, Button, Container, Grid, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { fetchAPI } from "./services/api.service";
import { getProductsQuery } from "./queries";
import ProductCard from "./components/ProductCard";
import { Product } from "./types";
import { modalStyles } from "./assets/styles";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal_form_fields, setModalFormFields] = useState({
    name: '',
    quantity: 0,
  });
  const [modal_product_id, setModalProductId] = useState<string | null>(null);
  function submitPreOrder() {
    // TODO make api call
    setModalFormFields({name: '', quantity: 0});
    setModalProductId(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAPI(getProductsQuery.query, getProductsQuery.variables) as { products: Product[] };
        setProducts(res.products);

      } catch (error) {
        console.trace(error);
      }
    })()
  }, []);


  return (
    <>
      <Container>
        <Grid container columns={{ xs: 2, sm: 4, md: 6 }} gap={4}>
          {
            products.map(product => <Grid item key={product._id} xs={1} sm={1} md={1}> <ProductCard
              id={product._id}
              image="https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
              showModal={(id) => setModalProductId(id)}
              title={product.product_name}
              price={product.price}
              stock_quantity={product.stock_quantity}
              description={product.description} />
            </Grid>)
          }
        </Grid>
      </Container>
      <Modal
        open={modal_product_id !== null}
        onClose={() => setModalProductId(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyles}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Pre Order Product
          </Typography>
          <Box component="form" sx={{
            '& > :not(style)': { m: 1, width: 'full' }
          }}>
            <TextField
              id="name" label="Name"
              variant="standard" fullWidth
              value={modal_form_fields.name}
              onChange={(event) => setModalFormFields((pre) => ({ ...pre, name: event.target.value }))}
            />
            <TextField
              id="quantity" label="Quantity"
              variant="standard" fullWidth type="number" 
              value={modal_form_fields.quantity}
              onChange={(event) => setModalFormFields((pre) => ({...pre, quantity: parseInt(event.target.value)}))}
              />
            <Button variant="contained" color="success" onClick={submitPreOrder} fullWidth>Submit Pre Order</Button>
            <Button variant="outlined" color="error" fullWidth onClick={() => setModalProductId(null)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default App
