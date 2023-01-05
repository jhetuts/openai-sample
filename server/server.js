import express from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
})

const openAi = new OpenAIApi(config)
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res) => {
    res.status(200).send({
        message: "Active!"
    })
})

app.get('/ping', async(req, res) => {
    res.status(200).send({
        message: "Active!"
    })
})

app.post('/', async(req, res) => {
    try {
        const { prompt } = req.body
        const response = await openAi.createCompletion({
            model: "text-davinci-003",
            temperature: 0,
            prompt: `${prompt}`,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
       console.error(error) 
       res.status(error.code || 500).send(error)
    }
})


app.listen(5000, () => console.log("Server is running on port http://localhost:5000"))