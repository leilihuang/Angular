var webpack=require('webpack');
var glob=require('glob');

function entries(){
    var entry={

    };
    glob.sync('./entries/action/*.js').forEach(function (file) {
        var ary=file.split('/');
        var name=ary[ary.length-1].split('.')[0];
        entry[name]=file;
    });
    return entry;
}

var config={
    entry:entries(),
    output:{
        path:'./dist/js',
        filename:'[name].js'
    },
    module:{
        loaders:[
            {
                test:/\.(js|jsx)$/,
                loader:'babel'
            }
        ]
    }
}