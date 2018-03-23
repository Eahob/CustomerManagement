# Customer Management

## What is this?  
A three week final project for Skylab bootcamp.

A personalized customer managemnet for a hair salon.

## Data Model
I will use mongodb as database.

It will have four collections:
* Customers
* Services
* Transactions
* Attendants

### Customers
``` json
[
    {
        "idCustomer":"00000000-0000-0000-0000-000000000000",
        "name":"Jane",
        "surname":"Roe",
        "phone":[
            555-555 555,
            555-555 333
        ],
        "services":[
            {
                "idTransaction":"00000000-0000-0000-0000-000000000001"
            },
            {
                "idTransaction":"00000000-0000-0000-0000-000000000002",
            }
        ],
        "observations":"some observation"
    }
]
```
### Services
``` json
[
    {
        "name":"Nails",
        "price":"2.55"
    },
    {
        "name":"Hair cut",
        "price":"5.75"
    }
]
```
### Transactions
``` json
[
    {
        "idTransaction":"00000000-0000-0000-0000-000000000002",
        "time":"1520790318369",
        "idCustomer":"00000000-0000-0000-0000-000000000000",
        "services": [
            {
                "idAttendant":"00000000-0000-0000-0000-000000000004",
                "serviceName":"Nails",
                "price":"2.55",
            },
            {
                "idAttendant":"00000000-0000-0000-0000-000000000005",
                "serviceName":"Hair cut",
                "price":"5.75",
            }
        ],
        "total":"8.30"
    }
]
```
### Attendants
``` json
[
    {
        "idAttendant":"00000000-0000-0000-0000-000000000004",
        "name":"Jhon doe"
    },
    {
        "idAttendant":"00000000-0000-0000-0000-000000000005",
        "name":"Oedn Ohj"
    }
]
```

## Functions

Each collection will have this functions:

* Add
* Show All
* Search by query
* Modify
* Delete

And more functions for accounting:

* Show daily
* Show weekly

[Trello](https://trello.com/b/Pexusfgm/customermanagement)
[Demo](http://eahob-cm.surge.sh)
