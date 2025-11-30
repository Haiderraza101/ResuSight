#!/usr/bin/env node

/**
 * API Integration Test Script
 * Tests the complete flow: Upload → Predict → Display
 * 
 * Usage: node test-api.js <resume-file>
 * Example: node test-api.js sample.pdf
 */

const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5001';

async function testHealthCheck() {
  console.log('\n=== TEST 1: Health Check ===');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend is healthy');
    console.log('Response:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('Make sure Flask API is running on port 5001');
    console.error('Run: cd backend && python run.py');
    return false;
  }
}

async function testCategories() {
  console.log('\n=== TEST 2: Get Categories ===');
  try {
    const response = await fetch(`${API_URL}/api/resume/categories`);
    const data = await response.json();
    if (data.success && data.categories) {
      console.log(`✅ Retrieved ${data.categories.length} categories`);
      console.log('Sample categories:', data.categories.slice(0, 3));
      return true;
    } else {
      console.error('❌ Invalid response format');
      return false;
    }
  } catch (error) {
    console.error('❌ Categories request failed:', error.message);
    return false;
  }
}

async function testUploadResume(resumeFile) {
  console.log('\n=== TEST 3: Upload Resume ===');
  
  if (!resumeFile) {
    console.error('❌ No resume file provided');
    console.error('Usage: node test-api.js <resume-file>');
    return false;
  }

  if (!fs.existsSync(resumeFile)) {
    console.error(`❌ File not found: ${resumeFile}`);
    return false;
  }

  try {
    const fileBuffer = fs.readFileSync(resumeFile);
    const filename = path.basename(resumeFile);
    
    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob, filename);

    console.log(`Uploading: ${filename} (${fileBuffer.length} bytes)`);

    const response = await fetch(`${API_URL}/api/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Upload failed:', data.error);
      return false;
    }

    if (!data.success) {
      console.error('❌ Response not successful');
      return false;
    }

    if (!data.predictions) {
      console.error('❌ No predictions in response');
      return false;
    }

    console.log('✅ Upload successful');
    console.log(`Extracted text length: ${data.extractedTextLength} characters`);
    
    // Check predictions structure
    const modelNames = Object.keys(data.predictions);
    console.log(`\n✅ Predictions from ${modelNames.length} models:`);
    
    const expectedModels = [
      'Logistic Regression',
      'Linear SVM',
      'Random Forest',
      'BiLSTM+Attention',
      'BiLSTM+CNN',
      'BiLSTM+CNN+Attention',
      'DistilBERT Transformer'
    ];

    let allModelsPresent = true;
    expectedModels.forEach((model) => {
      if (data.predictions[model]) {
        const pred = data.predictions[model];
        const confidence = (pred.confidence * 100).toFixed(1);
        console.log(`  ✅ ${model}: ${pred.category} (${confidence}%)`);
      } else {
        console.log(`  ⚠️  ${model}: MISSING`);
        allModelsPresent = false;
      }
    });

    if (!allModelsPresent) {
      console.warn('\n⚠️  Not all 7 models returned predictions');
    }

    // Check response structure
    const firstModel = data.predictions[modelNames[0]];
    if (firstModel) {
      console.log('\n✅ Prediction structure:');
      console.log(`  - prediction (ID): ${firstModel.prediction}`);
      console.log(`  - category: ${firstModel.category}`);
      console.log(`  - confidence: ${firstModel.confidence}`);
      console.log(`  - top5 count: ${firstModel.top5 ? firstModel.top5.length : 0}`);
    }

    console.log('\n✅ All tests passed! API integration is working.');
    return true;

  } catch (error) {
    console.error('❌ Upload request failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  const resumeFile = process.argv[2];
  
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       ResuSight API Integration Test Suite                 ║');
  console.log('║                                                            ║');
  console.log(`║       API: ${API_URL.padEnd(47, ' ')}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Cannot proceed: Backend is not running');
    process.exit(1);
  }

  const categoriesOk = await testCategories();
  if (!categoriesOk) {
    console.log('\n⚠️  Categories test failed, but continuing...');
  }

  if (resumeFile) {
    const uploadOk = await testUploadResume(resumeFile);
    if (uploadOk) {
      console.log('\n🎉 Integration test successful!');
    } else {
      console.log('\n❌ Integration test failed');
      process.exit(1);
    }
  } else {
    console.log('\nℹ️  Skipped upload test (provide resume file as argument)');
  }
}

// Handle FormData for Node.js (use node-fetch v3 or builtin fetch in Node 18+)
if (!globalThis.FormData) {
  try {
    const FormDataNode = require('form-data');
    globalThis.FormData = FormDataNode;
  } catch (e) {
    console.error('⚠️  FormData not available. Make sure you\'re using Node.js 18+ or have form-data installed');
  }
}

runAllTests().catch(console.error);
