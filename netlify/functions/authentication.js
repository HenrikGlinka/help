import jwt from 'jsonwebtoken';

// Auth middleware using arrow functions and modern JS features
const authenticationMiddleware = (request, response, next) => {
  // Get token from header using optional chaining and nullish coalescing
  const authHeader = request.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  // Check if token exists
  if (!token) {
    return response.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    // Verify token
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request using object destructuring and property shorthand
    request.user = user;

    next();
  } catch (error) {
    // Use template literals for error messages
    const message = error.name === 'TokenExpiredError'
      ? `Token expired at ${error.expiredAt}`
      : 'Invalid token';

    response.status(401).json({ error: message });
  }
};

export default authenticationMiddleware;