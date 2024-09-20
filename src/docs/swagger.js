const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Cookie marketplace API",
            version: "1.0.0",
            description: "Express library API for Cookies marketplace"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: ["../controllers/*.js"],
}

module.exports = {options}