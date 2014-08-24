/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var expression, options, tinyInstance,
          updateView = function () {
            ngModel.$setViewValue(elm.val());
            if (!scope.$$phase) {
              scope.$apply();
            }
          };
        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }

        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }
        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function (ed) {
            var args;
            ed.on('init', function(args) {
              ngModel.$render();
            });
            // Update model on button click
            ed.on('ExecCommand', function (e) {
              ed.save();
              updateView();
            });
            // Update model on keypress
            ed.on('KeyUp', function (e) {
              ed.save();
              updateView();
            });
            // Update model on change, i.e. copy/pasted text, plugins altering content
            ed.on('SetContent', function (e) {
              if(!e.initial){
                ed.save();
                updateView();
              }
            });
            if (expression.setup) {
              scope.$eval(expression.setup);
              delete expression.setup;
            }
          },
          mode: 'exact',
	    plugins: 'link spellchecker fullscreen',
 	    menubar : false,
	    statusbar: false,
	    toolbar1: 'bold italic underline link unlink fullscreen',
          elements: attrs.id
        };
        // extend options with initial uiTinymceConfig and options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression);

        setTimeout(function () {

            tinymce.init(options);

	    // Moved the following inside here in sync with the
	    // tinymce.init This fixes a bug we were facing. Keep an
	    // eye on new releases of ui-tinymce and eventually report
	    // this. This issue is almost certainly related to
	    // https://github.com/angular-ui/ui-tinymce/issues/23 but
	    // their suggested fix was causing other issues for us.
            ngModel.$render = function() {
		if (!tinyInstance) {
		    //console.log("tinymce: ", tinymce);
		    //console.log("attrs.id: ", attrs.id);
		    //console.log("Making a new instance");
		    tinyInstance = tinymce.get(attrs.id);
		}
		if (tinyInstance) {
		    //console.log("setting context");
		    //console.log("tinymceInstance: ", tinyInstance);
		    //console.log("ngModel.$viewValue: ", ngModel.$viewValue);
		    tinyInstance.setContent(ngModel.$viewValue || '');
		}
            };

        });


      }
    };
  }]);
