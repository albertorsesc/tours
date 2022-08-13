// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (request, response, next) => {
    fn(request, response, next).catch(next);
  };
};