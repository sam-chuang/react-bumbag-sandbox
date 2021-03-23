const httpProxy = require("http-proxy")

//TODO: mockserver
// const apiProxy = httpProxy.createServer({ target: "http://localhost:8080" })

module.exports = {
  mount: {
    public: "/",
    src: "/dist"
  },
  plugins: [
    "@snowpack/plugin-babel",
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv"
  ],
  devOptions: {
    port: 3000
  },
  buildOptions: {
    metaUrlPath: "snowpack"
  },
  routes: [
    {
      src: "/api/.*",
      dest: (req, res) => {
        return apiProxy.web(req, res)
      }
    },
    { match: "routes", src: ".*", dest: "/index.html" }
  ]
}
