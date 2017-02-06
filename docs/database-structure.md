# Database Structure

## Records

Example of a record object in the database:

```javascript
{
  category: <String>, // 'income' or 'expense'
  date: <Date>, // use Date.parse on the csv input to get date object
  payee: <String>, // all in capitals - just as it is on the Kiwibank statement
  amount: <Number>, // in dollars
  raw: <String>, // full transaction string from the csv
}
```

## 