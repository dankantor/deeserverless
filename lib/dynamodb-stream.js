class DynamoDBStream {
  
    /**
     * @constructs
     * @description Create a new DynamoDBStream object. This will call the Record eventName as an instance method
     *  (eg { eventName: 'INSERT' } -> [FILE SYSTEM]/streams/table-name insert(..)) for each event record
     *  and set Request -> this.req and Response -> this.res. After all events have been processed return
     *  success. If any record handler rejects, the error is logged and the invocation is
     *  rejected so Lambda retries the batch.
     * @param {Request} request - The Request object passed to your Class
     * @param {Response} response - The Response object passed to your Class 
     */
    constructor(req, res) {
      this.req = req;
      this.res = res;

      let handlers = [];

      for (const record of this.req.event.Records) {
        const method = record.eventName.toLowerCase();
        if (this[method]) {
          handlers.push(this[method](record));
        }
      }

      Promise.all(handlers)
        .then((results) => {
          res.resolve(results);
        })
        .catch((error) => {
          console.error(error);
          res.reject(error);
        });
    }

    async insert(record) {}
    async modify(record) {}
    async remove(record) {}
    
  }
  
  export {DynamoDBStream};