exports.handler = async (event) => {
  console.log('This is a get method', event)
  return {
    statusCode: 200,
    body: 'HELLLOOOO',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
