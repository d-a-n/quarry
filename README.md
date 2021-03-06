quarry
====================

## About

### Description
A rock solid, dynamic DNS server with swappable backends and RESTful API. Start Quarry with one of the available persistence layers and manage records and forwarders through a RESTful API. Future plans include an easy to use web interface and more persistence layers.

### Author
* Norman Joyner - norman.joyner@gmail.com

## Getting Started

### Installing
Run ```npm install -g quarry-dns``` to install Quarry, and put it in your PATH.

## Features

### Statsd Integration
Setting ```--statsd-host``` will enable Quarry statsd integration. Ship metrics such as:
* # errors
* # forwarder timeouts
* # records
* # forwarders
* Reconciliation duration
* HTTP Response Codes

### Various Persistence Layers
* Disk
* Redis
* MongoDB
* S3

### RESTful API
Manage records and forwarders through a simple API.

## Usage & Examples
```quarry --help``` can be used for a comprehensive list of available commands and options. Quarry must be start as root, otherwise it cannot listen on a priviliged port. Below are some usage examples:

### Options
    -v, --version                         Print version and exit
    --reconciliation-interval INTERVAL    Interval on which to update DNS records  [60000]
    -i INTERFACE, --interface INTERFACE   Interface to listen on for DNS queries  [0.0.0.0]
    -p PORT, --port PORT                  Port to listen on for DNS queries  [53]
    --api-interface INTERFACE             Interface to listen on for API requests  [0.0.0.0]
    --api-port PORT                       Port to listen on for API requests  [5353]
    --statsd-host HOST                    Address of statsd server
    --statsd-port PORT                    Port statsd server listens on  [8125]
    -l LEVEL, --log-level LEVEL           Log level  [info]
    -b BLACKLIST, --blacklist BLACKLIST   Comma seperated list of TLDs/hostnames you don't want clients to set. e.g. --blacklist=.com,.example.org  []
    -w WHITELIST, --whitelist WHITELIST   Comma seperated list of TLDs/hostnames you want your service be limited to e.g. --whitelist=.dev,.development.corp  []
    --config-path PATH                    Path to Quarry configuration file

### Disk
```sudo quarry disk --config-path /path/to/quarry/config.json```

### Redis
```sudo quarry redis --redis-host quarry.abcdef.0001.use1.cache.amazonaws.com```

### MongoDB
```sudo quarry mongo --mongo-host ds028017.mongolab.com```

### S3
```sudo quarry s3 --access-key-id ACCESSKEYID --secret-access-key SECRETACCESSKEY --bucket quarry```

### RESTful API

#### Get Records
```curl http://quarry.server:5353/v1/records -X GET -H "Content-Type: application/json"```

#### Get Record
```curl http://quarry.server:5353/v1/records/www.domain.com -X GET -H "Content-Type: application/json"```

#### Create Record
```curl http://quarry.server:5353/v1/records/www.domain.com -X POST -d '{"address": "1.2.3.4", "type": "A", "ttl": 60}' -H "Content-Type: application/json"```

#### Update Record
```curl http://quarry.server:5353/v1/records/www.domain.com -X PUT -d '{"address": ["1.2.3.4", "5.6.7.8"], "type": "A", "ttl": 60}' -H "Content-Type: application/json"```

#### Delete Record
```curl http://quarry.server:5353/v1/records/www.domain.com -X DELETE```

#### Get Forwarders
```curl http://quarry.server:5353/v1/forwarders -X GET -H "Content-Type: application/json"```

#### Get Forwarder
```curl http://quarry.server:5353/v1/forwarders/8.8.8.8 -X GET -H "Content-Type: application/json"```

#### Create Forwarder
```curl http://quarry.server:5353/v1/forwarders/8.8.8.8 -X POST -d '{"timeout": 500, "port": 53}' -H "Content-Type: application/json"```

#### Update Forwarder
```curl http://quarry.server:5353/v1/forwarders/8.8.8.8 -X PUT -d '{"timeout": 1000, "port": 53}' -H "Content-Type: application/json"```

#### Delete Forwarder
```curl http://quarry.server:5353/v1/forwarders/8.8.8.8 -X DELETE```

## Contributing
Please feel free to contribute by opening issues and creating pull requests!
