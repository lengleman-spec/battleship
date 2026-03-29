// jest.config.js
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".js"], // important for ESM
};
