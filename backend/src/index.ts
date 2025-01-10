import app from './app';
import './api/v1/handlers/error/uncaughtErrorHandler';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
