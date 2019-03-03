const axios = require('axios');


class Worker{
    constructor(){
        this.interval = 1000;
        this.data = {};
        this.url = 'https://blockchain.info/en/ticker';
    }

    getData() {
        return this.data;
    }

    async working(){
        try {
            let response = await axios.get(this.url);
            this.data = response.data;
            setTimeout(() => {
                this.working();
            }, this.interval);
        }
        catch (e) {
            console.error(e);
        }
    }
}

module.exports = Worker;