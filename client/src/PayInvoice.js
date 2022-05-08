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
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [labelValue, setLabelValue] = useState('Amount');
  const [textValue, setTextValue] = useState(`Please enter amount up to ${labelValue}`)
  const [textErrorState, setTextErrorState] = useState(false);
  const [invoice, setData] = useState([]);
  const { invoice_number, } = useParams()
  useEffect(() => {
    fetch(`/invoices/${invoice_number}`)
      .then((res) => res.json())
      .then((data) => {
        const invoice = data.data[0];
        setData(invoice);
        if (invoice.amount > 0) {
          setButtonDisabled(false);
          setLabelValue(`$${invoice.amount}`)
        };
        if (invoice.amount === 0) {
          setLabelValue('Invoice is paid');
          setTextValue('Thank you for your payment');
        }
      });
  }, [invoice_number]);

  const checkForContent = (content) => {
    return !(content && Object.keys(content).length === 0 && Object.getPrototypeOf(content) === Object.prototype)
  };

  const isNumeric = (str) => {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str))
  }

  const validateAmount= (e) => {
    const value = e.target.value;
    if (isNumeric(value)) {
      setTextErrorState(false);
      setLabelValue(`$${invoice.amount}`);
      setTextValue(`Please enter amount up to $${labelValue}`);  
    }
    if (!isNumeric(value)) {
      setTextValue('Please enter a valid number');
      setTextErrorState(true);
      return
    }
    if (value > invoice.amount) {
      setTextValue(`Please adjust value to less than or equal to ${invoice.amount}`);
      setTextErrorState(true);
      return
    }
  };

  const contents = () => (
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
      <Button
        disabled={buttonDisabled}
        variant='contained'
        size='large'
      >
        Pay
      </Button>
      <TextField
        id="amount field"
        disabled={buttonDisabled}
        error={textErrorState}
        onChange={e => validateAmount(e)}
        label={labelValue}
        variant="outlined"
        size='small'
      />
      <Typography>
        {textValue}
      </Typography>
    </Box>
  )

  return ( 
    <>
      <Container>
        {invoice && checkForContent(invoice) ? contents() : <p>"Loading..."</p>}
      </Container>
    </>
  )
}

export default PayInvoice;
