
const globalError = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode||500).json({ message: `error`, err: err.message});
};

export default globalError
