# decomposed-main-thread

### Benchmarking

 #### Hello World
 autocannon -c 100 -d 5 -p 10 localhost:3000/

 #### Cpu task
 autocannon -c 100 -d 5 -p 10 localhost:3000/cpu
 
 #### Logging
 autocannon -c 100 -d 5 -p 10  http://localhost:3000/log\?count\=1
 autocannon -c 100 -d 5 -p 10  http://localhost:3000/log\?count\=1000
 
 #### Async Crypto and FS IO tasks
 autocannon -c 10 -d 5 -p 10  http://localhost:3000/async\?crypto\=0\&fs=2
 autocannon -c 10 -d 5 -p 10  http://localhost:3000/async\?crypto\=2\&fs=1
 autocannon -c 10 -d 5 -p 10  http://localhost:3000/async\?crypto\=2\&fs=0
 
 
 ### Start server 
 npm run server:case1
 (Elasticsearch has to be run separatly)
 
 ### Start cluster 
 npm run cluster:ca1se1
 (Elasticsearch has to be run separatly)
 
 ### Start case with parallel start of Elasticsearch server
 npm run start:case1
