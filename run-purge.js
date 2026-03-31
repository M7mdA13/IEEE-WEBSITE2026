import { PurgeCSS } from 'purgecss';
import fs from 'fs';

async function runPurge() {
  const purgeCSSResults = await new PurgeCSS().purge({
    content: ['index.html', 'src/**/*.jsx'],
    css: ['src/index.css']
  });
  
  // Write the purged CSS back to the file
  fs.writeFileSync('src/index.css', purgeCSSResults[0].css);
  console.log('PurgeCSS finished. Original size: ' + fs.statSync('../src/basic-styles.css').size + ', New size: ' + fs.statSync('src/index.css').size);
}

runPurge();
