const formattedResponse = (status: 'success' | 'fail', message?: string, data?: any) => {
  const defaultMessage = status === 'success' ? 'Operation successful' : 'Operation failed';
  return {
    success: status === 'success',
    message: message || defaultMessage,
    data: status === 'success' ? data : null
  };
};

export default formattedResponse;
