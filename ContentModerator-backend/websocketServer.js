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
          const { description, image } = data;
          
          const pythonScriptPath = path.resolve(__dirname, 'moderator.py');
          console.log('Executing Python script at:', pythonScriptPath);
          
          const pythonProcess = spawn('python3', [pythonScriptPath]);

          let outputData = '';
          let errorData = '';

          // Send data to Python process
          const inputData = JSON.stringify({
            text: description,
            image: image.path
          });
          
          pythonProcess.stdin.write(inputData);
          pythonProcess.stdin.end();

          pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
          });

          pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error('Python stderr:', data.toString());
          });

          pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            
            if (code !== 0) {
              try {
                const errorObj = JSON.parse(errorData);
                ws.send(JSON.stringify({
                  type: 'ERROR',
                  error: errorObj.error || 'Moderation failed'
                }));
              } catch (e) {
                ws.send(JSON.stringify({
                  type: 'ERROR',
                  error: `Moderation failed: ${errorData}`
                }));
              }
              return;
            }

            try {
              const result = JSON.parse(outputData);
              ws.send(JSON.stringify({
                type: 'MODERATION_RESULT',
                data: {
                  textTag: result.textTag,
                  imageTag: result.imageTag
                }
              }));
            } catch (error) {
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
