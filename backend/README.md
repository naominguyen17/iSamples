# Backend notes

Uses MySQL database. We put on a bypass at iSamplesBackend 
for all ips. Later on, we will revoke iSamplesBackend only for 
SELECT on some specific tables.

## MySQL config

- Public IP: fel.ddns.net

- Port: 3306/33060

- Username: iSamplesBackend

- Password: BdZZDw2F5fF4TepYdP1V

## NooB guide on MySQL:

To run a MySQL script (like plantSamples.sql):

Connect to MySQL network (requires MySQL client)

```
mysql -h fel.ddns.net -u iSamplesBackend -pBdZZDw2F5fF4TepYdP1V </path/to/plantSamples.sql
# enter password: BdZZDw2F5fF4TepYdP1V
```

Windows:
```
cat /path/to/plantSamples.sql | mysql -h fel.ddns.net -u iSamplesBackend -pBdZZDw2F5fF4TepYdP1V
```

Note that the tables should be set up already, so no need to set it up back again

# How to run the node.js backend

Make sure node.js is installed, then execute command:

```
node app.js
```

# Backend interface:

Express takes care of the path passed in to the domain.

## Site provider:

The null path will send index.html

To patch relative path in the index.html,
sending GET request to /<file> where files
are html, css, or js will directly send back
those files

## Data provider:

GET url/data/<viewname>

This returns JSON table from MySQL. There are two 
supported views:

1. list: Returns the columns: PlantName, <Part>_<Characteristic>, Value

Where: Part is part of the plant (leaf, stem,...);
Char is the characteristic (color,shape,...)

2. hierarchy: Returns the JSON in this format:

```
{
  AllPlants {
  	<Plant1>: {
  	  <Part1>: {
  	    <Char1>: Value
  	  },
  	  <Part2>: {
  	  	<Char1>: Value,
  	  	<Char2>: Value
  	  }
  	},
  	<Plant2>: {
  	...
  	}
  }
}
```