import { useEffect, useState, } from 'react';
import { useParams, } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
} from '@mui/material';
import './App.css';

const PayInvoice = () => {
  const [invoice, setData] = useState([]);
  const { invoice_number, } = useParams()
  useEffect(() => {
    fetch(`/invoices/${invoice_number}`)
      .then((res) => res.json())
      .then((data) => setData(data.data[0]))
  }, [invoice_number])

  const checkForContent = (content) => {
    return !(content && Object.keys(content).length === 0 && Object.getPrototypeOf(content) === Object.prototype)
  }

  const contents = (
    <Box>
      <Typography variant='h6'>
        Invoice number: {invoice.invoice_number}
      </Typography>
      <Typography variant='h6'>
        Title: {invoice.title}
      </Typography>
      <Typography variant='h6'>
        Description: {invoice.description}
      </Typography>
      <Typography variant='h6'>
        Amount: ${invoice.amount}
      </Typography>
      <Button variant='contained' size='large' >
        Pay
      </Button>
      <TextField id="outlined-basic" label="Amount" variant="outlined" size='small' />
    </Box>
  )

  return ( 
    <>
      <Container>
        {invoice && checkForContent(invoice) ? contents : <p>"Loading..."</p>}
      </Container>
    </>
  )
}

export default PayInvoice;
