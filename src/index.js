const express = require('express');
const axios = require('axios');
const responseTime = require('response-time');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = redis.createClient({ url: `redis://${ process.env.REDIS_HOST }:${ process.env.REDIS_PORT }` });

const URL_BASE = "https://rickandmortyapi.com/api/character";
const PORT = process.env.PORT;
const app = express();
app.use(responseTime());

app.get('/characters', async (req, res) => {
	try {
		let result = [];
		const reply = await client.get('characters');
		if (reply) return res.json(JSON.parse(reply));
		const response = await axios.get(URL_BASE);
		let page = 2
		while (page < response.data.info.pages){
			const paginated = await axios.get(URL_BASE + `?page=${ page }`);
			result = response.data.results.concat(paginated.data.results);		
			page++;
		}
		await client.set('characters', JSON.stringify(result));
		res.json(result);
	} catch (error) {
		console.log(error);
	}
});

app.get('/characters/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const reply = await client.get(id);
		if (reply) return res.json(JSON.parse(reply));
		// const reply = findId(id);
		// if (reply) return res.json(reply);
		const { data } = await axios.get(URL_BASE + `/${ id }`);
		const savedResult = await client.set(id, JSON.stringify(data));
		console.log(savedResult);
		return res.json(data);	
	} catch (error) {
		console.log(error);
	}
});

const main = async () => {
	await client.connect();
	app.listen(PORT);
	console.log(`Server running on port ${ PORT }`);
}

const findId = async (id) => {
  try {
    const reply = await client.get('characters');
	console.log(id)
    const parsedData = JSON.parse(reply);
    return parsedData.filter(item => item.id === id);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    return [];
  }
};

main();