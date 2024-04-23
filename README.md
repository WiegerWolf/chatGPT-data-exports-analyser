**chatGPT data exports analyser**
=====================

This script processes conversations from a JSON file and extracts user and bot tokens, along with various statistics and metrics.

**Usage**
--------

0. Order and download the data from chatGPT data export functionality.
1. Extract the export archive and place the `conversations.json` file in the same directory as this script.
2. Run the script using Node.js (v14+).

```bash
yarn install
yarn start
```

**Output**
---------

The script generates a `out/tokens.json` file containing the extracted user and bot tokens. It also logs various statistics and metrics to the console, including:

* Total tokens in each conversation
* Total user and bot tokens
* Average tokens per message
* Average user and bot tokens per message
* Earliest and latest conversation dates
* Conversations per month

**Dependencies**
--------------

* `js-tiktoken` for tokenization
