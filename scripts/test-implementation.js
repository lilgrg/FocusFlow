const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Test categories
const tests = {
  unit: {
    command: 'npm test',
    description: 'Running unit tests...',
  },
  lint: {
    command: 'npm run lint',
    description: 'Running linting...',
  },
  type: {
    command: 'npm run type-check',
    description: 'Running type checking...',
  },
  build: {
    command: 'npm run build',
    description: 'Building the app...',
  },
};

// Check if sound files exist
function checkSoundFiles() {
  const soundsDir = path.join(__dirname, '../assets/sounds');
  const requiredSounds = [
    'complete.mp3',
    'notification.wav',
    'click.mp3',
    'water.mp3',
    'break.mp3',
    'success.mp3',
  ];

  console.log('\nChecking sound files...');
  
  if (!fs.existsSync(soundsDir)) {
    console.error(`${colors.red}Sounds directory not found!${colors.reset}`);
    return false;
  }

  const missingSounds = requiredSounds.filter(
    sound => !fs.existsSync(path.join(soundsDir, sound))
  );

  if (missingSounds.length > 0) {
    console.error(`${colors.red}Missing sound files:${colors.reset}`);
    missingSounds.forEach(sound => console.error(`- ${sound}`));
    return false;
  }

  console.log(`${colors.green}All sound files are present!${colors.reset}`);
  return true;
}

// Run a test
function runTest(name, test) {
  console.log(`\n${colors.blue}${test.description}${colors.reset}`);
  
  try {
    execSync(test.command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ ${name} passed!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ ${name} failed!${colors.reset}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.blue}Starting implementation tests...${colors.reset}\n`);

  // Check sound files first
  const soundsOk = checkSoundFiles();
  if (!soundsOk) {
    console.log(`\n${colors.yellow}Please run 'node scripts/setup-sounds.js' to download missing sound files.${colors.reset}`);
  }

  // Run all tests
  const results = {};
  for (const [name, test] of Object.entries(tests)) {
    results[name] = runTest(name, test);
  }

  // Print summary
  console.log('\nTest Summary:');
  console.log('-------------');
  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`${status} ${name}`);
  });

  // Exit with appropriate code
  const allPassed = Object.values(results).every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Error running tests:${colors.reset}`, error);
  process.exit(1);
}); 