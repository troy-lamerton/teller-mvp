# Data Filtering Tool

A web user interface for filtering a JSON array.
Give the app your JSON and array and start selecting what to keep and what to delete

### Installation

```git clone <url>```
```npm install```
```npm install -g nodemon``` 

### Notes

Seperation of concerns:

Server ensures data is in a consistent format at all times. From initial fetching of data to giving
the data to template for rendering.

Templates just displays data, they are "dumb". --until further notice

#### BUG
Have to restart server to see changes in browser reflecting changes in raw.json file
see hacky solution in views/renderPage.js