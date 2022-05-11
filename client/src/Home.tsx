import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, } from 'react-router-dom'
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { invoiceArrayType, } from '../types'
import "./App.css";

const ListItemLink = (props: {primary: string, to: string}) => {
  const { primary, to, } = props

  const CustomLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement>((linkProps: any, ref: any) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
      [to,]
  )

  return (
    <ListItemButton
      component={CustomLink}
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        maxWidth: 500,
      }}
    >
      <ListItemText primary={primary} />
    </ListItemButton>
  )
}

const Home = () => {
  const [invoices, setData] = useState([]);
  useEffect(() => {
    fetch("/invoices/list")
      .then((res) => res.json())
      .then((data) => setData(data.data));
  }, []);

  const checkForContent = (content: any) => {
    return !(content && Object.keys(content).length === 0 && Object.getPrototypeOf(content) === Object.prototype)
  }
  
  const invoicesListBoxes = (invoices: invoiceArrayType) => invoices.map(({invoice_number, title, amount}) => {
    return (
      <List>
        <ListItem
          button key={invoice_number}
        >
          <ListItemLink primary={`Pay Invoice ${invoice_number} ${title} $${amount}?`} to={`/pay_invoice/${invoice_number}`} />
        </ListItem>
      </List>
    )  
  });

  return (
    <Container className="Home">
      <header className="Home-header">
        <Typography>
          User Alpha
        </Typography>
        {checkForContent(invoices) ? invoicesListBoxes(invoices) : <p>"Loading..."</p>}
      </header>
    </Container>
  );
}

export default Home;
