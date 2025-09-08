import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

if (!openai.apiKey) {
  throw new Error("API_KEY is not defined")
}

export default openai; 