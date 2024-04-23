**chatGPT data exports analyser**
=====================

This script processes conversations from a JSON file and extracts user and bot tokens, along with various statistics and metrics.

## Why this exists?

When I was building my [comparison table for LLM inference cost](https://docs.google.com/spreadsheets/d/1-2MgrKZLQuY11QN0HEHWfU3lH0ReUa9d5hgwqeGtNvc/edit?usp=sharing), I needed a way to ballpark my monthly usage of LLMs to estimate roughly costs. 
I decided to just dump all my chatGPT data and use my past conversations with it as a measure of my LLM usage. Hence this script was born.

![image](https://github.com/WiegerWolf/chatGPT-data-exports-analyser/assets/124579865/c909bc8e-1bd2-40d0-a050-c2c754d508fe)


**Features**
---------

The script generates a `out/tokens.json` file containing the extracted user and bot tokens. It also logs various statistics and metrics to the console, including:

* Total tokens in each conversation
* Total user and bot tokens
* Average tokens per message
* Average user and bot tokens per message
* Earliest and latest conversation dates
* Conversations per month


**Usage**
--------

0. Order and download the data from chatGPT data export functionality.
1. Extract the export archive and place the `conversations.json` file in the same directory as this script.
2. Run the script using Node.js (v14+).

```bash
yarn install
yarn start
```

**Dependencies**
--------------

* `js-tiktoken` for tokenization
