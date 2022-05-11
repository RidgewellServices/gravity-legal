import { useEffect, useState, } from 'react';
import { useParams, } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
} from '@mui/material';
import { invoiceType, } from '../types'
import './App.css';

const emptyInvoice = {
  invoice_number: -1,
  title: '',
  description: '',
  amount: 0
}

const PayInvoice = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [labelValue, setLabelValue] = useState('Amount');
  const [textFieldDisabled, setTextFieldDisabled] = useState(true);
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [textValue, setTextValue] = useState(``)
  const [textErrorState, setTextErrorState] = useState(false);
  const [invoice, setData] = useState<invoiceType>(emptyInvoice);
  const { invoice_number, } = useParams()
  useEffect(() => {
    fetch(`/invoices/${invoice_number}`)
      .then((res) => res.json())
      .then((data) => {
        const invoice = data.data[0];
        setData(invoice);
        if (invoice.amount > 0) {
          setTextFieldDisabled(false);
          setLabelValue(`$${invoice.amount}`);
        };
        if (invoice.amount === 0) {
          setLabelValue('Invoice is paid');
          setTextValue('Thank you for your business');
        }
      });
  }, [invoice_number]);

  const checkForContent = (content: any) => {
    return !(content && Object.keys(content).length === 0 && Object.getPrototypeOf(content) === Object.prototype)
  };

  const isNumeric = (str: number) => {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str))
  }

  const validateAmount= (e: any) => {
    const value = e.target.value;
    if (isNumeric(value)) {
      setButtonDisabled(false);
      setTextErrorState(false);
      setTextValue(`Please enter amount up to $${invoice.amount}`); 
      setTextFieldValue(value) 
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

  const submitPayment = () => {
    const remainderDue = invoice.amount - parseInt(textFieldValue);
    fetch(`/invoices/${invoice_number}`, {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ "remainderDue": `${remainderDue}` })
    })
    .then(() => {
      fetch(`/invoices/${invoice_number}`)
      .then((res) => res.json())
      .then((data) => {
        const invoice = data.data[0];
        setData(invoice);
        if (invoice.amount > 0) {
          setButtonDisabled(true);
          setLabelValue(`$${invoice.amount}`)
          setTextFieldValue('')
          setTextValue(`Thanks for your payment of $${textFieldValue}`)
        };
        if (invoice.amount === 0) {
          setButtonDisabled(true);
          setLabelValue('Invoice is paid');
          setTextFieldValue('Invoice is paid');
          setTextValue('Thank you for your payment');
          setTextFieldDisabled(true);
          setTextFieldValue('');
        }
      })
    })
    .catch((error) => {
        console.error(error);
    });
  }

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
        Amount owed: ${invoice.amount}
      </Typography>
      <Button
        disabled={buttonDisabled}
        onClick={submitPayment}
        variant='contained'
        size='large'
      >
        Pay
      </Button>
      <TextField
        id="amount field"
        disabled={textFieldDisabled}
        error={textErrorState}
        onChange={e => validateAmount(e)}
        label={labelValue}
        value={textFieldValue}
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
