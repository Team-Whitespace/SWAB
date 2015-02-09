module.exports = {

  client: {
    connectionString: 'hostname:port',
    clientId: 'kafka-node-client',
    zkOptions: {
      sessionTimeout: 30000,
      spinDelay: 1000,
      retries: 10
    }
  },

  matchConsumer: {
    payloads: [
      {
        topic: 'matches'
      }
    ],
    options: {
      groupId: 'match-group'
    }
  },

  alertProducer: {
    topic: 'alerts'
  }

}
