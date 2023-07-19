// jest.config.js

module.exports = {
    // ...
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue'
    ],
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '\\.(js|jsx)$': 'babel-jest'
    },
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
    // ...
}
