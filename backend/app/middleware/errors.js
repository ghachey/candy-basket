// Should I use the following middleware? TODO - Experiment to see benefits

var apiErrors;

if(app.get('env') === 'development'){
  apiErrors = function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  };
} else {
  apiErrors = function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  };
}

exports.apiErrors = apiErrors;
