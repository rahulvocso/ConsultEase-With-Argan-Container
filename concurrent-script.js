const concurrently = require('concurrently');
const waitOn = require('wait-on');

const commands = [
  { command: 'adb reverse tcp:8081 tcp:8081', name: 'cmd1' },
  { command: 'echo `Metro Bundler will now connect to Android Studio automatically', name: 'cmd2' },
  { command: 'react-native start', name: 'cmd3' },
];
  
const finalCommand = 'final-command';

async function runCommands() {
  // Run all commands concurrently
  await concurrently(commands, { prefix: 'name' });

  // Wait for all commands to finish
  const waitOnResources = commands.map((cmd) => ({
    resources: [`exec:\${cmd.name}`],
  }));

  await waitOn({ resources: waitOnResources });

  // Run the final command after all other commands have finished
  console.log('All commands have finished, running final command...');
  await concurrently([{ command: finalCommand, name: 'final' }], { prefix: 'name' });
}

runCommands().catch((error) => {
  console.error('Error running commands:', error);
});