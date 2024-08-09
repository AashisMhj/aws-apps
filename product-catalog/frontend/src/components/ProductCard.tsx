import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AttachMoney, Inventory } from '@mui/icons-material';
import { Box } from '@mui/material';

interface ProductCardProps {
  title: string,
  image: string,
  description?: string,
  id: string,
  price: number,
  stock_quantity: number,
  showModal: (id: string) => void
}

export default function ProductCard({ description, id, image, title, showModal, price, stock_quantity }: ProductCardProps) {
  return (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {
            description || ''
          }
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'4px'}}>
          <Typography variant='body2' color="GrayText" fontSize={18}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', }} marginY={1}>
              <AttachMoney color='primary' /> {price}</Box>
            <Inventory color='primary' /> {stock_quantity}
          </Typography>
          <Typography variant='body2' color="GrayText" fontSize={18}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }} marginY={1}>
            </Box>
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => showModal(id)}>Pre Order</Button>
      </CardActions>
    </Card>
  );
}
