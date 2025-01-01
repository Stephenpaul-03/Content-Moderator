const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
      try {
        const { type, data } = JSON.parse(message);
        
        if (type === 'MODERATE_CONTENT') {
          const { text, image } = data;
          
          const pythonScriptPath = path.resolve(__dirname, 'moderator.py');
          console.log('Executing Python script at:', pythonScriptPath);
          
          const pythonProcess = spawn('python3', [pythonScriptPath]);

          let outputData = '';
          let errorData = '';

          // Debug logging
          console.log('Sending to Python process:');
          console.log('Text length:', text ? text.length : 0);
          console.log('Image data length:', image ? image.length : 0);

          // Send data to Python process
          const inputData = JSON.stringify({
            text: text || '',
            image: image || ''
          }) + '\n';  // Add newline to ensure Python gets complete input
          
          pythonProcess.stdin.write(inputData, (error) => {
            if (error) {
              console.error('Error writing to Python process:', error);
              ws.send(JSON.stringify({
                type: 'ERROR',
                error: 'Failed to send data to moderation service'
              }));
              pythonProcess.kill();
              return;
            }
            pythonProcess.stdin.end();
          });

          pythonProcess.stdout.on('data', (data) => {
            console.log('Python stdout:', data.toString());
            outputData += data.toString();
          });

          pythonProcess.stderr.on('data', (data) => {
            console.log('Python stderr:', data.toString());
            errorData += data.toString();
          });

          pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            
            if (code !== 0) {
              ws.send(JSON.stringify({
                type: 'ERROR',
                error: `Moderation failed: ${errorData}`
              }));
              return;
            }

            try {
              const result = JSON.parse(outputData);
              ws.send(JSON.stringify({
                type: 'MODERATION_RESULT',
                data: result
              }));
            } catch (error) {
              console.error('Failed to parse Python output:', error);
              ws.send(JSON.stringify({
                type: 'ERROR',
                error: 'Failed to parse moderation results'
              }));
            }
          });

          pythonProcess.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            ws.send(JSON.stringify({
              type: 'ERROR',
              error: `Failed to start moderation service: ${error.message}`
            }));
          });
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'ERROR',
          error: error.message
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

module.exports = { setupWebSocketServer };
