import express from 'express';
import axios from 'axios';
import responseTime from 'response-time';
import redis from 'redis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();


const Character = mongoose.model(
'Characters',
    {
	id:{ type: Number }	
	,name:{ type: String }
	,status:{ type: String }
	,species:{ type: String }
	,type: { type: String }
	,gender:{ type: String }
	,origin: new mongoose.Schema({ name: { type: String }, url: { type: String } })
	,location: new mongoose.Schema({ name: { type: String }, url: { type: String } })		
	,image:{ type: String }
	,episode:[{ type: String }]
	,url:{ type: String }
	,created:{ type: String }
});


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
		const { data } = await axios.get(URL_BASE + `/${ id }`);
		const savedResult = await client.set(id, JSON.stringify(data));
		console.log(savedResult);
		return res.json(data);	
	} catch (error) {
		console.log(error);
	}
});

app.get('/charactersMongo', async (req, res) => {
	try {
		let result = [];
		const reply = await Character.find();
		if (reply.length > 0) return res.json(reply);
		const response = await axios.get(URL_BASE);
		let page = 2
		while (page < response.data.info.pages){
			const paginated = await axios.get(URL_BASE + `?page=${ page }`);
			result = response.data.results.concat(paginated.data.results);		
			page++;
		}
		await Character.insertMany(result);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
});

const main = async () => {
	await client.connect();
	const mongodb = `mongodb://${ process.env.MONGO_INITDB_ROOT_USERNAME }:${ process.env.MONGO_INITDB_ROOT_PASSWORD }@${ process.env.MONGO_HOST }:${ process.env.MONGO_PORT }/${ process.env.MONGO_DB }?retryWrites=true&w=majority`;
	console.log(mongodb)
	try {
		await mongoose.connect(mongodb, {
			useNewUrlParser: true,
			useUnifiedTopology: true 
		});
		console.log(">>>>>>>>> DB is connected! <<<<<<<<<");
	}
	catch(e) {
		console.log(`Error connecting to DB: ${ e }`);
	}
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