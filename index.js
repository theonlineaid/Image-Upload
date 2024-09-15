import quickfix from 'node-quickfix';

// Define the event handler for FIX messages
const initiator = new quickfix.initiator({
  settings: 'fix-config.cfg', // Path to the config file
  onCreate: (sessionID) => {
    console.log('FIX session created:', sessionID);
  },
  onLogon: (sessionID) => {
    console.log('Logon successful:', sessionID);
  },
  onLogout: (sessionID) => {
    console.log('Logout from session:', sessionID);
  },
  onMessage: (message, sessionID) => {
    console.log('Received message:', message);
  },
  onError: (message, sessionID) => {
    console.log('Error:', message);
  }
});

// Start the initiator (this will attempt to connect to the FIX server)
initiator.start();
