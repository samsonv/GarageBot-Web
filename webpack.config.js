module.exports = {
    output: { filename: "main.js" },
    module: {
        loaders: [
            { test: /\.js[x]?$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
}