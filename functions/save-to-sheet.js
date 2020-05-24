const {
  GOOGLE_PROJECT_ID, GOOGLE_PRIVATE_KEY_ID, GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL, GOOGLE_CLIENT_X509_CERT_URL, GOOGLE_CLIENT_ID
} = process.env

const { GoogleSpreadsheet } = require('google-spreadsheet')

const GOOGLE_AUTH = {
  type: 'service_account',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  project_id: GOOGLE_PROJECT_ID,
  private_key_id: GOOGLE_PRIVATE_KEY_ID,
  private_key: JSON.parse(GOOGLE_PRIVATE_KEY),
  client_email: GOOGLE_CLIENT_EMAIL,
  client_x509_cert_url: GOOGLE_CLIENT_X509_CERT_URL,
  client_id: GOOGLE_CLIENT_ID
}

exports.handler = async (event) => {
  try {
    const { rowData, sheetName, sheetId } = JSON.parse(event.body)

    const doc = new GoogleSpreadsheet(sheetId)
    await doc.useServiceAccountAuth(GOOGLE_AUTH)
    
    await doc.loadInfo()

    let sheet = doc.sheetsByIndex[0]
    if (sheetName) {
      sheet = doc.sheetsByIndex.find(sheet => {
        return sheet.title === sheetName
      })
    }
    
    await sheet.addRow({
      ...rowData,
      created_at: new Date()
    })
  } catch (error) {
    console.error('SOMETHING IS WRONG!')
    console.error(error)

    return {
      statusCode: 400,
      body: JSON.stringify({
        errorMessage: error
      }),
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }

  return {
    statusCode: 200,
    body: event.body,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    }
  }
}
