const fs = require('fs');
const path = require('path');
const https = require('https');

const SOUNDS_DIR = path.resolve(process.cwd(), 'assets/sounds');
const SOUNDS = {
  'complete.mp3': 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  'notification.wav': 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.wav',
  'click.mp3': 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  'water.mp3': 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  'break.mp3': 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  'success.mp3': 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
};

// Create sounds directory if it doesn't exist
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

// Download a file
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(SOUNDS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all sound files
async function downloadAllSounds() {
  console.log('Downloading sound files...');
  
  for (const [filename, url] of Object.entries(SOUNDS)) {
    try {
      await downloadFile(url, filename);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error);
    }
  }
  
  console.log('Sound files setup complete!');
}

// Run the script
downloadAllSounds().catch(console.error); 