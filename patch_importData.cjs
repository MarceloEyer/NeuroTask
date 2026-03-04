const fs = require('fs');

const file = 'src/hooks/useTasks.ts';
let code = fs.readFileSync(file, 'utf8');

const originalImportData = `  const importData = (jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        setTasks(imported);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };`;

const newImportData = `  const importData = (jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        const validTasks = imported.filter(isValidTask);
        setTasks(validTasks);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };`;

code = code.replace(originalImportData, newImportData);

fs.writeFileSync(file, code);
