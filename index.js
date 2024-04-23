const conversations = require('./conversations.json');
const {encodingForModel} = require('js-tiktoken');
const fs = require('fs');
const path = require('path');

function saveJSON(data, filename) {
    mkdirp(path.dirname(filename));
    fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 2));
}
function mkdirp(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

function log(...args) {
    // log with timestamp and colors
    console.log('\x1b[36m%s\x1b[0m', new Date().toISOString(), ...args);
}
function error(...args) {
    // log with timestamp and colors
    console.error('\x1b[31m%s\x1b[0m', new Date().toISOString(), ...args);
}
function warn(...args) {
    // log with timestamp and colors
    console.warn('\x1b[33m%s\x1b[0m', new Date().toISOString(), ...args);
}
function info(...args) {
    // log with timestamp and colors
    console.info('\x1b[32m%s\x1b[0m', new Date().toISOString(), ...args);
}
function debug(...args) {
    // log with timestamp and colors only in debug mode
    if (process.env.DEBUG) {
        console.debug('\x1b[35m%s\x1b[0m', new Date().toISOString(), ...args);
    }
}

const USER_TOKENS = [];
const BOT_TOKENS = [];
const DATES = [];
for (const conversation of conversations) {
    const {default_model_slug, title, create_time} = conversation;
    const date = new Date(create_time*1000);
    log(`Conversation: ${title} (${date.toISOString()})`);
    DATES.push(date);
    let model_tokeniser;
    try {
        model_tokeniser = encodingForModel(default_model_slug||'gpt-4');
    } catch (err) {
        if (err.message === 'Unknown model') {
            error(`Unknown model: ${default_model_slug}`);
            continue;
        }
    }

    const MESSAGES = [];
    const MESSAGES_USER = [];
    const MESSAGES_BOT = [];
   for (const [uuid, entry] of Object.entries(conversation.mapping)) {
    const {message} = entry;
    if (!message) {
        continue;
    }
    const {author, content} = message;
        const {role} = author;
        const {content_type, parts} = content;
        if (content_type === 'text' && parts.length > 0) {
            const text = parts.join(' ');
            const {length:tokens} = model_tokeniser.encode(text);
            if (!tokens) {
                continue;
            }
            if (role === 'user') {
                USER_TOKENS.push(tokens);
                MESSAGES_USER.push(tokens);
            } else {
                BOT_TOKENS.push(tokens);
                MESSAGES_BOT.push(tokens);
            }
            MESSAGES.push(tokens);
        } 
   }
    log(`Messages: ${MESSAGES.length}`);
    // Total tokens in conversation
    log(`Total tokens: ${MESSAGES.reduce((a, b) => a + b, 0)}`);
    log(`Total user tokens: ${MESSAGES_USER.reduce((a, b) => a + b, 0)}`);
    log(`Total bot tokens: ${MESSAGES_BOT.reduce((a, b) => a + b, 0)}`);
    // Same for user and bot
    log(`User messages: ${MESSAGES_USER.length}`);
    log(`Bot messages: ${MESSAGES_BOT.length}`);
    // Average tokens per message
    log(`Average tokens per message: ${average(MESSAGES)}`);
    log(`Average user tokens per message: ${average(MESSAGES_USER)}`);
    log(`Average bot tokens per message: ${average(MESSAGES_BOT)}`);
}

function average(tokens) {
    return tokens.reduce((a, b) => a + b, 0) / tokens.length;
}

log(`Average user tokens: ${average(USER_TOKENS)}`);
log(`Average bot tokens: ${average(BOT_TOKENS)}`);

debug(JSON.stringify({
    USER_TOKENS,
    BOT_TOKENS
}));
saveJSON({
    USER_TOKENS,
    BOT_TOKENS
}, 'out/tokens.json');
info(`Saved tokens.json`);

log(`Earliest conversation: ${new Date(Math.min(...DATES)).toISOString()}`);
log(`Latest conversation: ${new Date(Math.max(...DATES)).toISOString()}`);

// Conversations per month
const months = {};
for (const date of DATES) {
    const month = date.toISOString().substring(0, 7);
    if (!months[month]) {
        months[month] = 0;
    }
    months[month]++;
}
log('Conversations per month', JSON.stringify(months));
