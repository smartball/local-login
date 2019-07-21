export const responseMessage = (status, data) => {
  let message = {}
  switch (status) {
    case 200:
      message = {
        statusCode: 200,
        message: 'successful',
        data
      }
      break
    case 400:
      message = {
        statusCode: 400,
        message: data.errorMessage
      }
      break
    case 401:
      message = {
        statusCode: 401,
        message: data.errorMessage
      }
      break
    case 404:
      message = {
        statusCode: 404,
        message: data.errorMessage
      }
      break
    case 500:
      message = {
        statusCode: 404,
        message: data.errorMessage
      }
      break
  }
  return message
}