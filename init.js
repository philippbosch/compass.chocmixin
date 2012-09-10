var fs = require('fs'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec;

Hooks.addKeyboardShortcut('cmd-s', function() {
    var doc = Document.current();
    
    /* Only work on SCSS files */
    if (doc.rootScope() == 'scss.source') {
        
        /* Find a config.rb in the current or parent directories to 
           determine the compass project base directory */
        var parts = doc.path().split('/').slice(1,-1);
        while (parts.length) {
            var path = '/' + parts.join('/');
            if (fs.existsSync(path + '/config.rb')) {
                
                /* Find the compass binary */
                exec('which compass', function(error, stdout, stderr) {
                    if (error !== null) {
                        Alert.show('Sorry, could not find compass binary in ' + process.env.PATH + ' :(');
                        return;
                    }
                    
                    /* Run 'compass compile' in the compass project base directory */
                    var pathToCompass = stdout.trim(),
                        compass = spawn(pathToCompass, ['compile'], {'cwd': path}),
                        output = '';
                    
                    /* Collect the output */
                    compass.stdout.on('data', function(data) {
                        output += data;
                    });
                    
                    /* In case of an error, display a window with the error message(s). */
                    compass.on('exit', function(code) {
                        if (code !== 0) {
                            Alert.beep();
                            var win = new Window(),
                                html = output.replace(/\[(\d+)m/g, function(match, p) {
                                switch(p) {
                                    case '0':  return '</span>';
                                    case '31': return '<span class="error">';
                                    case '32': return '<span class="ok">';
                                    case '33': return '<span class="info">';
                                }
                                return match;
                            });
                            win.title = "Compass Output – " + doc.displayName();
                            win.buttons = ['OK'];
                            win.onButtonClick = function() { win.close(); }
                            win.htmlPath = "output.html";
                            win.useDefaultCSS = true;
                            win.run();
                            win.applyFunction(function (data) {
                                document.getElementById('output').innerHTML = data;
                            }, [html]);
                            
                            setTimeout(function() {
                                var winHeight = win.evalExpr('document.body.clientHeight')+96;
                                win.setFrame({x: 0, y: 0, width: 750, height: winHeight}, false);
                                win.center();
                                win.show();
                            }, 100);
                        } else {
                            Alert.notify({
                                title: "Compass",
                                subtitle: "Compiled successfully",
                                body: path
                            });
                        }
                    });
                    
                });
                
                return;
            }
            parts.pop();
        }
    }
});
