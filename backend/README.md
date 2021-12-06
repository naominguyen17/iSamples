# Backend notes

Uses MySQL database. We put on a bypass at iSamplesBackend for all ips. Later on, we will revoke iSamplesBackend only for SELECT on some specific tables.

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

Make sure node.js is installed.

```
node app.js
```

# Backend interface:

Connecting to this with p