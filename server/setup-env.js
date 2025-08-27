#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 TruthShield API Keys Setup\n');

const questions = [
  {
    key: 'NEWS_API_KEY',
    question: 'Enter your NewsAPI key (get it from https://newsapi.org/): ',
    required: true
  },
  {
    key: 'GOOGLE_SEARCH_API_KEY',
    question: 'Enter your Google Custom Search API key: ',
    required: true
  },
  {
    key: 'GOOGLE_SEARCH_ENGINE_ID',
    question: 'Enter your Google Custom Search Engine ID: ',
    required: true
  }
];

const envVars = {
  PORT: '3001',
  NODE_ENV: 'development',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  CACHE_TTL_SECONDS: '3600'
};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnvironment() {
  console.log('📝 Please provide your API keys:\n');

  for (const q of questions) {
    let answer = '';
    while (!answer && q.required) {
      answer = await askQuestion(q.question);
      if (!answer && q.required) {
        console.log('❌ This field is required. Please try again.\n');
      }
    }
    if (answer) {
      envVars[q.key] = answer;
    }
  }

  // Generate .env content
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Write to .env file
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Environment variables configured successfully!');
  console.log(`📁 Created: ${envPath}`);
  console.log('\n🚀 Your TruthShield backend is now ready with real API keys!');
  console.log('\nNext steps:');
  console.log('1. Restart your backend server: node server.js');
  console.log('2. Test the verification endpoint with real data');
  
  rl.close();
}

setupEnvironment().catch(console.error);
