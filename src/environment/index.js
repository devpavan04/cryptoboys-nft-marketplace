const DEVELOPMENT = {
    API_URL: "http://localhost:22530"
}

let ENV_CONFIG = {};

switch(process.env.NODE_ENV) {
    case "STAGING": {
        ENV_CONFIG = {}
        break;
    }
    default: {
        ENV_CONFIG = DEVELOPMENT;
    }
}

export default ENV_CONFIG;