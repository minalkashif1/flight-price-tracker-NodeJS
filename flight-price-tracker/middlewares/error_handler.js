const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate key error',
      details: `Field ${Object.keys(err.keyValue).join(', ')} already exists`
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;